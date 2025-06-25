'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ImageIcon, Trash2, Copy, Search, Upload, Loader2, Check, AlertCircle, Edit, Tag, Calendar, FileImage } from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'
import ImageUpload from '../components/ImageUpload'

interface ImageMetadata {
  id: string
  file_path: string
  file_name: string
  public_url: string
  alt_text: string
  caption: string
  title: string
  file_size: number
  original_size: number
  mime_type: string
  format: string
  width: number
  height: number
  compression_ratio: number
  was_heic: boolean
  was_optimized: boolean
  usage_count: number
  last_used_at: string
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}

export default function MediaPage() {
  const [images, setImages] = useState<ImageMetadata[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [editingImage, setEditingImage] = useState<ImageMetadata | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const { showToast } = useToast()

  const loadImageMetadata = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Get image metadata from our database
      const response = await fetch('/api/admin/images')

      if (!response.ok) {
        throw new Error('Failed to load image metadata')
      }

      const data = await response.json()
      setImages(data || [])
      setFilteredImages(data || [])

    } catch (err: any) {
      console.error('Error loading image metadata:', err)
      setError(`Failed to load image metadata: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter images based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredImages(images)
      return
    }

    const filtered = images.filter(image =>
      image.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredImages(filtered)
  }, [searchTerm, images])

  useEffect(() => {
    loadImageMetadata()
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast({
        title: "Copied!",
        description: "URL copied to clipboard",
        variant: "success"
      })
    } catch (err) {
              showToast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "error"
        })
    }
  }

  const deleteImage = async (image: ImageMetadata) => {
    if (!confirm(`Are you sure you want to delete "${image.file_name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/images/${encodeURIComponent(image.public_url)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      showToast({
        title: "Image deleted",
        description: `"${image.file_name}" has been deleted`,
        variant: "success"
      })

      // Reload images
      loadImageMetadata()

    } catch (err: any) {
              showToast({
          title: "Delete failed",
          description: err.message,
          variant: "error"
        })
    }
  }

  const updateImageMetadata = async (image: ImageMetadata, updates: Partial<ImageMetadata>) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/images/${encodeURIComponent(image.public_url)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
      }

             showToast({
         title: "Metadata updated",
         description: `"${image.file_name}" metadata has been updated`,
         variant: "success"
       })

       // Reload images
       loadImageMetadata()
       setEditingImage(null)

     } catch (err: any) {
       showToast({
         title: "Update failed",
         description: err.message,
         variant: "error"
       })
    } finally {
      setIsUpdating(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading media library...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your uploaded images and their metadata
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
            <CardDescription>
              Upload an image with alt text and metadata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value=""
              onChange={(url) => {
                if (url) {
                                     showToast({
                     title: "Image uploaded",
                     description: "Image uploaded successfully with metadata",
                     variant: "success"
                   })
                  setShowUpload(false)
                  loadImageMetadata()
                }
              }}
              onAltChange={() => {}}
              onCaptionChange={() => {}}
              onTitleChange={() => {}}
              label="Upload Image"
              showMetadataFields={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by filename, alt text, caption, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{filteredImages.length} images</span>
          <span>Total size: {formatFileSize(images.reduce((sum, img) => sum + img.file_size, 0))}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={image.public_url}
                alt={image.alt_text || image.file_name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(image.public_url)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => setEditingImage(image)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={() => deleteImage(image)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-medium text-sm truncate mb-2">{image.file_name}</h3>
              
              {image.alt_text && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  <strong>Alt:</strong> {image.alt_text}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{image.width} × {image.height}</span>
                <span>{formatFileSize(image.file_size)}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {image.format.toUpperCase()}
                </Badge>
                <span>Used {image.usage_count} times</span>
              </div>
              
              {image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{image.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No images match your search.' : 'Upload some images to get started.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Image
            </Button>
          )}
        </div>
      )}

      {/* Edit Image Metadata Dialog */}
      <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Image Metadata</DialogTitle>
            <DialogDescription>
              Update the alt text, caption, and other metadata for this image.
            </DialogDescription>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-4">
              <div className="aspect-video">
                <img
                  src={editingImage.public_url}
                  alt={editingImage.alt_text || editingImage.file_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div>
                <Label>Alt Text <span className="text-red-500">*</span></Label>
                <Textarea
                  placeholder="Describe the image for accessibility and SEO..."
                  value={editingImage.alt_text}
                  onChange={(e) => setEditingImage({
                    ...editingImage,
                    alt_text: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Caption</Label>
                <Input
                  placeholder="Optional caption..."
                  value={editingImage.caption}
                  onChange={(e) => setEditingImage({
                    ...editingImage,
                    caption: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Optional title attribute..."
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({
                    ...editingImage,
                    title: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => updateImageMetadata(editingImage, {
                    alt_text: editingImage.alt_text,
                    caption: editingImage.caption,
                    title: editingImage.title
                  })}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 