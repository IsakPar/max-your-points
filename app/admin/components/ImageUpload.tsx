'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onAltChange?: (alt: string) => void
  altValue?: string
  onCaptionChange?: (caption: string) => void
  captionValue?: string
  onTitleChange?: (title: string) => void
  titleValue?: string
  label?: string
  className?: string
  category?: string
  showMetadataFields?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onAltChange,
  altValue = '',
  onCaptionChange,
  captionValue = '',
  onTitleChange,
  titleValue = '',
  label = "Hero Image",
  className,
  category = 'article',
  showMetadataFields = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      // Validate file size (20MB limit for processing)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('File size must be less than 20MB')
      }

      // Check for HEIC format
      const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' || 
                     file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif')

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!isHEIC && !allowedTypes.includes(file.type)) {
        throw new Error('Supported formats: JPEG, PNG, WebP, GIF, HEIC/HEIF')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', altValue)
      formData.append('caption', captionValue)
      formData.append('title', titleValue)
      formData.append('category', category)

      // Use API client which includes authentication
      const result = await api.uploadFile(formData)

      onChange(result.url)
      
      // Show success message with processing details
      let successMessage = 'Image uploaded successfully!'
      if (result.wasHEIC) {
        successMessage = `HEIC converted to PNG and uploaded! (${result.compressionRatio}% size reduction)`
      } else if (result.optimized && result.compressionRatio > 0) {
        successMessage = `Image optimized and uploaded! (${result.compressionRatio}% size reduction)`
      }
      
      setSuccess(successMessage)
      
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setSuccess('Image URL updated!')
      setError('')
    }
  }

  const clearImage = () => {
    onChange('')
    setUrlInput('')
    setSuccess('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('upload')}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('url')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {uploadMethod === 'upload' ? (
        <Card>
          <CardContent className="p-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                isUploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </div>
              ) : (
                                                 <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Drop an image here, or click to select</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP, GIF, HEIC (max 20MB)</p>
                  <p className="text-xs text-amber-600 mt-1">⚠️ HEIC support may vary - PNG/JPEG recommended</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter image URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Set URL
            </Button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {value && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={value}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={() => setError('Failed to load image')}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={clearImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm font-medium">Image Preview</p>
                <p className="text-xs text-gray-500 break-all">{value}</p>
                
                {showMetadataFields && (
                  <div className="space-y-3">
                    {onAltChange && (
                      <div>
                        <Label className="text-sm font-medium text-blue-700">
                          Alt Text <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Describe the image for accessibility and SEO..."
                          value={altValue}
                          onChange={(e) => onAltChange(e.target.value)}
                          className="text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This text will be used everywhere this image appears on your site
                        </p>
                      </div>
                    )}
                    
                    {onCaptionChange && (
                      <div>
                        <Label className="text-sm font-medium">Caption</Label>
                        <Input
                          type="text"
                          placeholder="Optional caption for the image..."
                          value={captionValue}
                          onChange={(e) => onCaptionChange(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    )}
                    
                    {onTitleChange && (
                      <div>
                        <Label className="text-sm font-medium">Title</Label>
                        <Input
                          type="text"
                          placeholder="Optional title attribute..."
                          value={titleValue}
                          onChange={(e) => onTitleChange(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 