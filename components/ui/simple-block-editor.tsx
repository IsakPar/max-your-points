'use client'

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'

interface SimpleBlockEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleBlockEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = ''
}: SimpleBlockEditorProps) {
  const [isLoading, setIsLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [existingMedia, setExistingMedia] = useState<any[]>([])

  // Create simple editor with upload function
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      console.log('🖼️ Upload function called with:', file.name, file.type, file.size)
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', 'article')
        formData.append('altText', file.name || 'Uploaded image')

        console.log('📤 Uploading via API client...')
        
        // Use API client which includes authentication
        const result = await api.uploadFile(formData)
        console.log('📥 Upload response:', result)

        console.log('✅ Image uploaded successfully:', result.url)
        return result.url
      } catch (error) {
        console.error('❌ Image upload error:', error)
        const tempUrl = URL.createObjectURL(file)
        console.log('🔄 Using temporary URL as fallback:', tempUrl)
        return tempUrl
      }
    },
    // Don't set initial content if we have existing content
    // This prevents cursor jumping when content loads
    initialContent: content && content.trim() ? undefined : [
      {
        type: "paragraph",
        content: "Start writing your article...",
      },
    ],
  })

  // Fetch existing media from your library
  const fetchExistingMedia = async () => {
    try {
      console.log('🖼️ Fetching media library...')
      const response = await fetch('/api/admin/media?limit=100')
      const data = await response.json()
      console.log('📸 Media API response:', data)
      
      if (response.ok) {
        const images = data.images || []
        console.log(`✅ Found ${images.length} images in media library`)
        setExistingMedia(images)
        setShowMediaPicker(true)
      } else {
        console.error('❌ Media API error:', data.error)
      }
    } catch (error) {
      console.error('❌ Failed to fetch media:', error)
    }
  }

  // Function to manually trigger image upload
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Insert existing image from media library
  const insertExistingImage = (imageUrl: string, altText: string = '') => {
    if (editor) {
      try {
        // Get current cursor position to maintain it
        const currentPosition = editor.getTextCursorPosition()
        
        editor.insertBlocks([{
          type: "image",
          props: {
            url: imageUrl,
            caption: altText,
          },
        }] as any, currentPosition.block, "after")
        
        setShowMediaPicker(false)
      } catch (error) {
        console.error('Failed to insert existing image:', error)
      }
    }
  }

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editor) {
      console.log('📁 File selected manually:', file.name)
      try {
        const url = await editor.uploadFile(file)
        console.log('🔗 Got URL, inserting image block:', url)
        
        // Insert image block at current position
        editor.insertBlocks([{
          type: "image",
          props: {
            url: url,
            caption: "",
          },
        }] as any, editor.getTextCursorPosition().block, "after")
        
      } catch (error) {
        console.error('❌ Manual upload failed:', error)
      }
    }
    // Reset file input
    if (event.target) {
      event.target.value = ''
    }
  }

  // Initialize content only once to prevent cursor jumping
  useEffect(() => {
    const initializeContent = async () => {
      if (content && content.trim() !== '' && editor && isLoading) {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(content)
          editor.replaceBlocks(editor.document, blocks)
          console.log('✅ Content initialized successfully')
        } catch (error) {
          console.log('Content parsing error (non-critical):', error)
          // If HTML parsing fails, just set as plain text
          try {
            editor.replaceBlocks(editor.document, [
              {
                type: "paragraph",
                content: content,
              },
            ])
          } catch (fallbackError) {
            console.log('Fallback content setting failed:', fallbackError)
          }
        }
      }
      setIsLoading(false)
    }

    if (editor) {
      initializeContent()
    }
  }, [editor]) // Only depend on editor, not content, to prevent re-initialization

  // Handle content changes with debouncing to prevent excessive updates
  const handleChange = async () => {
    if (editor && !isLoading) {
      try {
        const html = await editor.blocksToHTMLLossy(editor.document)
        onChange(html)
      } catch (error) {
        console.log('Content conversion error (non-critical):', error)
      }
    }
  }



  if (isLoading) {
    return (
      <div className={`border rounded-lg p-4 min-h-[600px] flex items-center justify-center bg-white ${className}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={`border rounded-lg p-4 min-h-[600px] flex items-center justify-center bg-white ${className}`}>
        <div className="text-red-500">Editor failed to load</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg bg-white overflow-hidden min-h-[600px] ${className}`}>
      {/* Hidden file input for manual image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Image controls */}
      <div className="p-3 border-b bg-gray-50 flex gap-2">
        <button
          onClick={fetchExistingMedia}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
        >
          🖼️ Media Library
        </button>
        <button
          onClick={handleImageUpload}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          📸 Upload New
        </button>
        <span className="text-sm text-gray-500 py-1">Choose from existing images or upload new ones</span>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Choose from Media Library</h3>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {existingMedia.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingMedia.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => insertExistingImage(image.url, image.alt_text || image.filename)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || image.filename}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          console.warn('Failed to load image:', image.url)
                          e.currentTarget.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Select Image
                        </span>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate font-medium">
                          {image.filename || 'Untitled'}
                        </p>
                        {image.alt_text && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {image.alt_text}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">
                            {image.category || 'uncategorized'}
                          </span>
                          {image.file_size && (
                            <span className="text-xs text-gray-400">
                              {(image.file_size / 1024).toFixed(0)}KB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No images found in media library.</p>
                  <button
                    onClick={() => {
                      setShowMediaPicker(false)
                      handleImageUpload()
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload Your First Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        /* Ensure image blocks work properly */
        .bn-block-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Image upload interface styling */
        .bn-file-upload-input,
        .bn-image-upload,
        [data-node-type="image"] .bn-file-upload-input {
          border: 2px dashed #d1d5db !important;
          border-radius: 8px !important;
          padding: 2rem !important;
          text-align: center !important;
          background: #f9fafb !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          min-height: 100px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
        }
        
        .bn-file-upload-input:hover,
        .bn-image-upload:hover,
        [data-node-type="image"] .bn-file-upload-input:hover {
          border-color: #3b82f6 !important;
          background: #eff6ff !important;
        }
        
        /* Image block when empty - ensure it shows upload interface */
        .bn-block-content[data-content-type="image"],
        [data-node-type="image"] {
          min-height: 120px !important;
        }
        
        /* Fix for image block text that shows "Add image" */
        [data-node-type="image"] .bn-block-content {
          cursor: pointer !important;
          border: 2px dashed #d1d5db !important;
          border-radius: 8px !important;
          padding: 2rem !important;
          text-align: center !important;
          background: #f9fafb !important;
          transition: all 0.2s ease !important;
        }
        
        [data-node-type="image"] .bn-block-content:hover {
          border-color: #3b82f6 !important;
          background: #eff6ff !important;
        }
        
        /* Make image blocks more obvious when empty */
        [data-node-type="image"]:not([data-url]) .bn-block-content {
          position: relative !important;
        }
        
        [data-node-type="image"]:not([data-url]) .bn-block-content::after {
          content: "📸 Click here to upload an image" !important;
          color: #6b7280 !important;
          font-size: 0.875rem !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          pointer-events: none !important;
        }
      `}</style>
      <BlockNoteView 
        editor={editor} 
        onChange={handleChange}
        theme="light"
        filePanel={true}
        sideMenu={true}
        slashMenu={true}
      />
    </div>
  )
} 