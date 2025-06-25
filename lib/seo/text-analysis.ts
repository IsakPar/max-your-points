/**
 * Advanced Text Analysis Library
 * Implements mathematical formulas from RankMath, Yoast, SEMrush research
 * Based on industry-standard SEO analysis algorithms
 */

export interface TextMetrics {
  wordCount: number
  sentenceCount: number
  paragraphCount: number
  syllableCount: number
  complexWords: number
  averageSentenceLength: number
  averageSyllablesPerWord: number
  characterCount: number
  polysyllabicWords: number
}

export interface ReadabilityScores {
  fleschReadingEase: number
  fleschKincaidGrade: number
  gunningFogIndex: number
  smogIndex: number
  automatedReadabilityIndex: number
  colemanLiauIndex: number
  readingTimeMinutes: number
  targetAudience: string
  recommendations: string[]
}

export interface KeywordAnalysis {
  keyword: string
  frequency: number
  density: number
  prominence: number
  positions: number[]
  contextRelevance: number
  tfScore: number
  idfScore?: number
  tfIdfScore?: number
}

export interface ContentStructure {
  headings: {
    h1: number
    h2: number
    h3: number
    h4: number
    h5: number
    h6: number
  }
  lists: {
    ordered: number
    unordered: number
  }
  images: number
  links: {
    internal: number
    external: number
  }
  hasSemanticStructure: boolean
}

export class TextAnalyzer {
  /**
   * Extract basic text metrics from content
   */
  static getTextMetrics(text: string): TextMetrics {
    const plainText = this.stripHtml(text).trim()
    
    // Word count
    const words = plainText.split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length
    
    // Sentence count - improved regex for better accuracy
    const sentences = plainText
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0)
    const sentenceCount = Math.max(sentences.length, 1)
    
    // Paragraph count
    const paragraphs = plainText
      .split(/\n\s*\n/)
      .filter(para => para.trim().length > 0)
    const paragraphCount = Math.max(paragraphs.length, 1)
    
    // Character count (excluding spaces)
    const characterCount = plainText.replace(/\s/g, '').length
    
    // Syllable count using improved algorithm
    const syllableCount = this.countSyllables(plainText)
    
    // Complex words (3+ syllables)
    const complexWords = words.filter(word => 
      this.countSyllablesInWord(word) >= 3
    ).length
    
    // Polysyllabic words (3+ syllables) - same as complex for most formulas
    const polysyllabicWords = complexWords
    
    // Averages
    const averageSentenceLength = wordCount / sentenceCount
    const averageSyllablesPerWord = syllableCount / Math.max(wordCount, 1)
    
    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      syllableCount,
      complexWords,
      averageSentenceLength,
      averageSyllablesPerWord,
      characterCount,
      polysyllabicWords
    }
  }

  /**
   * Calculate all readability scores using exact formulas from research
   */
  static calculateReadabilityScores(text: string): ReadabilityScores {
    const metrics = this.getTextMetrics(text)
    
    // Flesch Reading Ease: 206.835 - (1.015 × ASL) - (84.6 × ASW)
    const fleschReadingEase = Math.max(0, Math.min(100,
      206.835 - (1.015 * metrics.averageSentenceLength) - (84.6 * metrics.averageSyllablesPerWord)
    ))
    
    // Flesch-Kincaid Grade Level: (0.39 × ASL) + (11.8 × ASW) - 15.59
    const fleschKincaidGrade = Math.max(0,
      (0.39 * metrics.averageSentenceLength) + (11.8 * metrics.averageSyllablesPerWord) - 15.59
    )
    
    // Gunning Fog Index: 0.4 × [(total words ÷ total sentences) + 100 × (complex words ÷ total words)]
    const gunningFogIndex = 0.4 * (
      metrics.averageSentenceLength + 
      100 * (metrics.complexWords / Math.max(metrics.wordCount, 1))
    )
    
    // SMOG Index: 1.043 × √(polysyllabic words × (30 ÷ sentences)) + 3.1291
    const smogIndex = 1.043 * Math.sqrt(
      metrics.polysyllabicWords * (30 / Math.max(metrics.sentenceCount, 1))
    ) + 3.1291
    
    // Automated Readability Index: 4.71 × (characters ÷ words) + 0.5 × (words ÷ sentences) - 21.43
    const automatedReadabilityIndex = 
      4.71 * (metrics.characterCount / Math.max(metrics.wordCount, 1)) + 
      0.5 * metrics.averageSentenceLength - 21.43
    
    // Coleman-Liau Index: 0.0588 × L - 0.296 × S - 15.8
    const L = (metrics.characterCount / Math.max(metrics.wordCount, 1)) * 100
    const S = (metrics.sentenceCount / Math.max(metrics.wordCount, 1)) * 100
    const colemanLiauIndex = 0.0588 * L - 0.296 * S - 15.8
    
    // Reading time estimation (200 WPM average)
    const readingTimeMinutes = Math.ceil(metrics.wordCount / 200)
    
    // Determine target audience and recommendations
    const { targetAudience, recommendations } = this.getReadabilityRecommendations(
      fleschReadingEase, 
      fleschKincaidGrade, 
      gunningFogIndex,
      smogIndex
    )
    
    return {
      fleschReadingEase,
      fleschKincaidGrade,
      gunningFogIndex,
      smogIndex,
      automatedReadabilityIndex,
      colemanLiauIndex,
      readingTimeMinutes,
      targetAudience,
      recommendations
    }
  }

  /**
   * Advanced keyword analysis with TF-IDF scoring
   */
  static analyzeKeyword(text: string, keyword: string, documentCorpus?: string[]): KeywordAnalysis {
    const plainText = this.stripHtml(text).toLowerCase()
    const normalizedKeyword = keyword.toLowerCase().trim()
    
    if (!normalizedKeyword) {
      return {
        keyword,
        frequency: 0,
        density: 0,
        prominence: 0,
        positions: [],
        contextRelevance: 0,
        tfScore: 0
      }
    }
    
    const words = plainText.split(/\s+/).filter(word => word.length > 0)
    const totalWords = words.length
    
    // Find all positions of the keyword
    const positions: number[] = []
    let frequency = 0
    
    // Handle both single keywords and phrases
    if (normalizedKeyword.includes(' ')) {
      // Multi-word keyword
      const keywordWords = normalizedKeyword.split(/\s+/)
      for (let i = 0; i <= words.length - keywordWords.length; i++) {
        const phrase = words.slice(i, i + keywordWords.length).join(' ')
        if (phrase === normalizedKeyword) {
          positions.push(i)
          frequency++
        }
      }
    } else {
      // Single word keyword
      words.forEach((word, index) => {
        if (word === normalizedKeyword) {
          positions.push(index)
          frequency++
        }
      })
    }
    
    // Calculate density
    const density = totalWords > 0 ? (frequency / totalWords) * 100 : 0
    
    // Calculate prominence (position-weighted scoring)
    const prominence = this.calculateKeywordProminence(positions, totalWords, text, normalizedKeyword)
    
    // Calculate TF score
    const tfScore = totalWords > 0 ? frequency / totalWords : 0
    
    // Calculate IDF and TF-IDF if corpus is provided
    let idfScore: number | undefined
    let tfIdfScore: number | undefined
    
    if (documentCorpus && documentCorpus.length > 0) {
      const documentsWithKeyword = documentCorpus.filter(doc =>
        doc.toLowerCase().includes(normalizedKeyword)
      ).length
      
      if (documentsWithKeyword > 0) {
        idfScore = Math.log(documentCorpus.length / documentsWithKeyword)
        tfIdfScore = tfScore * idfScore
      }
    }
    
    // Calculate contextual relevance
    const contextRelevance = this.calculateContextualRelevance(text, normalizedKeyword, positions)
    
    return {
      keyword,
      frequency,
      density,
      prominence,
      positions,
      contextRelevance,
      tfScore,
      idfScore,
      tfIdfScore
    }
  }

  /**
   * Analyze content structure and semantic HTML usage
   */
  static analyzeContentStructure(html: string): ContentStructure {
    // Count headings
    const headings = {
      h1: (html.match(/<h1[^>]*>/gi) || []).length,
      h2: (html.match(/<h2[^>]*>/gi) || []).length,
      h3: (html.match(/<h3[^>]*>/gi) || []).length,
      h4: (html.match(/<h4[^>]*>/gi) || []).length,
      h5: (html.match(/<h5[^>]*>/gi) || []).length,
      h6: (html.match(/<h6[^>]*>/gi) || []).length
    }
    
    // Count lists
    const lists = {
      ordered: (html.match(/<ol[^>]*>/gi) || []).length,
      unordered: (html.match(/<ul[^>]*>/gi) || []).length
    }
    
    // Count images
    const images = (html.match(/<img[^>]*>/gi) || []).length
    
    // Count links
    const allLinks = html.match(/<a[^>]*href[^>]*>/gi) || []
    const externalLinks = allLinks.filter(link => 
      /href\s*=\s*["']https?:\/\/[^"']*["']/i.test(link)
    ).length
    const internalLinks = allLinks.length - externalLinks
    
    // Check for semantic structure
    const hasSemanticStructure = this.checkSemanticStructure(html)
    
    return {
      headings,
      lists,
      images,
      links: {
        internal: internalLinks,
        external: externalLinks
      },
      hasSemanticStructure
    }
  }

  // Private helper methods
  
  private static stripHtml(html: string): string {
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  private static countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/)
    return words.reduce((total, word) => total + this.countSyllablesInWord(word), 0)
  }
  
  private static countSyllablesInWord(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '')
    if (word.length === 0) return 0
    if (word.length <= 3) return 1
    
    // Count vowel groups
    let syllables = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = 'aeiouy'.includes(word[i])
      if (isVowel && !previousWasVowel) {
        syllables++
      }
      previousWasVowel = isVowel
    }
    
    // Handle silent 'e'
    if (word.endsWith('e')) {
      syllables--
    }
    
    // Ensure at least 1 syllable
    return Math.max(syllables, 1)
  }
  
  private static calculateKeywordProminence(
    positions: number[],
    totalWords: number,
    text: string,
    keyword: string
  ): number {
    if (positions.length === 0) return 0
    
    let score = 0
    const html = text.toLowerCase()
    
    // Check keyword in title (high weight)
    if (html.includes('<title') && html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.includes(keyword)) {
      score += 25
    }
    
    // Check keyword in H1 (high weight)
    if (html.match(/<h1[^>]*>([^<]*)<\/h1>/gi)?.some(h1 => 
      h1.toLowerCase().includes(keyword)
    )) {
      score += 20
    }
    
    // Check keyword in H2-H3 (medium weight)
    if (html.match(/<h[23][^>]*>([^<]*)<\/h[23]>/gi)?.some(h => 
      h.toLowerCase().includes(keyword)
    )) {
      score += 15
    }
    
    // Check keyword in first paragraph (medium weight)
    const firstParagraph = html.match(/<p[^>]*>([^<]*)<\/p>/i)?.[1]
    if (firstParagraph?.includes(keyword)) {
      score += 10
    }
    
    // Position-based scoring (earlier = better)
    positions.forEach(pos => {
      const positionScore = Math.max(0, 10 - (pos / totalWords) * 10)
      score += positionScore
    })
    
    return Math.min(score, 100)
  }
  
  private static calculateContextualRelevance(
    text: string,
    keyword: string,
    positions: number[]
  ): number {
    if (positions.length === 0) return 0
    
    const plainText = this.stripHtml(text).toLowerCase()
    const words = plainText.split(/\s+/)
    let relevanceScore = 0
    
    // Analyze context around each keyword occurrence
    positions.forEach(pos => {
      const contextStart = Math.max(0, pos - 5)
      const contextEnd = Math.min(words.length, pos + 6)
      const context = words.slice(contextStart, contextEnd).join(' ')
      
      // Simple contextual relevance (can be enhanced with NLP)
      const contextWords = context.split(/\s+/)
      const relevantWords = contextWords.filter(word => 
        word.length > 3 && !this.isStopWord(word)
      )
      
      relevanceScore += Math.min(relevantWords.length * 2, 20)
    })
    
    return Math.min(relevanceScore / positions.length, 100)
  }
  
  private static checkSemanticStructure(html: string): boolean {
    const semanticTags = [
      'article', 'section', 'nav', 'aside', 'header', 'footer', 'main'
    ]
    
    return semanticTags.some(tag => 
      new RegExp(`<${tag}[^>]*>`, 'i').test(html)
    )
  }
  
  private static isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'this', 'that', 'these', 'those'
    ]
    
    return stopWords.includes(word.toLowerCase())
  }
  
  private static getReadabilityRecommendations(
    fleschScore: number,
    gradeLevel: number,
    fogIndex: number,
    smogIndex: number
  ): { targetAudience: string; recommendations: string[] } {
    const recommendations: string[] = []
    let targetAudience: string
    
    // Determine target audience based on Flesch Reading Ease
    if (fleschScore >= 90) {
      targetAudience = 'Elementary school students'
    } else if (fleschScore >= 80) {
      targetAudience = 'Middle school students'
    } else if (fleschScore >= 70) {
      targetAudience = 'High school students'
    } else if (fleschScore >= 60) {
      targetAudience = 'College students'
    } else if (fleschScore >= 50) {
      targetAudience = 'College graduates'
    } else if (fleschScore >= 30) {
      targetAudience = 'Advanced readers'
    } else {
      targetAudience = 'Academic/Professional'
    }
    
    // Generate recommendations based on scores
    if (fleschScore < 60) {
      recommendations.push('Consider using shorter sentences to improve readability')
      recommendations.push('Replace complex words with simpler alternatives where possible')
    }
    
    if (gradeLevel > 12) {
      recommendations.push('Content may be too complex for general web audiences')
      recommendations.push('Target 8th-9th grade level for optimal web readability')
    }
    
    if (fogIndex > 12) {
      recommendations.push('Reduce use of complex words (3+ syllables)')
      recommendations.push('Break long sentences into shorter ones')
    }
    
    if (smogIndex > 13) {
      recommendations.push('Content requires high comprehension level')
      recommendations.push('Consider adding explanations for technical terms')
    }
    
    return { targetAudience, recommendations }
  }
} 