// Utility functions to migrate content between different editor formats

export function htmlToBlockNote(html: string): any[] {
  // This is a basic conversion - you might want to use a proper HTML parser
  // For now, we'll create a simple paragraph block with the HTML content
  if (!html || html.trim() === '' || html.trim() === '<p></p>') {
    return []
  }

  // Remove HTML tags for basic text extraction
  const textContent = html.replace(/<[^>]*>/g, '').trim()
  
  if (!textContent) {
    return []
  }

  return [
    {
      id: `block-${Date.now()}`,
      type: 'paragraph',
      props: {},
      content: [
        {
          type: 'text',
          text: textContent,
          styles: {}
        }
      ],
      children: []
    }
  ]
}

export function blockNoteToHtml(blocks: any[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  try {
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          const text = block.content?.map((item: any) => item.text || '').join('') || ''
          return text ? `<p>${text}</p>` : ''
        case 'heading':
          const level = block.props?.level || 1
          const headingText = block.content?.map((item: any) => item.text || '').join('') || ''
          return headingText ? `<h${level}>${headingText}</h${level}>` : ''
        case 'bulletListItem':
          const listText = block.content?.map((item: any) => item.text || '').join('') || ''
          return listText ? `<li>${listText}</li>` : ''
        default:
          const defaultText = block.content?.map((item: any) => item.text || '').join('') || ''
          return defaultText ? `<p>${defaultText}</p>` : ''
      }
    }).filter(Boolean).join('')
  } catch (error) {
    console.error('Error converting BlockNote to HTML:', error)
    return ''
  }
}

export function isBlockNoteFormat(content: string): boolean {
  if (!content || typeof content !== 'string') return false
  
  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) && parsed.length > 0 && parsed[0].type !== undefined
  } catch {
    return false
  }
}

export function convertContentForEditor(content: string, targetEditor: 'tiptap' | 'blocknote' | 'wordpress' | 'notion'): string {
  if (!content || content.trim() === '') return ''

  if (targetEditor === 'blocknote') {
    if (isBlockNoteFormat(content)) {
      return content // Already in BlockNote format
    } else {
      // Convert HTML to BlockNote
      const blocks = htmlToBlockNote(content)
      return JSON.stringify(blocks)
    }
  } else if (targetEditor === 'notion') {
    // Notion editor uses HTML format like TipTap
    if (isBlockNoteFormat(content)) {
      // Convert BlockNote to HTML
      const blocks = JSON.parse(content)
      return blockNoteToHtml(blocks)
    } else {
      return content // Already in HTML format
    }
  } else if (targetEditor === 'wordpress') {
    // WordPress editor uses HTML format like TipTap
    if (isBlockNoteFormat(content)) {
      // Convert BlockNote to HTML
      const blocks = JSON.parse(content)
      return blockNoteToHtml(blocks)
    } else {
      return content // Already in HTML format
    }
  } else {
    // targetEditor === 'tiptap'
    if (isBlockNoteFormat(content)) {
      // Convert BlockNote to HTML
      const blocks = JSON.parse(content)
      return blockNoteToHtml(blocks)
    } else {
      return content // Already in HTML format
    }
  }
} 