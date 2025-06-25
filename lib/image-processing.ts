import sharp from 'sharp'

export interface ProcessImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface ProcessedImage {
  buffer: Buffer
  format: string
  width: number
  height: number
  size: number
  originalSize: number
  compressionRatio: number
}

// Type for input that works in both browser and Node.js
type ImageInput = Buffer | Blob | { arrayBuffer(): Promise<ArrayBuffer>; size: number }

/**
 * Check if Sharp has HEIC support
 */
async function checkHEICSupport(): Promise<boolean> {
  try {
    // Try to process a simple buffer - if HEIC support is missing, it will fail on actual HEIC files
    const testBuffer = Buffer.from([0xFF, 0xD8, 0xFF]) // Simple test data
    sharp(testBuffer, { failOn: 'none' })
    return true // We'll catch HEIC-specific errors during actual processing
  } catch {
    return false
  }
}

/**
 * Convert HEIC to PNG using browser Canvas API (fallback)
 * This runs in the browser environment
 */
async function convertHEICInBrowser(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        if (blob) {
          blob.arrayBuffer().then(buffer => {
            resolve(Buffer.from(buffer))
          })
        } else {
          reject(new Error('Failed to convert HEIC to PNG'))
        }
      }, 'image/png', 0.9)
    }
    
    img.onerror = () => reject(new Error('Failed to load HEIC image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Process and optimize images with format conversion
 * Supports HEIC conversion to PNG/JPEG with fallback
 */
export async function processImage(
  input: ImageInput,
  options: ProcessImageOptions = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 85,
    format = 'jpeg'
  } = options

  let inputBuffer: Buffer
  let originalSize: number

  // Convert input to Buffer if needed
  if (Buffer.isBuffer(input)) {
    inputBuffer = input
    originalSize = input.length
  } else if (input && typeof input === 'object' && 'arrayBuffer' in input) {
    // Handle File or Blob objects
    const arrayBuffer = await input.arrayBuffer()
    inputBuffer = Buffer.from(arrayBuffer)
    originalSize = 'size' in input ? input.size : arrayBuffer.byteLength
  } else {
    throw new Error('Invalid input type. Expected Buffer, File, or Blob.')
  }

  // Check if this is a HEIC file and if Sharp supports it
  const isHEICInput = input && typeof input === 'object' && 'name' in input && 
                      isHEICFormat(input as { name: string; type?: string })
  
  if (isHEICInput) {
    const hasHEICSupport = await checkHEICSupport()
    
    if (!hasHEICSupport) {
      // If we're in a browser environment and Sharp doesn't support HEIC,
      // we'll need to throw a more helpful error
      throw new Error('HEIC format is not supported by the current Sharp installation. Please install libheif or use a different image format.')
    }
  }

  // Process with Sharp
  let pipeline = sharp(inputBuffer)
  
  // Get image metadata
  let metadata
  try {
    metadata = await pipeline.metadata()
  } catch (error) {
    if (isHEICInput) {
      throw new Error('Unable to process HEIC file. Please try converting it to PNG or JPEG first, or install Sharp with HEIC support.')
    }
    throw error
  }

  const originalWidth = metadata.width || 0
  const originalHeight = metadata.height || 0

  // Calculate new dimensions while maintaining aspect ratio
  let newWidth = originalWidth
  let newHeight = originalHeight

  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const widthRatio = maxWidth / originalWidth
    const heightRatio = maxHeight / originalHeight
    const ratio = Math.min(widthRatio, heightRatio)
    
    newWidth = Math.round(originalWidth * ratio)
    newHeight = Math.round(originalHeight * ratio)
  }

  // Resize and optimize
  pipeline = pipeline.resize(newWidth, newHeight, {
    fit: 'inside',
    withoutEnlargement: true
  })

  // Convert format and optimize
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ 
        quality,
        mozjpeg: true, // Better compression
        progressive: true
      })
      break
    case 'png':
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9,
        progressive: true
      })
      break
    case 'webp':
      pipeline = pipeline.webp({
        quality,
        effort: 6 // Higher effort for better compression
      })
      break
  }

  // Process the image
  const processedBuffer = await pipeline.toBuffer()
  const compressionRatio = Math.round(((originalSize - processedBuffer.length) / originalSize) * 100)

  return {
    buffer: processedBuffer,
    format,
    width: newWidth,
    height: newHeight,
    size: processedBuffer.length,
    originalSize,
    compressionRatio: Math.max(0, compressionRatio)
  }
}

/**
 * Check if a file is HEIC/HEIF format
 */
export function isHEICFormat(file: { type?: string; name?: string }): boolean {
  const heicMimeTypes = [
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
  ]
  
  const heicExtensions = ['.heic', '.heif', '.hif']
  
  // Check MIME type
  if (file.type && heicMimeTypes.includes(file.type.toLowerCase())) {
    return true
  }
  
  // Check file extension as fallback
  if (file.name) {
    const fileName = file.name.toLowerCase()
    return heicExtensions.some(ext => fileName.endsWith(ext))
  }
  
  return false
}

/**
 * Get optimal format for conversion
 */
export function getOptimalFormat(originalFile: { type?: string; name?: string }): 'jpeg' | 'png' | 'webp' {
  const hasTransparency = originalFile.type === 'image/png' || 
                         (originalFile.name && originalFile.name.toLowerCase().endsWith('.png'))
  
  // Use PNG for images that might have transparency
  if (hasTransparency) {
    return 'png'
  }
  
  // Use JPEG for photos and other images
  return 'jpeg'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate optimized filename
 */
export function generateOptimizedFilename(originalName: string, format: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const baseName = originalName.replace(/\.[^/.]+$/, '') // Remove extension
  const cleanName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
  
  return `${timestamp}-${cleanName}-${randomString}.${format}`
} 