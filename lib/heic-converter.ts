import sharp from 'sharp'

export interface HEICConversionResult {
  buffer: Buffer
  format: 'png' | 'jpeg'
  width: number
  height: number
  size: number
  originalSize: number
  wasConverted: boolean
  conversionMethod: 'sharp' | 'heic2any' | 'none'
}

/**
 * Check if Sharp has HEIC support by testing with actual HEIC headers
 */
async function hasSharpHEICSupport(): Promise<boolean> {
  try {
    // Test with a minimal HEIC header signature
    const heicHeader = Buffer.from([
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // Basic HEIC file signature
      0x68, 0x65, 0x69, 0x63, 0x00, 0x00, 0x00, 0x00
    ])
    
    await sharp(heicHeader, { failOn: 'none' }).metadata()
    return true
  } catch (error) {
    console.log('Sharp HEIC support check failed:', error)
    return false
  }
}

/**
 * Convert HEIC file using Sharp (server-side, fastest)
 */
async function convertWithSharp(
  buffer: Buffer, 
  targetFormat: 'png' | 'jpeg' = 'png',
  quality: number = 90
): Promise<HEICConversionResult> {
  const originalSize = buffer.length
  
  let pipeline = sharp(buffer)
  const metadata = await pipeline.metadata()
  
  // Convert to target format
  if (targetFormat === 'png') {
    pipeline = pipeline.png({
      quality,
      compressionLevel: 6, // Good balance between size and speed
      progressive: true
    })
  } else {
    pipeline = pipeline.jpeg({
      quality,
      mozjpeg: true,
      progressive: true
    })
  }
  
  const convertedBuffer = await pipeline.toBuffer()
  
  return {
    buffer: convertedBuffer,
    format: targetFormat,
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: convertedBuffer.length,
    originalSize,
    wasConverted: true,
    conversionMethod: 'sharp'
  }
}

/**
 * Convert HEIC file using heic2any (browser-side fallback)
 */
async function convertWithHeic2Any(
  file: File,
  targetFormat: 'png' | 'jpeg' = 'png',
  quality: number = 0.9
): Promise<HEICConversionResult> {
  const originalSize = file.size
  
  try {
    // Dynamic import to avoid server-side issues
    const { default: heic2any } = await import('heic2any')
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: `image/${targetFormat}`,
      quality: targetFormat === 'jpeg' ? quality : undefined
    }) as Blob
    
    const arrayBuffer = await convertedBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Get dimensions using Sharp if available, or estimate
    let width = 0, height = 0
    try {
      const metadata = await sharp(buffer).metadata()
      width = metadata.width || 0
      height = metadata.height || 0
    } catch {
      // In server environment, we can't determine dimensions without Sharp
      if (typeof window === 'undefined') {
        // Use default dimensions for server-side processing
        width = 1920
        height = 1080
      } else {
        // Fallback: create an image element to get dimensions (browser only)
        const img = new Image()
        const url = URL.createObjectURL(convertedBlob)
        await new Promise((resolve) => {
          img.onload = () => {
            width = img.width
            height = img.height
            URL.revokeObjectURL(url)
            resolve(void 0)
          }
          img.src = url
        })
      }
    }
    
    return {
      buffer,
      format: targetFormat,
      width,
      height,
      size: buffer.length,
      originalSize,
      wasConverted: true,
      conversionMethod: 'heic2any'
    }
  } catch (error) {
    throw new Error(`HEIC conversion failed with heic2any: ${error}`)
  }
}

/**
 * Main HEIC conversion function with automatic fallback
 */
export async function convertHEICToPNG(
  input: File | Buffer,
  options: {
    targetFormat?: 'png' | 'jpeg'
    quality?: number
    preferServerSide?: boolean
  } = {}
): Promise<HEICConversionResult> {
  const {
    targetFormat = 'png',
    quality = 90,
    preferServerSide = true
  } = options
  
  // Convert quality to 0-1 range for heic2any
  const heic2anyQuality = quality / 100
  
  // If we have a Buffer or prefer server-side, try Sharp first
  if (Buffer.isBuffer(input) || (preferServerSide && typeof window === 'undefined')) {
    try {
      const hasSupport = await hasSharpHEICSupport()
      if (hasSupport) {
        console.log('🔄 Converting HEIC with Sharp (server-side)')
        return await convertWithSharp(
          Buffer.isBuffer(input) ? input : Buffer.from(await input.arrayBuffer()),
          targetFormat,
          quality
        )
      }
    } catch (error) {
      console.warn('Sharp HEIC conversion failed, falling back to heic2any:', error)
    }
  }
  
  // Fallback to heic2any (works in browser and Node.js)
  if (input instanceof File) {
    console.log('🔄 Converting HEIC with heic2any (client-side)')
    return await convertWithHeic2Any(input, targetFormat, heic2anyQuality)
  } else {
    // In server environment, we can't use Blob/File APIs
    if (typeof window === 'undefined') {
      throw new Error('HEIC conversion requires a browser environment when Sharp is not available')
    }
    
    // Convert Buffer to File-like object for heic2any (browser only)
    const blob = new Blob([input], { type: 'image/heic' })
    const file = new File([blob], 'image.heic', { type: 'image/heic' })
    console.log('🔄 Converting HEIC with heic2any (buffer to file)')
    return await convertWithHeic2Any(file, targetFormat, heic2anyQuality)
  }
}

/**
 * Check if a file is HEIC/HEIF format (enhanced detection)
 */
export function isHEICFile(file: File | { name?: string; type?: string }): boolean {
  const heicMimeTypes = [
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
  ]
  
  const heicExtensions = ['.heic', '.heif', '.hif', '.HEIC', '.HEIF', '.HIF']
  
  // Check MIME type
  if (file.type && heicMimeTypes.includes(file.type.toLowerCase())) {
    return true
  }
  
  // Check file extension
  if (file.name) {
    const extension = file.name.toLowerCase()
    return heicExtensions.some(ext => extension.endsWith(ext.toLowerCase()))
  }
  
  return false
}

/**
 * Batch convert multiple HEIC files
 */
export async function convertHEICBatch(
  files: File[],
  options: {
    targetFormat?: 'png' | 'jpeg'
    quality?: number
    onProgress?: (completed: number, total: number, currentFile: string) => void
  } = {}
): Promise<{ successful: HEICConversionResult[]; failed: { file: string; error: string }[] }> {
  const {
    targetFormat = 'png',
    quality = 90,
    onProgress
  } = options
  
  const successful: HEICConversionResult[] = []
  const failed: { file: string; error: string }[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      onProgress?.(i, files.length, file.name)
      
      if (isHEICFile(file)) {
        const result = await convertHEICToPNG(file, { targetFormat, quality })
        successful.push(result)
      } else {
        // Not a HEIC file, skip conversion
        const buffer = Buffer.from(await file.arrayBuffer())
        successful.push({
          buffer,
          format: targetFormat,
          width: 0,
          height: 0,
          size: buffer.length,
          originalSize: file.size,
          wasConverted: false,
          conversionMethod: 'none'
        })
      }
    } catch (error) {
      failed.push({
        file: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  onProgress?.(files.length, files.length, 'Complete')
  
  return { successful, failed }
}

/**
 * Get optimal settings for HEIC conversion based on file size and use case
 */
export function getOptimalHEICSettings(
  fileSize: number,
  useCase: 'web' | 'print' | 'thumbnail' = 'web'
): {
  targetFormat: 'png' | 'jpeg'
  quality: number
  maxWidth: number
  maxHeight: number
} {
  const sizeMB = fileSize / (1024 * 1024)
  
  switch (useCase) {
    case 'thumbnail':
      return {
        targetFormat: 'jpeg',
        quality: 75,
        maxWidth: 400,
        maxHeight: 400
      }
    
    case 'print':
      return {
        targetFormat: 'png',
        quality: 95,
        maxWidth: 3000,
        maxHeight: 3000
      }
    
    case 'web':
    default:
      // For large files, use JPEG with good quality
      // For smaller files or when transparency might be needed, use PNG
      if (sizeMB > 5) {
        return {
          targetFormat: 'jpeg',
          quality: 85,
          maxWidth: 1920,
          maxHeight: 1080
        }
      } else {
        return {
          targetFormat: 'png',
          quality: 90,
          maxWidth: 1920,
          maxHeight: 1080
        }
      }
  }
} 