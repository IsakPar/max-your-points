'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Node, mergeAttributes } from '@tiptap/core'

// Custom Figure extension for TipTap
const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'inline*',
  isolating: true,
  
  addAttributes() {
    return {
      class: {
        default: 'image-with-caption'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes), 0]
  },
})
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import MediaPicker from '@/components/ui/media-picker'
import { 
  Bold, 
  Italic, 
  Underline,
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Image as ImageIcon, 
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Quote,
  Settings,
  X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing your content...',
  className = ''
}: RichTextEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageControls, setShowImageControls] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const [imageControlsPosition, setImageControlsPosition] = useState({ top: 0, left: 0 })
  const [editingCaption, setEditingCaption] = useState('')
  const [showCaptionInput, setShowCaptionInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const isUpdatingContent = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        hardBreak: {
          HTMLAttributes: {
            class: 'line-break',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph',
          },
        }
      }),
      Figure,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4 cursor-pointer image-element',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'figure'],
      }),
    ],
    content: content || '', // Initialize with content immediately
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!isUpdatingContent.current) {
        const html = editor.getHTML()
        const sanitizedHtml = DOMPurify.sanitize(html)
        onChange(sanitizedHtml)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 border rounded-lg editor-content',
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement
        if (target.tagName === 'IMG') {
          const img = target as HTMLImageElement
          setSelectedImage(img)
          const rect = img.getBoundingClientRect()
          const editorRect = view.dom.getBoundingClientRect()
          setImageControlsPosition({
            top: rect.top - editorRect.top + rect.height + 10,
            left: rect.left - editorRect.left + rect.width / 2 - 100
          })
          setShowImageControls(true)
          return true
        } else if (target.closest('figure')) {
          // Handle clicks on figure elements
          const figure = target.closest('figure') as HTMLElement
          const img = figure.querySelector('img') as HTMLImageElement
          if (img) {
            setSelectedImage(img)
            const rect = img.getBoundingClientRect()
            const editorRect = view.dom.getBoundingClientRect()
            setImageControlsPosition({
              top: rect.top - editorRect.top + rect.height + 10,
              left: rect.left - editorRect.left + rect.width / 2 - 100
            })
            setShowImageControls(true)
            return true
          }
        } else {
          setShowImageControls(false)
          setSelectedImage(null)
        }
        return false
      },
    },
  })

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getHTML()
      
      // Only update if content is actually different
      if (content !== currentContent) {
        isUpdatingContent.current = true
        editor.commands.setContent(content, false)
        setTimeout(() => {
          isUpdatingContent.current = false
        }, 100)
      }
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  const handleImageSelect = (imageUrl: string, altText: string, caption?: string) => {
    if (imageUrl) {
      if (caption) {
        // Insert image with caption as a figure element
        const figureHtml = `<figure class="image-with-caption"><img src="${imageUrl}" alt="${altText}" /><figcaption>${caption}</figcaption></figure>`
        editor.chain().focus().insertContent(figureHtml).run()
      } else {
        // Insert image without caption
        editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run()
      }
      setShowMediaPicker(false)
    }
  }

  const insertLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setLinkUrl('')
      setLinkText('')
      setShowLinkDialog(false)
    }
  }

  const alignImage = (alignment: 'left' | 'center' | 'right') => {
    if (selectedImage && editor) {
      const { from, to } = editor.state.selection
      const parent = selectedImage.parentElement
      
      // Remove existing alignment classes
      selectedImage.classList.remove('mx-auto', 'ml-0', 'mr-0', 'float-left', 'float-right')
      if (parent) {
        parent.classList.remove('text-left', 'text-center', 'text-right')
      }
      
      // Apply new alignment
      switch (alignment) {
        case 'left':
          selectedImage.classList.add('ml-0', 'float-left')
          if (parent) parent.classList.add('text-left')
          break
        case 'center':
          selectedImage.classList.add('mx-auto')
          if (parent) parent.classList.add('text-center')
          break
        case 'right':
          selectedImage.classList.add('mr-0', 'float-right')
          if (parent) parent.classList.add('text-right')
          break
      }
      
      // Trigger content update
      const html = editor.getHTML()
      onChange(html)
    }
  }

  const removeImage = () => {
    if (selectedImage && editor) {
      // Find the image node and delete it
      const { state } = editor
      const { doc } = state
      let imagePos = null
      
      doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === selectedImage.src) {
          imagePos = pos
          return false
        }
      })
      
      if (imagePos !== null) {
        editor.chain().focus().deleteRange({ from: imagePos, to: imagePos + 1 }).run()
      }
      
      setShowImageControls(false)
      setSelectedImage(null)
    }
  }

  const handleCaptionEdit = () => {
    if (selectedImage) {
      // Check if image is already in a figure with caption
      const figure = selectedImage.closest('figure')
      if (figure) {
        const existingCaption = figure.querySelector('figcaption')
        setEditingCaption(existingCaption?.textContent || '')
      } else {
        setEditingCaption('')
      }
      setShowCaptionInput(true)
    }
  }

  const saveCaptionEdit = () => {
    if (selectedImage && editor) {
      const figure = selectedImage.closest('figure')
      
      if (editingCaption.trim()) {
        if (figure) {
          // Update existing figure caption
          const existingCaption = figure.querySelector('figcaption')
          if (existingCaption) {
            existingCaption.textContent = editingCaption
          } else {
            // Add caption to existing figure
            const captionElement = document.createElement('figcaption')
            captionElement.textContent = editingCaption
            figure.appendChild(captionElement)
          }
        } else {
          // Convert standalone image to figure with caption
          const imgSrc = selectedImage.src
          const imgAlt = selectedImage.alt
          const figureHtml = `<figure class="image-with-caption"><img src="${imgSrc}" alt="${imgAlt}" /><figcaption>${editingCaption}</figcaption></figure>`
          
          // Replace the image with the figure
          selectedImage.outerHTML = figureHtml
        }
      } else {
        if (figure) {
          // Remove caption if empty, convert back to standalone image
          const img = figure.querySelector('img')
          if (img) {
            figure.outerHTML = img.outerHTML
          }
        }
      }
      
      // Trigger content update
      const html = editor.getHTML()
      onChange(html)
      
      setShowCaptionInput(false)
      setEditingCaption('')
      setShowImageControls(false)
      setSelectedImage(null)
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </Button>
  )

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Custom CSS for professional typography */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
        
        :global(.editor-content) {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        :global(.editor-content h1) {
          font-family: 'Merriweather', Georgia, serif !important;
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          margin: 2rem 0 1.25rem 0 !important;
          color: #111827 !important;
          letter-spacing: -0.025em !important;
        }
        
        :global(.editor-content h2) {
          font-family: 'Merriweather', Georgia, serif !important;
          font-size: 2rem !important;
          font-weight: 700 !important;
          line-height: 1.25 !important;
          margin: 1.75rem 0 1rem 0 !important;
          color: #1f2937 !important;
          letter-spacing: -0.02em !important;
        }
        
        :global(.editor-content h3) {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          line-height: 1.3 !important;
          margin: 1.5rem 0 0.75rem 0 !important;
          color: #374151 !important;
          letter-spacing: -0.015em !important;
        }
        
        :global(.editor-content h4) {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          line-height: 1.35 !important;
          margin: 1.25rem 0 0.5rem 0 !important;
          color: #4b5563 !important;
          letter-spacing: -0.01em !important;
        }
        
        :global(.editor-content p) {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.125rem !important;
          font-weight: 400 !important;
          line-height: 1.75 !important;
          margin: 1rem 0 !important;
          color: #374151 !important;
          min-height: 1.75rem !important;
          letter-spacing: -0.005em !important;
        }
        
        :global(.editor-content p:empty) {
          margin: 1rem 0 !important;
          min-height: 1.75rem !important;
        }
        
        :global(.editor-content br) {
          display: block !important;
          margin: 0.75rem 0 !important;
          content: "" !important;
        }
        
        :global(.editor-content .line-break) {
          display: block !important;
          margin: 0.75rem 0 !important;
        }
        
        :global(.editor-content ul, .editor-content ol) {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          margin: 1.25rem 0 !important;
          padding-left: 1.75rem !important;
          color: #374151 !important;
        }
        
        :global(.editor-content li) {
          margin: 0.5rem 0 !important;
          line-height: 1.7 !important;
        }
        
        :global(.editor-content blockquote) {
          font-family: 'Merriweather', Georgia, serif !important;
          font-size: 1.25rem !important;
          font-style: italic !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
          border-left: 4px solid #6366f1 !important;
          padding: 1.5rem 2rem !important;
          margin: 2rem 0 !important;
          color: #4b5563 !important;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
        }
        
        :global(.editor-content img) {
          margin: 2rem 0 !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          max-width: 100% !important;
          height: auto !important;
        }
        
        :global(.editor-content figure.image-with-caption) {
          margin: 2rem 0 !important;
          text-align: center !important;
        }
        
        :global(.editor-content figure.image-with-caption img) {
          margin: 0 !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          max-width: 100% !important;
          height: auto !important;
        }
        
        :global(.editor-content figcaption) {
          font-family: 'Inter', sans-serif !important;
          font-size: 0.875rem !important;
          font-style: italic !important;
          color: #6b7280 !important;
          margin-top: 0.75rem !important;
          line-height: 1.5 !important;
          text-align: center !important;
        }
        
        :global(.editor-content strong) {
          font-weight: 600 !important;
          color: #1f2937 !important;
        }
        
        :global(.editor-content em) {
          font-style: italic !important;
          color: #4b5563 !important;
        }
        
        :global(.editor-content a) {
          color: #6366f1 !important;
          text-decoration: none !important;
          font-weight: 500 !important;
          border-bottom: 2px solid transparent !important;
          transition: all 0.2s ease !important;
        }
        
        :global(.editor-content a:hover) {
          color: #4f46e5 !important;
          border-bottom-color: #6366f1 !important;
        }
        
        :global(.editor-content code) {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
          font-size: 0.9em !important;
          background-color: #f1f5f9 !important;
          color: #475569 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          border: 1px solid #e2e8f0 !important;
        }
        
        :global(.editor-content pre) {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
          background-color: #1e293b !important;
          color: #f1f5f9 !important;
          padding: 1.5rem !important;
          border-radius: 0.75rem !important;
          margin: 1.5rem 0 !important;
          overflow-x: auto !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* First paragraph after headings */
        :global(.editor-content h1 + p, .editor-content h2 + p, .editor-content h3 + p) {
          margin-top: 0.75rem !important;
        }
        
        /* Lead paragraph styling for first paragraph */
        :global(.editor-content > p:first-of-type) {
          font-size: 1.25rem !important;
          font-weight: 400 !important;
          color: #4b5563 !important;
          line-height: 1.6 !important;
        }

        /* Image alignment and interaction styles */
        :global(.editor-content img.image-element) {
          transition: all 0.2s ease !important;
          border: 2px solid transparent !important;
        }
        
        :global(.editor-content img.image-element:hover) {
          border-color: #3b82f6 !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
        }
        
        /* Image alignment classes */
        :global(.editor-content .text-center) {
          text-align: center !important;
          display: block !important;
        }
        
        :global(.editor-content .text-left) {
          text-align: left !important;
        }
        
        :global(.editor-content .text-right) {
          text-align: right !important;
        }
        
        :global(.editor-content img.mx-auto) {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        :global(.editor-content img.float-left) {
          float: left !important;
          margin-right: 1rem !important;
          margin-bottom: 1rem !important;
        }
        
        :global(.editor-content img.float-right) {
          float: right !important;
          margin-left: 1rem !important;
          margin-bottom: 1rem !important;
        }
      `}</style>
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Quote */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Media */}
        <ToolbarButton
          onClick={() => setShowMediaPicker(true)}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowLinkDialog(true)}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Floating Image Controls */}
        {showImageControls && selectedImage && !showCaptionInput && (
          <div 
            className="absolute z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1"
            style={{
              top: imageControlsPosition.top,
              left: imageControlsPosition.left,
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alignImage('left')}
              title="Align Left"
              className="p-1 h-8 w-8"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alignImage('center')}
              title="Center Image"
              className="p-1 h-8 w-8"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alignImage('right')}
              title="Align Right"
              className="p-1 h-8 w-8"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCaptionEdit}
              title="Add/Edit Caption"
              className="p-1 h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeImage}
              title="Remove Image"
              className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowImageControls(false)
                setSelectedImage(null)
              }}
              title="Close"
              className="p-1 h-8 w-8"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Caption Input Modal */}
        {showCaptionInput && selectedImage && (
          <div 
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-80"
            style={{
              top: imageControlsPosition.top,
              left: imageControlsPosition.left,
            }}
          >
            <div className="space-y-3">
              <Label htmlFor="captionEdit" className="text-sm font-medium">
                Image Caption
              </Label>
              <Input
                id="captionEdit"
                value={editingCaption}
                onChange={(e) => setEditingCaption(e.target.value)}
                placeholder="Enter caption text..."
                className="w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCaptionEdit()
                  } else if (e.key === 'Escape') {
                    setShowCaptionInput(false)
                    setEditingCaption('')
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCaptionInput(false)
                    setEditingCaption('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={saveCaptionEdit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={handleImageSelect}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="linkText">Link Text (optional)</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={insertLink}>
                  Insert
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 