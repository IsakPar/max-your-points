import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger';
import path from 'path';

// Load environment variables first
dotenv.config({ path: '.env' });

// Debug environment variables in development
if (process.env.NODE_ENV !== 'production') {
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
}

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import articleRoutes from './routes/articles';
import categoryRoutes from './routes/categories';
import mediaRoutes from './routes/media';
import adminRoutes from './routes/admin';

const app = express();
const PORT = parseInt(process.env.PORT || '3005', 10); // Convert to number for Railway
const logger = createLogger();

// Initialize Prisma with proper configuration
let prisma: PrismaClient | null = null;
let dbConnected = false;

// Async function to initialize database connection
async function initializeDatabase() {
  try {
    logger.info('🔄 Initializing database connection...');
    
    // More detailed environment variable checking
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      logger.warn('⚠️ No DATABASE_URL found, skipping database connection');
      logger.info('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE')));
      dbConnected = false;
      return;
    }
    
    logger.info('✅ DATABASE_URL found, attempting connection...');
    
    // Initialize Prisma client with minimal configuration to prevent core dump
    prisma = new PrismaClient();
    
    // Test the connection
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    
    dbConnected = true;
    logger.info('✅ Database connected successfully');
    
  } catch (error: any) {
    logger.error('❌ Database connection failed:', error.message);
    logger.info('🔄 Server will continue with limited functionality');
    
    // Set prisma to null if connection fails
    prisma = null;
    dbConnected = false;
  }
}

// Export prisma for routes to use
export { prisma };

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
    const result = await prisma.$queryRaw`SELECT version()`;
    res.status(200).json({
      success: true,
      database: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Database query failed',
      message: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/health', '/', '/api/test', '/api/auth', '/api/articles']
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Max Your Points Backend running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 