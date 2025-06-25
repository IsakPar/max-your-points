/**
 * Semantic HTML Engine
 * Analyzes HTML content and fixes semantic hierarchy, heading structure, and accessibility
 */

interface SemanticAnalysis {
  issues: SemanticIssue[]
  suggestions: SemanticSuggestion[]
  score: number
  fixedHtml?: string
  headingStructure: HeadingNode[]
}

interface AnalysisOptions {
  isArticleContent?: boolean // When true, assumes title will be H1, so content should start with H2
  hasExternalH1?: boolean // When true, doesn't require H1 in content
}

interface SemanticIssue {
  type: 'heading_skip' | 'missing_h1' | 'multiple_h1' | 'empty_heading' | 'improper_nesting' | 'missing_alt' | 'poor_structure'
  severity: 'error' | 'warning' | 'info'
  message: string
  element?: string
  line?: number
}

interface SemanticSuggestion {
  type: 'fix_heading' | 'add_semantic_tag' | 'improve_structure' | 'add_accessibility'
  description: string
  before: string
  after: string
}

interface HeadingNode {
  level: number
  text: string
  id?: string
  children: HeadingNode[]
}

export class SemanticHTMLEngine {
  private parseHTML: (html: string) => Document
  
  constructor() {
    // For Node.js environment, we'll need jsdom
    if (typeof window === 'undefined') {
      const { JSDOM } = require('jsdom')
      this.parseHTML = (html: string) => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`)
        return dom.window.document
      }
    } else {
      this.parseHTML = (html: string) => {
        const parser = new DOMParser()
        return parser.parseFromString(`<!DOCTYPE html><html><body>${html}</body></html>`, 'text/html')
      }
    }
  }

  /**
   * Analyze HTML content for semantic issues
   */
  analyzeHTML(html: string, options: AnalysisOptions = {}): SemanticAnalysis {
    const doc = this.parseHTML(html)
    const issues: SemanticIssue[] = []
    const suggestions: SemanticSuggestion[] = []
    
    // Analyze heading structure
    const headingStructure = this.analyzeHeadingStructure(doc, issues, options)
    
    // Check for other semantic issues
    this.checkGeneralStructure(doc, issues, suggestions)
    this.checkAccessibility(doc, issues, suggestions)
    
    // Calculate semantic score
    const score = this.calculateSemanticScore(issues)
    
    // Generate fixed HTML
    const fixedHtml = this.fixSemanticIssues(doc, issues, options)
    
    return {
      issues,
      suggestions,
      score,
      fixedHtml,
      headingStructure
    }
  }

  /**
   * Analyze heading structure and hierarchy
   */
  private analyzeHeadingStructure(doc: Document, issues: SemanticIssue[], options: AnalysisOptions = {}): HeadingNode[] {
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const structure: HeadingNode[] = []
    let currentLevel = 0
    
    // Check for H1 (skip if this is article content where title will be H1)
    const h1Elements = doc.querySelectorAll('h1')
    if (!options.isArticleContent && !options.hasExternalH1) {
      if (h1Elements.length === 0) {
        issues.push({
          type: 'missing_h1',
          severity: 'error',
          message: 'Missing H1 heading. Every page should have exactly one H1.',
          element: 'h1'
        })
      } else if (h1Elements.length > 1) {
        issues.push({
          type: 'multiple_h1',
          severity: 'error',
          message: `Found ${h1Elements.length} H1 headings. There should be exactly one H1 per page.`,
          element: 'h1'
        })
      }
    } else if (options.isArticleContent && h1Elements.length > 0) {
      // For article content, warn if H1 is present since title will be H1
      issues.push({
        type: 'multiple_h1',
        severity: 'warning',
        message: 'H1 found in article content. The article title will be the page H1, so content should start with H2.',
        element: 'h1'
      })
    }

    // Check heading hierarchy
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent?.trim() || ''
      
      // Check for empty headings
      if (!text) {
        issues.push({
          type: 'empty_heading',
          severity: 'warning',
          message: `Empty ${heading.tagName} heading found`,
          element: heading.tagName.toLowerCase()
        })
      }

      // Check for heading level skips
      if (currentLevel > 0 && level > currentLevel + 1) {
        issues.push({
          type: 'heading_skip',
          severity: 'warning',
          message: `Heading level skip from H${currentLevel} to H${level}. Consider using H${currentLevel + 1} instead.`,
          element: heading.tagName.toLowerCase()
        })
      }

      currentLevel = level
      
      // Build heading structure
      const node: HeadingNode = {
        level,
        text,
        id: heading.id || undefined,
        children: []
      }
      
      structure.push(node)
    })

    return structure
  }

  /**
   * Check general HTML structure and semantics
   */
  private checkGeneralStructure(doc: Document, issues: SemanticIssue[], suggestions: SemanticSuggestion[]): void {
    // Check for proper semantic elements
    const body = doc.body
    if (!body) return

    // Look for content that should use semantic elements
    const paragraphs = body.querySelectorAll('p')
    const divs = body.querySelectorAll('div')
    
    // Check for lists that should be semantic
    paragraphs.forEach(p => {
      const text = p.textContent?.trim() || ''
      
      // Detect potential lists
      if (text.match(/^(\d+\.|\-|\*|\•)/)) {
        suggestions.push({
          type: 'add_semantic_tag',
          description: 'Convert bullet points to proper list structure',
          before: p.outerHTML,
          after: this.convertToList(text)
        })
      }
      
      // Detect potential quotes
      if (text.startsWith('"') && text.endsWith('"')) {
        suggestions.push({
          type: 'add_semantic_tag',
          description: 'Use blockquote for quoted content',
          before: p.outerHTML,
          after: `<blockquote>${text.slice(1, -1)}</blockquote>`
        })
      }
    })

    // Check for divs that should be semantic elements
    divs.forEach(div => {
      const classList = Array.from(div.classList)
      
      if (classList.some(cls => cls.includes('header') || cls.includes('top'))) {
        suggestions.push({
          type: 'improve_structure',
          description: 'Use <header> instead of div for header content',
          before: div.outerHTML.substring(0, 100) + '...',
          after: '<header>...</header>'
        })
      }
      
      if (classList.some(cls => cls.includes('footer') || cls.includes('bottom'))) {
        suggestions.push({
          type: 'improve_structure',
          description: 'Use <footer> instead of div for footer content',
          before: div.outerHTML.substring(0, 100) + '...',
          after: '<footer>...</footer>'
        })
      }
      
      if (classList.some(cls => cls.includes('nav') || cls.includes('menu'))) {
        suggestions.push({
          type: 'improve_structure',
          description: 'Use <nav> instead of div for navigation',
          before: div.outerHTML.substring(0, 100) + '...',
          after: '<nav>...</nav>'
        })
      }
    })
  }

  /**
   * Check accessibility issues
   */
  private checkAccessibility(doc: Document, issues: SemanticIssue[], suggestions: SemanticSuggestion[]): void {
    // Check images for alt text
    const images = doc.querySelectorAll('img')
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        issues.push({
          type: 'missing_alt',
          severity: 'error',
          message: 'Image missing alt attribute for accessibility',
          element: 'img'
        })
        
        suggestions.push({
          type: 'add_accessibility',
          description: 'Add descriptive alt text to image',
          before: img.outerHTML,
          after: img.outerHTML.replace('<img', '<img alt="[Add descriptive text here]"')
        })
      }
    })

    // Check for proper form labels
    const inputs = doc.querySelectorAll('input[type="text"], input[type="email"], textarea')
    inputs.forEach(input => {
      const id = input.getAttribute('id')
      if (!id || !doc.querySelector(`label[for="${id}"]`)) {
        issues.push({
          type: 'poor_structure',
          severity: 'warning',
          message: 'Form input missing associated label',
          element: input.tagName.toLowerCase()
        })
      }
    })
  }

  /**
   * Calculate semantic quality score (0-100)
   */
  private calculateSemanticScore(issues: SemanticIssue[]): number {
    let score = 100
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'error':
          score -= 15
          break
        case 'warning':
          score -= 5
          break
        case 'info':
          score -= 2
          break
      }
    })

    return Math.max(0, score)
  }

  /**
   * Automatically fix semantic issues where possible
   */
  private fixSemanticIssues(doc: Document, issues: SemanticIssue[], options: AnalysisOptions = {}): string {
    const clonedDoc = doc.cloneNode(true) as Document
    
    // Fix heading hierarchy
    this.fixHeadingHierarchy(clonedDoc, options)
    
    // Add missing alt attributes with placeholders
    const images = clonedDoc.querySelectorAll('img:not([alt])')
    images.forEach(img => {
      img.setAttribute('alt', '[Image: Please add descriptive text]')
    })
    
    // Fix empty headings
    const emptyHeadings = clonedDoc.querySelectorAll('h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty')
    emptyHeadings.forEach(heading => {
      heading.textContent = '[Please add heading text]'
    })

    return clonedDoc.body?.innerHTML || ''
  }

  /**
   * Fix heading hierarchy to ensure proper semantic structure
   */
  private fixHeadingHierarchy(doc: Document, options: AnalysisOptions = {}): void {
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    let expectedLevel = options.isArticleContent ? 2 : 1 // Start with H2 for article content
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1))
      
      // For article content, convert H1 to H2
      if (options.isArticleContent && currentLevel === 1) {
        const newHeading = doc.createElement('h2')
        newHeading.innerHTML = heading.innerHTML
        newHeading.className = heading.className
        newHeading.id = heading.id
        heading.parentNode?.replaceChild(newHeading, heading)
        expectedLevel = 3
      } else if (currentLevel > expectedLevel + 1) {
        // Fix level skip by adjusting to proper level
        const newTag = `h${expectedLevel}`
        const newHeading = doc.createElement(newTag)
        newHeading.innerHTML = heading.innerHTML
        newHeading.className = heading.className
        newHeading.id = heading.id
        heading.parentNode?.replaceChild(newHeading, heading)
        expectedLevel++
      } else {
        expectedLevel = currentLevel + 1
      }
    })
  }

  /**
   * Convert text to proper list structure
   */
  private convertToList(text: string): string {
    const lines = text.split('\n').filter(line => line.trim())
    const isOrdered = lines[0]?.match(/^\d+\./)
    
    const tag = isOrdered ? 'ol' : 'ul'
    const items = lines
      .map(line => line.replace(/^(\d+\.|\-|\*|\•)\s*/, ''))
      .map(item => `  <li>${item}</li>`)
      .join('\n')
    
    return `<${tag}>\n${items}\n</${tag}>`
  }

  /**
   * Generate detailed accessibility report
   */
  generateAccessibilityReport(html: string): string {
    const analysis = this.analyzeHTML(html)
    
    let report = '# Semantic HTML Analysis Report\n\n'
    report += `**Semantic Score: ${analysis.score}/100**\n\n`
    
    if (analysis.issues.length > 0) {
      report += '## Issues Found\n\n'
      analysis.issues.forEach((issue, index) => {
        report += `${index + 1}. **${issue.severity.toUpperCase()}**: ${issue.message}\n`
        if (issue.element) {
          report += `   - Element: \`<${issue.element}>\`\n`
        }
        report += '\n'
      })
    }
    
    if (analysis.suggestions.length > 0) {
      report += '## Improvement Suggestions\n\n'
      analysis.suggestions.forEach((suggestion, index) => {
        report += `${index + 1}. **${suggestion.type.replace('_', ' ').toUpperCase()}**: ${suggestion.description}\n\n`
      })
    }
    
    if (analysis.headingStructure.length > 0) {
      report += '## Heading Structure\n\n'
      analysis.headingStructure.forEach(heading => {
        const indent = '  '.repeat(heading.level - 1)
        report += `${indent}- H${heading.level}: ${heading.text}\n`
      })
    }
    
    return report
  }
}

// Export singleton instance
export const semanticEngine = new SemanticHTMLEngine()

// Helper function for easy analysis
export function analyzeSemanticHTML(html: string, options?: AnalysisOptions): SemanticAnalysis {
  return semanticEngine.analyzeHTML(html, options)
}

// Helper function to get just the score
export function getSemanticScore(html: string, options?: AnalysisOptions): number {
  return semanticEngine.analyzeHTML(html, options).score
} 