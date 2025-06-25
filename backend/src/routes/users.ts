import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();

// Initialize Prisma client (handle connection gracefully)
let prisma: PrismaClient | null = null;
try {
  prisma = new PrismaClient();
  console.log('📊 Prisma connected successfully for users');
} catch (error) {
  console.warn('⚠️ Prisma connection failed for users:', error);
  prisma = null;
}

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  fullName: z.string().optional(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']).default('USER')
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  fullName: z.string().optional(),
  role: z.enum(['USER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN']).optional()
});

// Helper function to verify JWT token
const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || 'development-secret-key';
    return jwt.verify(token, secret) as any;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// GET /users - Get all users (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    if (!prisma) {
      // Return mock data when database is unavailable
      const mockUsers = [
        {
          id: 'temp-admin-001',
          email: 'isak@maxyourpoints.com',
          name: 'Isak Parild',
          fullName: 'Isak Parild',
          role: 'SUPER_ADMIN',
          verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ];
      
      return res.json({
        success: true,
        users: mockUsers,
        message: 'Mock data - database unavailable'
      });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
        verified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Users GET error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /users - Create new user (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    const validatedData = createUserSchema.parse(req.body);

    if (!prisma) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Cannot create users when database is disconnected'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        fullName: validatedData.fullName || validatedData.name,
        role: validatedData.role,
        verified: true // Auto-verify admin-created users
      }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        fullName: user.fullName,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Failed to create user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /users/:id - Update user (admin only)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    const validatedData = updateUserSchema.parse(req.body);

    if (!prisma) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Cannot update users when database is disconnected'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check email uniqueness if email is being updated
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailExists) {
        return res.status(400).json({
          error: 'Email already exists',
          message: 'A user with this email already exists'
        });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        role: true,
        verified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('User update error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Failed to update user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /users/:id - Delete user (admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['SUPER_ADMIN'].includes(decoded.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Super admin access required for user deletion'
      });
    }

    if (!prisma) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'Cannot delete users when database is disconnected'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Prevent self-deletion
    if (decoded.userId === id) {
      return res.status(400).json({
        error: 'Cannot delete yourself'
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 