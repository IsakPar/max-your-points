'use client'

import dynamic from 'next/dynamic'

// Dynamically import BlockNote to avoid SSR issues
const BlockEditor = dynamic(() => import('./block-editor'), { 
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
})

interface DynamicBlockEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function DynamicBlockEditor(props: DynamicBlockEditorProps) {
  return <BlockEditor {...props} />
} 