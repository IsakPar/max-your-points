/**
 * Semantic Heading Processor
 * Automatically assigns appropriate heading levels (H2, H3, H4, etc.) 
 * based on document structure and hierarchy
 */

interface Block {
  type: string;
  props?: {
    level?: number;
  };
  content?: any;
  children?: Block[];
}

/**
 * Processes HTML content to assign semantic heading levels
 * H1 is reserved for the article title, so we start from H2
 */
export function processSemanticHeadings(htmlContent: string): string {
  // Parse HTML to find heading structure
  const parser = typeof window !== 'undefined' ? new DOMParser() : null;
  
  if (!parser) {
    // Server-side fallback - simple regex replacement
    return htmlContent.replace(/<h(\d)([^>]*)>/g, (match, level, attrs) => {
      // Convert all headings to H2 for now on server side
      return `<h2${attrs}>`;
    }).replace(/<\/h\d>/g, '</h2>');
  }
  
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  let currentLevel = 2; // Start from H2 since H1 is the title
  const levelStack: number[] = [];
  
  headings.forEach((heading, index) => {
    const isFirstHeading = index === 0;
    const prevLevel = index > 0 ? parseInt(headings[index - 1].tagName.substring(1)) : 2;
    
    if (isFirstHeading) {
      // First heading is always H2
      currentLevel = 2;
    } else {
      // Determine if this should be same level, child level, or parent level
      // This is a simple heuristic - in a full implementation, you'd analyze content structure
      const headingText = heading.textContent?.toLowerCase() || '';
      
      // Simple heuristic: if heading contains certain keywords, it might be a subsection
      const isSubsection = headingText.includes('step') || 
                          headingText.includes('tip') || 
                          headingText.includes('example') ||
                          headingText.match(/^\d+\./) || // numbered list style
                          headingText.match(/^[a-z]\)/); // lettered list style
      
      if (isSubsection && currentLevel < 4) {
        currentLevel = Math.min(currentLevel + 1, 4); // Max H4
      } else {
        // Same level or promote back to H2/H3 for new sections
        currentLevel = 2;
      }
    }
    
    // Update the heading tag
    const newHeading = doc.createElement(`h${currentLevel}`);
    newHeading.innerHTML = heading.innerHTML;
    
    // Copy attributes
    for (const attr of heading.attributes) {
      newHeading.setAttribute(attr.name, attr.value);
    }
    
    heading.parentNode?.replaceChild(newHeading, heading);
  });
  
  return doc.querySelector('div')?.innerHTML || htmlContent;
}

/**
 * Simple content-based heading level detection
 * This analyzes the text content to suggest appropriate heading levels
 */
export function detectHeadingLevel(headingText: string, previousHeadings: string[] = []): number {
  const text = headingText.toLowerCase().trim();
  
  // Keywords that suggest this is a subsection (H3 or H4)
  const subsectionKeywords = [
    'step', 'tip', 'example', 'note', 'warning', 'important',
    'pros', 'cons', 'benefits', 'drawbacks', 'summary',
    'details', 'method', 'approach', 'technique', 'strategy'
  ];
  
  // Keywords that suggest this is a main section (H2)
  const mainSectionKeywords = [
    'introduction', 'overview', 'conclusion', 'getting started',
    'what is', 'how to', 'why', 'when', 'where', 'who',
    'background', 'requirements', 'implementation', 'results'
  ];
  
  // Check for numbered or lettered patterns
  const isNumbered = /^\d+\./.test(text);
  const isLettered = /^[a-z]\)/.test(text);
  const isSubBullet = text.startsWith('•') || text.startsWith('-');
  
  // Check for question patterns (often H3)
  const isQuestion = text.includes('?') || text.startsWith('how ') || text.startsWith('what ') || text.startsWith('why ');
  
  // Determine level based on content and context
  if (mainSectionKeywords.some(keyword => text.includes(keyword))) {
    return 2; // H2 for main sections
  }
  
  if (subsectionKeywords.some(keyword => text.includes(keyword)) || 
      isNumbered || isLettered || isSubBullet || isQuestion) {
    return 3; // H3 for subsections
  }
  
  // Analyze context with previous headings
  if (previousHeadings.length > 0) {
    const lastHeading = previousHeadings[previousHeadings.length - 1];
    const lastHeadingHasSubsectionKeywords = subsectionKeywords.some(keyword => 
      lastHeading.toLowerCase().includes(keyword)
    );
    
    // If the previous heading was a subsection, this might be a sub-subsection
    if (lastHeadingHasSubsectionKeywords) {
      return 4; // H4 for sub-subsections
    }
  }
  
  // Default to H2 for main content
  return 2;
}

/**
 * Process BlockNote blocks to assign semantic heading levels
 */
export function processBlockNoteHeadings(blocks: Block[]): Block[] {
  const headingStack: number[] = [];
  let currentLevel = 2;
  
  return blocks.map((block) => {
    if (block.type === 'heading') {
      const headingText = extractTextFromBlock(block);
      const suggestedLevel = detectHeadingLevel(headingText);
      
      return {
        ...block,
        props: {
          ...block.props,
          level: suggestedLevel
        }
      };
    }
    
    // Process children recursively if they exist
    if (block.children) {
      return {
        ...block,
        children: processBlockNoteHeadings(block.children)
      };
    }
    
    return block;
  });
}

/**
 * Extract plain text from a BlockNote block
 */
function extractTextFromBlock(block: Block): string {
  // This is a simplified version - in practice, you'd need to handle
  // the specific BlockNote content structure
  if (typeof block.content === 'string') {
    return block.content;
  }
  
  if (Array.isArray(block.content)) {
    return block.content.map(item => 
      typeof item === 'string' ? item : item.text || ''
    ).join(' ');
  }
  
  return '';
} 