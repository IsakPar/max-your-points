'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'  
import { Separator } from '@/components/ui/separator'
import MediaPicker from '@/components/ui/media-picker'
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
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
  Code,
  Palette,
  Highlighter,
  X,
  Type
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import DOMPurify from 'dompurify'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export default function RichTextEditorV2({
  content,
  onChange,
  placeholder = 'Start writing your content...',
  className = '',
  minHeight = '400px'
}: RichTextEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Prevent infinite update loops
  const contentRef = useRef(content)
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'editor-heading',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'editor-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'editor-ordered-list',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'editor-blockquote',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'editor-inline-code',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'editor-code-block',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      Typography,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'editor-highlight',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none p-6 editor-content`,
        style: `min-height: ${minHeight}`,
      },
    },
    onCreate: ({ editor }) => {
      // Set initial content when editor is created
      if (content && content.trim() !== '') {
        isExternalUpdate.current = true
        editor.commands.setContent(content, false)
        contentRef.current = content
      }
      setIsLoading(false)
    },
    onUpdate: ({ editor }) => {
      if (!isExternalUpdate.current) {
        const html = editor.getHTML()
        const sanitizedHtml = DOMPurify.sanitize(html)
        contentRef.current = sanitizedHtml
        onChange(sanitizedHtml)
      }
      isExternalUpdate.current = false
    },
  })

  // Handle external content changes
  useEffect(() => {
    if (editor && content !== contentRef.current && content !== undefined) {
      isExternalUpdate.current = true
      editor.commands.setContent(content || '', false)
      contentRef.current = content
    }
  }, [editor, content])

  const handleImageSelect = useCallback((imageUrl: string, altText: string, caption?: string) => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run()
      setShowMediaPicker(false)
    }
  }, [editor])

  const handleLinkInsert = useCallback(() => {
    if (editor && linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setLinkUrl('')
      setLinkText('')
      setShowLinkDialog(false)
    }
  }, [editor, linkUrl, linkText])

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
    disabled?: boolean
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      type="button"
      disabled={disabled || !editor}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'
  ]

  if (isLoading) {
    return (
      <div className={`border rounded-lg p-4 flex items-center justify-center ${className}`} style={{ minHeight }}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={`border rounded-lg p-4 flex items-center justify-center ${className}`} style={{ minHeight }}>
        <div className="text-red-500">Editor failed to load</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      {/* Enhanced CSS for better WYSIWYG experience */}
      <style jsx global>{`
        .editor-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
        }
        
        .editor-content .editor-heading h1 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 2rem 0 1rem 0;
          color: #111827;
        }
        
        .editor-content .editor-heading h2 {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.25;
          margin: 1.75rem 0 0.75rem 0;
          color: #1f2937;
        }
        
        .editor-content .editor-heading h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1.5rem 0 0.5rem 0;
          color: #374151;
        }
        
        .editor-content .editor-paragraph {
          font-size: 1.125rem;
          line-height: 1.75;
          margin: 1rem 0;
          color: #374151;
        }
        
        .editor-content .editor-bullet-list,
        .editor-content .editor-ordered-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .editor-content .editor-bullet-list li,
        .editor-content .editor-ordered-list li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .editor-content .editor-blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background: #f8fafc;
          border-radius: 0.5rem;
          font-style: italic;
          color: #4b5563;
        }
        
        .editor-content .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .editor-content .editor-link {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .editor-content .editor-link:hover {
          color: #1d4ed8;
        }
        
        .editor-content .editor-inline-code {
          background: #f1f5f9;
          color: #1e293b;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          font-size: 0.9em;
        }
        
        .editor-content .editor-code-block {
          background: #1e293b;
          color: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          overflow-x: auto;
        }
        
        .editor-content .editor-highlight {
          background: #fef3c7;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        
        .editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .editor-content:focus {
          outline: none;
        }
      `}</style>

      {/* Modern Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b bg-gray-50/50">
        {/* History */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <div className="flex items-center">
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
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists and Quote */}
        <div className="flex items-center">
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
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center">
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
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Color and Highlight */}
        <div className="flex items-center relative">
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </ToolbarButton>

          {/* Color Picker */}
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Highlight Picker */}
          {showHighlightPicker && (
            <div className="absolute top-full left-8 mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="grid grid-cols-5 gap-1">
                {['#fef3c7', '#fecaca', '#fed7aa', '#d1fae5', '#dbeafe', '#e0e7ff', '#f3e8ff', '#fce7f3'].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color }).run()
                      setShowHighlightPicker(false)
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Media and Links */}
        <div className="flex items-center">
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
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={handleImageSelect}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkUrl">URL *</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  autoFocus
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
                  onClick={() => {
                    setShowLinkDialog(false)
                    setLinkUrl('')
                    setLinkText('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleLinkInsert}
                  disabled={!linkUrl.trim()}
                >
                  Insert Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(showColorPicker || showHighlightPicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowColorPicker(false)
            setShowHighlightPicker(false)
          }}
        />
      )}
    </div>
  )
}