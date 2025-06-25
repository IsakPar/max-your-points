import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
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

// Initialize database clients
let prisma: PrismaClient | null = null;
let pgPool: Pool | null = null;
let dbConnected = false;
let usingPrisma = false;

// Async function to initialize database connection with better error handling
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
    
    // Try to initialize Prisma with multiple fallback strategies
    let prismaInitialized = false;
    
    // Strategy 1: Try with basic configuration
    try {
      logger.info('Attempting Prisma initialization (strategy 1)...');
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl
          }
        }
      });
      await prisma.$connect();
      prismaInitialized = true;
      logger.info('✅ Prisma strategy 1 successful');
    } catch (error: any) {
      logger.warn('Strategy 1 failed:', error.message);
    }
    
    // Strategy 2: Try with minimal configuration if strategy 1 failed
    if (!prismaInitialized) {
      try {
        logger.info('Attempting Prisma initialization (strategy 2)...');
        if (prisma) {
          await prisma.$disconnect();
        }
        prisma = new PrismaClient();
        await prisma.$connect();
        prismaInitialized = true;
        logger.info('✅ Prisma strategy 2 successful');
      } catch (error: any) {
        logger.warn('Strategy 2 failed:', error.message);
      }
    }
    
    if (prismaInitialized && prisma) {
      // Test the connection
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
      usingPrisma = true;
      logger.info('✅ Database connected successfully via Prisma');
    } else {
      logger.warn('All Prisma initialization strategies failed, trying native PostgreSQL client...');
      
      // Strategy 3: Use native PostgreSQL client as fallback
      try {
        pgPool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        // Test the connection
        const client = await pgPool.connect();
        await client.query('SELECT 1');
        client.release();
        
        dbConnected = true;
        usingPrisma = false;
        logger.info('✅ Database connected successfully via native PostgreSQL client');
      } catch (pgError: any) {
        logger.error('Native PostgreSQL client also failed:', pgError.message);
        throw new Error('All database connection strategies failed');
      }
    }
    
  } catch (error: any) {
    logger.error('❌ Database connection failed:', error.message);
    logger.info('🔄 Server will continue with limited functionality');
    
    // Clean up connections if initialization fails
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        logger.warn('Error disconnecting Prisma:', disconnectError);
      }
    }
    if (pgPool) {
      try {
        await pgPool.end();
      } catch (disconnectError) {
        logger.warn('Error disconnecting PostgreSQL pool:', disconnectError);
      }
    }
    prisma = null;
    pgPool = null;
    dbConnected = false;
    usingPrisma = false;
  }
}

// Export database clients for routes to use
export { prisma, pgPool, usingPrisma };

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
    prismaStatus: prisma ? 'initialized' : 'not initialized',
    pgPoolStatus: pgPool ? 'initialized' : 'not initialized',
    databaseClient: usingPrisma ? 'prisma' : 'postgresql'
  });
});

// Database test endpoint
app.get('/api/database/test', async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({
      error: 'Database not connected',
      connected: dbConnected
    });
  }

  try {
    let result;
    
    if (usingPrisma && prisma) {
      result = await prisma.$queryRaw`SELECT version() as version`;
    } else if (pgPool) {
      const client = await pgPool.connect();
      try {
        const queryResult = await client.query('SELECT version()');
        result = queryResult.rows;
      } finally {
        client.release();
      }
    } else {
      throw new Error('No database client available');
    }
    
    res.status(200).json({
      success: true,
      database: result,
      client: usingPrisma ? 'prisma' : 'postgresql',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Database query failed',
      message: error.message,
      client: usingPrisma ? 'prisma' : 'postgresql'
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
  if (pgPool) {
    await pgPool.end();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  if (prisma) {
    await prisma.$disconnect();
  }
  if (pgPool) {
    await pgPool.end();
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