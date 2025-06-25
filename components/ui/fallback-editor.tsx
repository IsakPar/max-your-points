'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'

// Dynamic imports with fallbacks
const SimpleDynamicEditor = dynamic(() => import('./simple-dynamic-editor'), { 
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading BlockNote editor...</div>
    </div>
  )
})

const RichTextEditorV2 = dynamic(() => import('./rich-text-editor-v2'), { 
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading TipTap editor...</div>
    </div>
  )
})

interface FallbackEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function FallbackEditor(props: FallbackEditorProps) {
  const [editorType, setEditorType] = useState<'blocknote' | 'tiptap'>('blocknote')
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    setEditorType('tiptap')
  }

  const retryBlockNote = () => {
    setHasError(false)
    setEditorType('blocknote')
  }

  return (
    <div className="space-y-4">
      {hasError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>BlockNote editor failed to load. Using TipTap editor instead.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={retryBlockNote}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry BlockNote
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 mb-2">
        <Button
          variant={editorType === 'blocknote' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEditorType('blocknote')}
        >
          BlockNote (Modern)
        </Button>
        <Button
          variant={editorType === 'tiptap' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setEditorType('tiptap')}
        >
          TipTap (Classic)
        </Button>
      </div>

      {editorType === 'blocknote' ? (
        <div onError={handleError}>
          <SimpleDynamicEditor {...props} />
        </div>
      ) : (
        <RichTextEditorV2 {...props} />
      )}
    </div>
  )
} 