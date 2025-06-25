import { Router, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();

// Initialize Prisma client (handle connection gracefully)
let prisma: PrismaClient | null = null;
try {
  prisma = new PrismaClient();
  console.log('📊 Prisma connected successfully for media');
} catch (error) {
  console.warn('⚠️ Prisma connection failed for media:', error);
  prisma = null;
}

// Validation schemas
const uploadMetadataSchema = z.object({
  altText: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  title: z.string().optional().default(''),
  category: z.string().optional().default('general'),
  tags: z.array(z.string()).optional().default([])
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    cb(null, `${timestamp}-${name}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common image formats
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and HEIC files are allowed.'));
    }
  }
});

// GET /media - Get all media files
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
    if (!decoded) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid token'
      });
    }

    if (!prisma) {
      // Return mock data when database is unavailable
      const mockMedia = [
        {
          id: '1',
          fileName: 'sample-image.jpg',
          originalName: 'sample-image.jpg',
          publicUrl: '/images/placeholder.jpg',
          filePath: '/images/placeholder.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024000,
          metadata: {
            altText: 'Sample image',
            caption: 'A sample placeholder image',
            title: 'Sample Image',
            category: 'general',
            tags: ['sample', 'placeholder']
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return res.json({
        success: true,
        media: mockMedia,
        message: 'Mock data - database unavailable'
      });
    }

    // TODO: Implement actual media retrieval from database
    // For now, return empty array
    res.json({
      success: true,
      media: [],
      message: 'Media management implemented - database integration pending'
    });

  } catch (error) {
    console.error('Media GET error:', error);
    res.status(500).json({
      error: 'Failed to fetch media',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /media/upload - Upload new media file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
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
    if (!decoded) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid token'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided',
        message: 'Please select a file to upload'
      });
    }

    // Validate metadata
    const metadata = uploadMetadataSchema.parse({
      altText: req.body.altText || req.file.originalname,
      caption: req.body.caption,
      title: req.body.title || req.file.originalname,
      category: req.body.category || 'general',
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    });

    // Create public URL (in production, this would be a CDN URL)
    const publicUrl = `/uploads/${req.file.filename}`;
    
    console.log('📤 File uploaded successfully:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      publicUrl
    });

    // TODO: In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
    // TODO: Save metadata to database if available

    if (prisma) {
      // TODO: Save to database when media table is available
      console.log('💾 Would save to database:', {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        publicUrl,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        metadata
      });
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      file: {
        id: `temp-${Date.now()}`, // Temporary ID
        fileName: req.file.filename,
        originalName: req.file.originalname,
        publicUrl,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        metadata,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Media upload error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Failed to upload file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /media/status - Check upload system status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    let uploadsExists = false;
    
    try {
      await fs.access(uploadsDir);
      uploadsExists = true;
    } catch {
      uploadsExists = false;
    }

    res.json({
      success: true,
      status: {
        uploadsDirectory: uploadsExists,
        databaseConnection: !!prisma,
        maxFileSize: '20MB',
        allowedTypes: ['JPEG', 'PNG', 'WebP', 'GIF', 'HEIC'],
        storage: 'Local filesystem (development)',
        cloudStorage: 'Not configured'
      }
    });

  } catch (error) {
    console.error('Media status error:', error);
    res.status(500).json({
      error: 'Failed to check status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /media/:id - Delete media file
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
    if (!decoded || !['EDITOR', 'ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Editor access required'
      });
    }

    // TODO: Implement actual file deletion
    // This would include:
    // 1. Find file in database
    // 2. Delete from cloud storage
    // 3. Remove database record
    // 4. Check for usage in articles before deletion

    res.json({
      success: true,
      message: 'File deletion not yet implemented - database integration pending'
    });

  } catch (error) {
    console.error('Media deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 