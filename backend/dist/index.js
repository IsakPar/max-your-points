"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const logger_1 = require("./utils/logger");
const path_1 = __importDefault(require("path"));
// Load environment variables first
dotenv_1.default.config();
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const articles_1 = __importDefault(require("./routes/articles"));
const categories_1 = __importDefault(require("./routes/categories"));
const media_1 = __importDefault(require("./routes/media"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3005', 10); // Convert to number for Railway
const logger = (0, logger_1.createLogger)();
// Initialize Prisma with proper configuration
let prisma = null;
exports.prisma = prisma;
let dbConnected = false;
// Async function to initialize database connection
async function initializeDatabase() {
    try {
        logger.info('🔄 Initializing database connection...');
        if (!process.env.DATABASE_URL) {
            logger.warn('⚠️ No DATABASE_URL found, skipping database connection');
            dbConnected = false;
            return;
        }
        // Initialize Prisma client with proper configuration
        exports.prisma = prisma = new client_1.PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['info', 'warn', 'error'] : ['warn', 'error'],
            errorFormat: 'pretty'
        });
        // Test the connection
        await prisma.$connect();
        await prisma.$queryRaw `SELECT 1`;
        dbConnected = true;
        logger.info('✅ Database connected successfully');
    }
    catch (error) {
        logger.error('❌ Database connection failed:', error.message);
        logger.info('🔄 Server will continue with limited functionality');
        // Set prisma to null if connection fails
        exports.prisma = prisma = null;
        dbConnected = false;
    }
}
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.path} - ${req.ip}`);
        next();
    });
}
// Health check endpoint - MUST be first
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Max Your Points Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            test: '/api/test',
            auth: '/api/auth',
            articles: '/api/articles'
        }
    });
});
// Test endpoint that doesn't require database
app.get('/api/test', (req, res) => {
    res.status(200).json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development',
        hasDbUrl: !!process.env.DATABASE_URL
    });
});
// Database status endpoint
app.get('/api/database/status', (req, res) => {
    res.status(200).json({
        connected: dbConnected,
        timestamp: new Date().toISOString(),
        prismaStatus: prisma ? 'initialized' : 'not initialized'
    });
});
// Database test endpoint
app.get('/api/database/test', async (req, res) => {
    if (!prisma || !dbConnected) {
        return res.status(503).json({
            error: 'Database not connected',
            connected: dbConnected
        });
    }
    try {
        const result = await prisma.$queryRaw `SELECT version()`;
        res.status(200).json({
            success: true,
            database: result,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Database query failed',
            message: error.message
        });
    }
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/articles', articles_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/media', media_1.default);
app.use('/api/admin', admin_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        availableRoutes: ['/health', '/', '/api/test', '/api/auth', '/api/articles']
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    if (prisma) {
        await prisma.$disconnect();
    }
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    if (prisma) {
        await prisma.$disconnect();
    }
    process.exit(0);
});
// Start server
function startServer() {
    const server = app.listen(PORT, '0.0.0.0', () => {
        logger.info(`🚀 Max Your Points Backend running on port ${PORT}`);
        logger.info(`📊 Health check: http://localhost:${PORT}/health`);
        logger.info(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
        logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        // Initialize database connection in background
        initializeDatabase().catch(err => {
            logger.error('Database initialization failed:', err);
        });
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${PORT} is already in use`);
        }
        else {
            logger.error('Server error:', error);
        }
        process.exit(1);
    });
    return server;
}
// Start the server
startServer();
//# sourceMappingURL=index.js.map