'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Image as ImageIcon, Search, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface MediaItem {
  name: string
  url: string
  size: number
  created_at: string
  metadata?: {
    alt_text?: string
    caption?: string
    title?: string
  }
}

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  onAltChange?: (alt: string) => void
  altValue?: string
  label?: string
  className?: string
}

export default function MediaPicker({ 
  value, 
  onChange, 
  onAltChange,
  altValue = '',
  label = "Featured Image",
  className
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState(value || '')
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [error, setError] = useState('')

  // Load media items when dialog opens
  useEffect(() => {
    if (isOpen && mediaItems.length === 0) {
      loadMediaItems()
    }
  }, [isOpen])

  const loadMediaItems = async () => {
    setIsLoading(true)
    setError('')

    try {
      console.log('🖼️ MediaPicker loading images...')
      const result = await api.getMedia()
      console.log('📸 MediaPicker API response:', result)
      
      if (result.success) {
        const images = result.images || []
        console.log(`✅ MediaPicker loaded ${images.length} images`)
        
        // Transform the data to match MediaItem interface
        const transformedImages = images.map((img: any) => ({
          name: img.filename || img.file_name || 'Untitled',
          url: img.url || img.public_url,
          size: img.file_size || 0,
          created_at: img.created_at,
          metadata: {
            alt_text: img.alt_text,
            caption: img.caption,
            title: img.title
          }
        }))
        
        setMediaItems(transformedImages)
        setError('')
      } else {
        const errorMsg = result.error || 'Failed to load media'
        console.error('❌ MediaPicker API error:', errorMsg)
        setError(errorMsg)
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to load media'
      console.error('❌ MediaPicker failed to load media:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError('')
    
    try {
      console.log('📤 MediaPicker uploading:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', altValue || file.name)
      formData.append('category', 'articles')

      // Use API client which includes authentication
      const result = await api.uploadFile(formData)
      console.log('📥 MediaPicker upload response:', result)

      // Add new image to the list
      const newImage: MediaItem = {
        name: file.name,
        url: result.url,
        size: file.size,
        created_at: new Date().toISOString(),
        metadata: { alt_text: altValue || file.name }
      }
      
      setMediaItems(prev => [newImage, ...prev])
      setSelectedImage(result.url)
      console.log('✅ MediaPicker upload successful')
      
    } catch (error: any) {
      const errorMsg = error.message || 'Upload failed'
      console.error('❌ MediaPicker upload error:', errorMsg)
      setError(`Upload failed: ${errorMsg}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setSelectedImage(urlInput.trim())
    }
  }

  const handleSelect = () => {
    if (selectedImage) {
      onChange(selectedImage)
      
      // Set alt text from metadata if available
      const selectedItem = mediaItems.find(item => item.url === selectedImage)
      if (selectedItem?.metadata?.alt_text && onAltChange) {
        onAltChange(selectedItem.metadata.alt_text)
      }
      
      setIsOpen(false)
    }
  }

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.metadata?.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Current Image Preview */}
      {value && (
        <div className="border rounded-lg p-2 bg-gray-50">
          <img 
            src={value} 
            alt={altValue}
            className="w-full h-32 object-cover rounded"
          />
          <p className="text-xs text-gray-500 mt-1 truncate">{value}</p>
        </div>
      )}

      {/* Alt Text Input */}
      {onAltChange && (
        <div>
          <Label className="text-xs text-gray-600">Alt Text</Label>
          <Input
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image"
            className="text-sm"
          />
        </div>
      )}

      {/* Media Picker Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <ImageIcon className="w-4 h-4 mr-2" />
            {value ? 'Change Image' : 'Select Image'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select or Upload Image</DialogTitle>
            <DialogDescription>
              Choose from your media library or upload a new image
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="library">Media Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>

            {/* Media Library Tab */}
            <TabsContent value="library" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={loadMediaItems} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading media...</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-red-600 mb-2">⚠️ {error}</p>
                    <Button onClick={loadMediaItems} variant="outline" size="sm">
                      Try Again
                    </Button>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-gray-500 mb-2">No images found</p>
                    <p className="text-sm text-gray-400">Upload some images to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {filteredItems.map((item, index) => (
                      <Card 
                        key={index}
                        className={cn(
                          "cursor-pointer transition-all",
                          selectedImage === item.url ? "ring-2 ring-blue-500" : "hover:shadow-md"
                        )}
                        onClick={() => setSelectedImage(item.url)}
                      >
                        <CardContent className="p-2">
                          <div className="relative">
                            <img 
                              src={item.url} 
                              alt={item.metadata?.alt_text || item.name}
                              className="w-full h-24 object-cover rounded"
                            />
                            {selectedImage === item.url && (
                              <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {item.name}
                          </p>
                          {item.metadata?.alt_text && (
                            <p className="text-xs text-gray-400 truncate">
                              {item.metadata.alt_text}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">⚠️ {error}</p>
                </div>
              )}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="upload-input"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="upload-input" 
                  className={cn(
                    "cursor-pointer block",
                    isUploading && "pointer-events-none opacity-50"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  )}
                  <p className="mt-2 text-sm text-gray-600">
                    {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 20MB
                  </p>
                </label>
              </div>
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button onClick={handleUrlSubmit} variant="outline">
                    Use URL
                  </Button>
                </div>
                {urlInput && (
                  <img 
                    src={urlInput} 
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onLoad={() => setSelectedImage(urlInput)}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSelect}
              disabled={!selectedImage}
            >
              Select Image
            </Button>
          </div>
        </DialogContent>
             </Dialog>
     </div>
   )
 } 