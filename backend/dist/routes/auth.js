"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const index_1 = require("../index");
const router = (0, express_1.Router)();
// Temporary in-memory user for development (when DB is not available)
const TEMP_ADMIN = {
    id: 'temp-admin-001',
    email: 'isak@maxyourpoints.com',
    password: '$2a$12$qXuA3.QFdVIow5scaKSFCe7pUfwPGhhD6vZLJCbzHo7pAqvjK3uJS', // admin123
    name: 'Isak Parild',
    role: 'SUPER_ADMIN'
};
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters')
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required')
});
// Helper function to generate JWT
const generateToken = (userId, email, role) => {
    return jsonwebtoken_1.default.sign({ userId, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// POST /auth/register - Register new user
router.post('/register', async (req, res) => {
    try {
        if (!index_1.prisma) {
            return res.status(503).json({
                error: 'Database unavailable',
                message: 'Database connection not established. Registration disabled in development mode.'
            });
        }
        const { email, password, name } = registerSchema.parse(req.body);
        // Check if user already exists
        const existingUser = await index_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'An account with this email already exists'
            });
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user
        const user = await index_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER', // Default role
                verified: true // Auto-verify for simplicity
            }
        });
        // Generate token
        const token = generateToken(user.id, user.email, user.role);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create user'
        });
    }
});
// POST /auth/login - Login user
router.post('/login', async (req, res) => {
    try {
        // Debug logging - log the raw request body
        console.log('🔍 Raw request body:', req.body);
        console.log('🔍 Request headers:', req.headers);
        console.log('🔍 Content-Type:', req.headers['content-type']);
        const { email, password } = loginSchema.parse(req.body);
        console.log('✅ Validation passed - Email:', email, 'Password length:', password?.length);
        // If database is available, use it
        if (index_1.prisma) {
            try {
                console.log('🔍 Checking database for user...');
                // Find user in database
                const user = await index_1.prisma.user.findUnique({
                    where: { email }
                });
                console.log('👤 Database user found:', user ? 'YES' : 'NO');
                if (user && user.password) {
                    console.log('🔐 Checking password...');
                    // Verify password
                    const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
                    console.log('🔐 Password valid:', isValidPassword);
                    if (isValidPassword) {
                        console.log('✅ Database login successful');
                        // Update last login
                        await index_1.prisma.user.update({
                            where: { id: user.id },
                            data: { updatedAt: new Date() }
                        });
                        // Generate token
                        const token = generateToken(user.id, user.email, user.role);
                        return res.json({
                            message: 'Login successful',
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                role: user.role
                            },
                            token
                        });
                    }
                }
            }
            catch (dbError) {
                console.log('💥 Database login failed, falling back to temp admin:', dbError instanceof Error ? dbError.message : dbError);
            }
        }
        console.log('🔄 Database not available or user not found, checking temp admin...');
        console.log('🔍 Temp admin email:', TEMP_ADMIN.email);
        console.log('🔍 Input email:', email);
        console.log('🔍 Email match:', email === TEMP_ADMIN.email);
        // Fallback: Check against temporary admin user
        if (email === TEMP_ADMIN.email) {
            console.log('📧 Email matches temp admin, checking password...');
            const isValidPassword = await bcryptjs_1.default.compare(password, TEMP_ADMIN.password);
            console.log('🔐 Temp admin password valid:', isValidPassword);
            if (isValidPassword) {
                console.log('✅ Temp admin login successful');
                // Generate token
                const token = generateToken(TEMP_ADMIN.id, TEMP_ADMIN.email, TEMP_ADMIN.role);
                return res.json({
                    message: 'Login successful (development mode)',
                    user: {
                        id: TEMP_ADMIN.id,
                        email: TEMP_ADMIN.email,
                        name: TEMP_ADMIN.name,
                        role: TEMP_ADMIN.role
                    },
                    token,
                    devMode: true
                });
            }
            else {
                console.log('❌ Temp admin password invalid');
            }
        }
        else {
            console.log('❌ Email does not match temp admin');
        }
        console.log('❌ Invalid credentials - neither database nor temp admin worked');
        // Invalid credentials
        return res.status(401).json({
            error: 'Invalid credentials',
            message: 'Email or password is incorrect'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to login'
        });
    }
});
// GET /auth/me - Get current user info
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // If database is available, try to get user from DB
        if (index_1.prisma) {
            try {
                const user = await index_1.prisma.user.findUnique({
                    where: { id: decoded.userId },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        createdAt: true
                    }
                });
                if (user) {
                    return res.json({ user });
                }
            }
            catch (dbError) {
                console.log('Database user lookup failed, checking temp admin');
            }
        }
        // Fallback: Check if it's the temporary admin
        if (decoded.userId === TEMP_ADMIN.id) {
            return res.json({
                user: {
                    id: TEMP_ADMIN.id,
                    email: TEMP_ADMIN.email,
                    name: TEMP_ADMIN.name,
                    role: TEMP_ADMIN.role,
                    createdAt: new Date().toISOString(),
                    devMode: true
                }
            });
        }
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
    catch (error) {
        console.error('Auth verification error:', error);
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
});
// POST /auth/change-password - Change user password
router.post('/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Missing fields',
                message: 'Current password and new password are required'
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                error: 'Invalid password',
                message: 'New password must be at least 8 characters'
            });
        }
        // Check if it's the temporary admin
        if (decoded.userId === TEMP_ADMIN.id) {
            return res.status(400).json({
                error: 'Operation not supported',
                message: 'Password change not supported for temporary admin. Set up database for full functionality.'
            });
        }
        if (!index_1.prisma) {
            return res.status(503).json({
                error: 'Database unavailable',
                message: 'Database connection not established'
            });
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User not found'
            });
        }
        // Check if user has a password
        if (!user.password) {
            return res.status(400).json({
                error: 'Invalid operation',
                message: 'This account uses OAuth authentication'
            });
        }
        // Verify current password
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                error: 'Invalid password',
                message: 'Current password is incorrect'
            });
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password
        await index_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedNewPassword,
                updatedAt: new Date()
            }
        });
        res.json({
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to change password'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map