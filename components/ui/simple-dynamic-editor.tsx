'use client'

import dynamic from 'next/dynamic'

const SimpleBlockEditor = dynamic(() => import('./simple-block-editor'), { 
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
})

interface SimpleDynamicEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleDynamicEditor(props: SimpleDynamicEditorProps) {
  return <SimpleBlockEditor {...props} />
} 