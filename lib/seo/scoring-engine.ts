/**
 * Advanced SEO Scoring Engine
 * Implements RankMath-style graduated scoring with mathematical precision
 * Based on industry research from RankMath, Yoast, SEMrush
 */

import { TextAnalyzer, TextMetrics, ReadabilityScores, KeywordAnalysis, ContentStructure } from './text-analysis'

export interface SEOMetadata {
  title: string
  metaDescription: string
  slug: string
  focusKeyword: string
  secondaryKeywords?: string[]
  heroImageUrl?: string
  heroImageAlt?: string
}

export interface SEOScores {
  overall: number
  contentQuality: number
  keywordOptimization: number
  technicalSEO: number
  userExperience: number
  breakdown: {
    contentLength: number
    readability: number
    contentStructure: number
    keywordDensity: number
    keywordDistribution: number
    lsiKeywords: number
    titleOptimization: number
    metaDescriptionOptimization: number
    urlStructure: number
    internalLinking: number
    contentEngagement: number
    visualContent: number
    contentScannability: number
  }
}

export interface SEORecommendation {
  category: 'content' | 'keywords' | 'technical' | 'readability' | 'user-experience'
  type: 'error' | 'warning' | 'suggestion' | 'optimization'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestion: string
  currentValue?: string
  targetValue?: string
  impactScore: number
}

export interface SEOAnalysisResult {
  scores: SEOScores
  recommendations: SEORecommendation[]
  metrics: {
    textMetrics: TextMetrics
    readabilityScores: ReadabilityScores
    keywordAnalysis: KeywordAnalysis[]
    contentStructure: ContentStructure
  }
}

export class SEOScoringEngine {
  private static readonly SCORE_WEIGHTS = {
    contentQuality: 35,
    keywordOptimization: 30,
    technicalSEO: 20,
    userExperience: 15
  }

  private static readonly CONTENT_LENGTH_THRESHOLDS = {
    excellent: 2500,  // 100% score
    good: 2000,       // 70% score
    average: 1500,    // 60% score
    minimum: 1000,    // 40% score
    poor: 600,        // 20% score
    // Below 600: 0% score
  }

  private static readonly KEYWORD_DENSITY_OPTIMAL = {
    min: 0.5,   // Below this: penalties
    ideal: 1.5, // Optimal range: 1.0-1.5%
    max: 2.5,   // Above this: over-optimization warnings
    danger: 5.0 // Above this: severe penalties
  }

  /**
   * Main analysis method - performs comprehensive SEO analysis
   */
  static async analyzeContent(
    content: string, 
    metadata: SEOMetadata,
    documentCorpus?: string[]
  ): Promise<SEOAnalysisResult> {
    // Get basic metrics
    const textMetrics = TextAnalyzer.getTextMetrics(content)
    const readabilityScores = TextAnalyzer.calculateReadabilityScores(content)
    const contentStructure = TextAnalyzer.analyzeContentStructure(content)
    
    // Analyze keywords
    const keywordAnalysis: KeywordAnalysis[] = []
    
    // Primary keyword analysis
    if (metadata.focusKeyword) {
      const primaryAnalysis = TextAnalyzer.analyzeKeyword(
        content, 
        metadata.focusKeyword, 
        documentCorpus
      )
      keywordAnalysis.push({ ...primaryAnalysis, keyword: metadata.focusKeyword })
    }
    
    // Secondary keywords analysis
    if (metadata.secondaryKeywords) {
      for (const keyword of metadata.secondaryKeywords) {
        const analysis = TextAnalyzer.analyzeKeyword(content, keyword, documentCorpus)
        keywordAnalysis.push({ ...analysis, keyword })
      }
    }

    // Calculate scores
    const scores = this.calculateScores(
      content,
      metadata,
      textMetrics,
      readabilityScores,
      keywordAnalysis,
      contentStructure
    )

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      content,
      metadata,
      textMetrics,
      readabilityScores,
      keywordAnalysis,
      contentStructure,
      scores
    )

    return {
      scores,
      recommendations,
      metrics: {
        textMetrics,
        readabilityScores,
        keywordAnalysis,
        contentStructure
      }
    }
  }

  /**
   * Calculate all SEO scores using graduated thresholds
   */
  private static calculateScores(
    content: string,
    metadata: SEOMetadata,
    textMetrics: TextMetrics,
    readabilityScores: ReadabilityScores,
    keywordAnalysis: KeywordAnalysis[],
    contentStructure: ContentStructure
  ): SEOScores {
    // Content Quality Scoring (35 points)
    const contentLength = this.calculateContentLengthScore(textMetrics.wordCount)
    const readability = this.calculateReadabilityScore(readabilityScores)
    const contentStructureScore = this.calculateContentStructureScore(contentStructure)
    const contentQuality = Math.round(
      (contentLength * 0.4 + readability * 0.4 + contentStructureScore * 0.2) * 
      (this.SCORE_WEIGHTS.contentQuality / 100)
    )

    // Keyword Optimization Scoring (30 points)
    const primaryKeyword = keywordAnalysis.find(k => k.keyword === metadata.focusKeyword)
    const keywordDensity = this.calculateKeywordDensityScore(primaryKeyword?.density || 0)
    const keywordDistribution = this.calculateKeywordDistributionScore(primaryKeyword || null, content, metadata)
    const lsiKeywords = this.calculateLSIKeywordsScore(keywordAnalysis.slice(1))
    const keywordOptimization = Math.round(
      (keywordDensity * 0.5 + keywordDistribution * 0.35 + lsiKeywords * 0.15) * 
      (this.SCORE_WEIGHTS.keywordOptimization / 100)
    )

    // Technical SEO Scoring (20 points)
    const titleOptimization = this.calculateTitleOptimizationScore(metadata.title, metadata.focusKeyword)
    const metaDescriptionOptimization = this.calculateMetaDescriptionScore(metadata.metaDescription, metadata.focusKeyword)
    const urlStructure = this.calculateURLStructureScore(metadata.slug, metadata.focusKeyword)
    const internalLinking = this.calculateInternalLinkingScore(contentStructure.links.internal)
    const technicalSEO = Math.round(
      (titleOptimization * 0.4 + metaDescriptionOptimization * 0.3 + urlStructure * 0.15 + internalLinking * 0.15) * 
      (this.SCORE_WEIGHTS.technicalSEO / 100)
    )

    // User Experience Scoring (15 points)
    const contentEngagement = this.calculateContentEngagementScore(textMetrics, readabilityScores)
    const visualContent = this.calculateVisualContentScore(contentStructure.images, metadata.heroImageUrl, metadata.heroImageAlt)
    const contentScannability = this.calculateScannabilityScore(contentStructure)
    const userExperience = Math.round(
      (contentEngagement * 0.55 + visualContent * 0.25 + contentScannability * 0.2) * 
      (this.SCORE_WEIGHTS.userExperience / 100)
    )

    const overall = contentQuality + keywordOptimization + technicalSEO + userExperience

    return {
      overall: Math.min(overall, 100),
      contentQuality,
      keywordOptimization,
      technicalSEO,
      userExperience,
      breakdown: {
        contentLength,
        readability,
        contentStructure: contentStructureScore,
        keywordDensity,
        keywordDistribution,
        lsiKeywords,
        titleOptimization,
        metaDescriptionOptimization,
        urlStructure,
        internalLinking,
        contentEngagement,
        visualContent,
        contentScannability
      }
    }
  }

  /**
   * Content Length Scoring - Progressive scale from RankMath research
   */
  private static calculateContentLengthScore(wordCount: number): number {
    if (wordCount >= this.CONTENT_LENGTH_THRESHOLDS.excellent) return 100
    if (wordCount >= this.CONTENT_LENGTH_THRESHOLDS.good) return 70
    if (wordCount >= this.CONTENT_LENGTH_THRESHOLDS.average) return 60
    if (wordCount >= this.CONTENT_LENGTH_THRESHOLDS.minimum) return 40
    if (wordCount >= this.CONTENT_LENGTH_THRESHOLDS.poor) return 20
    return 0
  }

  /**
   * Readability Scoring - Multi-formula approach
   */
  private static calculateReadabilityScore(readabilityScores: ReadabilityScores): number {
    let score = 0
    
    // Flesch Reading Ease (40% weight) - Target: 60-70 for web content
    if (readabilityScores.fleschReadingEase >= 60 && readabilityScores.fleschReadingEase <= 80) {
      score += 40
    } else if (readabilityScores.fleschReadingEase >= 50) {
      score += 30
    } else if (readabilityScores.fleschReadingEase >= 30) {
      score += 20
    } else {
      score += 10
    }
    
    // Grade Level (30% weight) - Target: Below 12th grade
    if (readabilityScores.fleschKincaidGrade <= 8) {
      score += 30
    } else if (readabilityScores.fleschKincaidGrade <= 12) {
      score += 20
    } else if (readabilityScores.fleschKincaidGrade <= 16) {
      score += 10
    }
    
    // Gunning Fog (30% weight) - Target: Below 12
    if (readabilityScores.gunningFogIndex <= 10) {
      score += 30
    } else if (readabilityScores.gunningFogIndex <= 12) {
      score += 20
    } else if (readabilityScores.gunningFogIndex <= 15) {
      score += 10
    }
    
    return Math.min(score, 100)
  }

  /**
   * Content Structure Scoring - Semantic HTML analysis
   */
  private static calculateContentStructureScore(structure: ContentStructure): number {
    let score = 0
    
    // Heading hierarchy (40 points)
    if (structure.headings.h1 === 1) score += 15 // Exactly one H1
    else if (structure.headings.h1 > 1) score += 5 // Multiple H1s penalty
    
    if (structure.headings.h2 > 0) score += 15 // Has H2s for structure
    if (structure.headings.h3 > 0) score += 10 // Has H3s for sub-structure
    
    // Lists usage (30 points)
    const totalLists = structure.lists.ordered + structure.lists.unordered
    if (totalLists >= 3) score += 30
    else if (totalLists >= 2) score += 20
    else if (totalLists >= 1) score += 10
    
    // Semantic structure (30 points)
    if (structure.hasSemanticStructure) score += 30
    else score += 10 // Basic HTML without semantic tags
    
    return Math.min(score, 100)
  }

  /**
   * Keyword Density Scoring - Graduated penalties from research
   */
  private static calculateKeywordDensityScore(density: number): number {
    if (density >= this.KEYWORD_DENSITY_OPTIMAL.min && density <= this.KEYWORD_DENSITY_OPTIMAL.ideal) {
      return 100 // Optimal range
    }
    
    if (density < this.KEYWORD_DENSITY_OPTIMAL.min) {
      // Linear scaling for low density
      return Math.max(0, (density / this.KEYWORD_DENSITY_OPTIMAL.min) * 100)
    }
    
    if (density <= this.KEYWORD_DENSITY_OPTIMAL.max) {
      return 80 // Still acceptable
    }
    
    if (density >= this.KEYWORD_DENSITY_OPTIMAL.danger) {
      return 0 // Severe over-optimization
    }
    
    // Graduated penalty for over-optimization
    const penalty = (density - this.KEYWORD_DENSITY_OPTIMAL.max) * 20
    return Math.max(0, 80 - penalty)
  }

  /**
   * Keyword Distribution Scoring - Position and context analysis
   */
  private static calculateKeywordDistributionScore(
    keywordAnalysis: KeywordAnalysis | null,
    content: string,
    metadata: SEOMetadata
  ): number {
    if (!keywordAnalysis || !metadata.focusKeyword) return 0
    
    let score = 0
    const keyword = metadata.focusKeyword.toLowerCase()
    
    // Title optimization (25 points)
    if (metadata.title.toLowerCase().includes(keyword)) {
      score += 25
    }
    
    // URL optimization (15 points)
    if (metadata.slug.toLowerCase().includes(keyword)) {
      score += 15
    }
    
    // Meta description (15 points)
    if (metadata.metaDescription.toLowerCase().includes(keyword)) {
      score += 15
    }
    
    // H1 tag (20 points)
    const h1Match = content.match(/<h1[^>]*>([^<]*)<\/h1>/i)
    if (h1Match && h1Match[1].toLowerCase().includes(keyword)) {
      score += 20
    }
    
    // First paragraph (10 points)
    const firstParagraph = content.match(/<p[^>]*>([^<]*)<\/p>/i)
    if (firstParagraph && firstParagraph[1].toLowerCase().includes(keyword)) {
      score += 10
    }
    
    // Prominence score from analysis (15 points)
    score += Math.min(keywordAnalysis.prominence * 0.15, 15)
    
    return Math.min(score, 100)
  }

  /**
   * LSI Keywords Scoring - Related terms analysis
   */
  private static calculateLSIKeywordsScore(secondaryKeywords: KeywordAnalysis[]): number {
    if (secondaryKeywords.length === 0) return 0
    
    const foundKeywords = secondaryKeywords.filter(k => k.frequency > 0)
    const score = (foundKeywords.length / Math.max(secondaryKeywords.length, 1)) * 100
    
    return Math.min(score, 100)
  }

  /**
   * Title Optimization Scoring - Enhanced analysis
   */
  private static calculateTitleOptimizationScore(title: string, focusKeyword: string): number {
    if (!title.trim()) return 0
    
    let score = 0
    
    // Length optimization (40 points)
    if (title.length >= 30 && title.length <= 60) {
      score += 40
    } else if (title.length >= 25 && title.length <= 70) {
      score += 30
    } else if (title.length >= 20 && title.length <= 80) {
      score += 20
    } else {
      score += 10
    }
    
    // Keyword inclusion (40 points)
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) {
      // Bonus for keyword position
      const keywordPosition = title.toLowerCase().indexOf(focusKeyword.toLowerCase())
      if (keywordPosition === 0) {
        score += 40 // Keyword at start
      } else if (keywordPosition <= title.length * 0.5) {
        score += 35 // Keyword in first half
      } else {
        score += 30 // Keyword in second half
      }
    }
    
    // Readability (20 points)
    const words = title.split(/\s+/).length
    if (words >= 5 && words <= 12) {
      score += 20
    } else if (words >= 3 && words <= 15) {
      score += 15
    } else {
      score += 10
    }
    
    return Math.min(score, 100)
  }

  /**
   * Meta Description Scoring - Enhanced analysis
   */
  private static calculateMetaDescriptionScore(description: string, focusKeyword: string): number {
    if (!description.trim()) return 0
    
    let score = 0
    
    // Length optimization (50 points)
    if (description.length >= 120 && description.length <= 160) {
      score += 50
    } else if (description.length >= 100 && description.length <= 180) {
      score += 40
    } else if (description.length >= 80 && description.length <= 200) {
      score += 30
    } else {
      score += 15
    }
    
    // Keyword inclusion (30 points)
    if (focusKeyword && description.toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 30
    }
    
    // Call-to-action words (20 points)
    const ctaWords = ['learn', 'discover', 'find', 'get', 'try', 'start', 'explore', 'read']
    const hasCtaWords = ctaWords.some(word => 
      description.toLowerCase().includes(word)
    )
    if (hasCtaWords) score += 20
    
    return Math.min(score, 100)
  }

  /**
   * URL Structure Scoring
   */
  private static calculateURLStructureScore(slug: string, focusKeyword: string): number {
    if (!slug.trim()) return 0
    
    let score = 0
    
    // Length (30 points)
    if (slug.length <= 75) {
      score += 30
    } else if (slug.length <= 100) {
      score += 20
    } else {
      score += 10
    }
    
    // Keyword inclusion (40 points)
    if (focusKeyword && slug.toLowerCase().includes(focusKeyword.toLowerCase())) {
      score += 40
    }
    
    // Structure (30 points)
    if (/^[a-z0-9-]+$/.test(slug)) {
      score += 30 // Clean structure
    } else if (/^[a-z0-9-_]+$/i.test(slug)) {
      score += 20 // Acceptable structure
    } else {
      score += 10 // Poor structure
    }
    
    return Math.min(score, 100)
  }

  /**
   * Internal Linking Scoring
   */
  private static calculateInternalLinkingScore(internalLinks: number): number {
    if (internalLinks >= 5) return 100
    if (internalLinks >= 3) return 80
    if (internalLinks >= 1) return 60
    return 0
  }

  /**
   * Content Engagement Scoring - Predictive metrics
   */
  private static calculateContentEngagementScore(
    textMetrics: TextMetrics,
    readabilityScores: ReadabilityScores
  ): number {
    let score = 0
    
    // Reading time (40 points) - Target: 3-8 minutes
    const readingTime = readabilityScores.readingTimeMinutes
    if (readingTime >= 3 && readingTime <= 8) {
      score += 40
    } else if (readingTime >= 2 && readingTime <= 12) {
      score += 30
    } else if (readingTime >= 1 && readingTime <= 15) {
      score += 20
    } else {
      score += 10
    }
    
    // Paragraph structure (30 points)
    const avgWordsPerParagraph = textMetrics.wordCount / textMetrics.paragraphCount
    if (avgWordsPerParagraph >= 40 && avgWordsPerParagraph <= 100) {
      score += 30
    } else if (avgWordsPerParagraph >= 20 && avgWordsPerParagraph <= 150) {
      score += 20
    } else {
      score += 10
    }
    
    // Sentence variety (30 points)
    if (textMetrics.averageSentenceLength >= 12 && textMetrics.averageSentenceLength <= 20) {
      score += 30
    } else if (textMetrics.averageSentenceLength >= 8 && textMetrics.averageSentenceLength <= 25) {
      score += 20
    } else {
      score += 10
    }
    
    return Math.min(score, 100)
  }

  /**
   * Visual Content Scoring
   */
  private static calculateVisualContentScore(
    imageCount: number,
    heroImageUrl?: string,
    heroImageAlt?: string
  ): number {
    let score = 0
    
    // Hero image (40 points)
    if (heroImageUrl) {
      score += 25
      if (heroImageAlt && heroImageAlt.trim().length > 0) {
        score += 15 // Alt text bonus
      }
    }
    
    // Content images (60 points)
    if (imageCount >= 4) {
      score += 60
    } else if (imageCount >= 2) {
      score += 40
    } else if (imageCount >= 1) {
      score += 20
    }
    
    return Math.min(score, 100)
  }

  /**
   * Content Scannability Scoring
   */
  private static calculateScannabilityScore(structure: ContentStructure): number {
    let score = 0
    
    // Heading distribution (50 points)
    const totalHeadings = Object.values(structure.headings).reduce((sum, count) => sum + count, 0)
    if (totalHeadings >= 6) {
      score += 50
    } else if (totalHeadings >= 4) {
      score += 40
    } else if (totalHeadings >= 2) {
      score += 30
    } else if (totalHeadings >= 1) {
      score += 20
    }
    
    // Lists usage (30 points)
    const totalLists = structure.lists.ordered + structure.lists.unordered
    if (totalLists >= 2) {
      score += 30
    } else if (totalLists >= 1) {
      score += 20
    }
    
    // Link distribution (20 points)
    const totalLinks = structure.links.internal + structure.links.external
    if (totalLinks >= 5) {
      score += 20
    } else if (totalLinks >= 3) {
      score += 15
    } else if (totalLinks >= 1) {
      score += 10
    }
    
    return Math.min(score, 100)
  }

  /**
   * Generate comprehensive recommendations
   */
  private static generateRecommendations(
    content: string,
    metadata: SEOMetadata,
    textMetrics: TextMetrics,
    readabilityScores: ReadabilityScores,
    keywordAnalysis: KeywordAnalysis[],
    contentStructure: ContentStructure,
    scores: SEOScores
  ): SEORecommendation[] {
    const recommendations: SEORecommendation[] = []
    
    // Content Length Recommendations
    if (textMetrics.wordCount < this.CONTENT_LENGTH_THRESHOLDS.minimum) {
      recommendations.push({
        category: 'content',
        type: 'error',
        priority: 'high',
        title: 'Content Too Short',
        description: `Your content has only ${textMetrics.wordCount} words.`,
        suggestion: `Expand your content to at least ${this.CONTENT_LENGTH_THRESHOLDS.minimum} words for better SEO performance.`,
        currentValue: `${textMetrics.wordCount} words`,
        targetValue: `${this.CONTENT_LENGTH_THRESHOLDS.minimum}+ words`,
        impactScore: 8
      })
    } else if (textMetrics.wordCount < this.CONTENT_LENGTH_THRESHOLDS.good) {
      recommendations.push({
        category: 'content',
        type: 'suggestion',
        priority: 'medium',
        title: 'Consider Expanding Content',
        description: `Your content length is adequate but could be improved.`,
        suggestion: `Consider expanding to ${this.CONTENT_LENGTH_THRESHOLDS.good}+ words for even better SEO performance.`,
        currentValue: `${textMetrics.wordCount} words`,
        targetValue: `${this.CONTENT_LENGTH_THRESHOLDS.good}+ words`,
        impactScore: 6
      })
    }
    
    // Readability Recommendations
    if (readabilityScores.fleschReadingEase < 50) {
      recommendations.push({
        category: 'readability',
        type: 'warning',
        priority: 'medium',
        title: 'Content Difficult to Read',
        description: 'Your content may be too complex for most web users.',
        suggestion: 'Use shorter sentences and simpler words to improve readability.',
        currentValue: `${Math.round(readabilityScores.fleschReadingEase)} (Difficult)`,
        targetValue: '60-80 (Good)',
        impactScore: 7
      })
    }
    
    // Keyword Density Recommendations
    const primaryKeyword = keywordAnalysis.find(k => k.keyword === metadata.focusKeyword)
    if (primaryKeyword) {
      if (primaryKeyword.density < this.KEYWORD_DENSITY_OPTIMAL.min) {
        recommendations.push({
          category: 'keywords',
          type: 'warning',
          priority: 'high',
          title: 'Keyword Density Too Low',
          description: `Your focus keyword "${metadata.focusKeyword}" appears too infrequently.`,
          suggestion: `Use your focus keyword more naturally throughout the content. Target density: ${this.KEYWORD_DENSITY_OPTIMAL.min}-${this.KEYWORD_DENSITY_OPTIMAL.ideal}%`,
          currentValue: `${primaryKeyword.density.toFixed(2)}%`,
          targetValue: `${this.KEYWORD_DENSITY_OPTIMAL.min}-${this.KEYWORD_DENSITY_OPTIMAL.ideal}%`,
          impactScore: 8
        })
      } else if (primaryKeyword.density > this.KEYWORD_DENSITY_OPTIMAL.max) {
        recommendations.push({
          category: 'keywords',
          type: 'error',
          priority: 'high',
          title: 'Keyword Over-Optimization',
          description: `Your focus keyword "${metadata.focusKeyword}" appears too frequently.`,
          suggestion: 'Reduce keyword usage to avoid over-optimization penalties.',
          currentValue: `${primaryKeyword.density.toFixed(2)}%`,
          targetValue: `${this.KEYWORD_DENSITY_OPTIMAL.min}-${this.KEYWORD_DENSITY_OPTIMAL.ideal}%`,
          impactScore: 9
        })
      }
    }
    
    // Title Optimization Recommendations
    if (metadata.title.length < 30 || metadata.title.length > 60) {
      recommendations.push({
        category: 'technical',
        type: 'warning',
        priority: 'high',
        title: 'Title Length Not Optimal',
        description: 'Your title length is not in the optimal range for search engines.',
        suggestion: 'Optimize your title to be between 30-60 characters for best results.',
        currentValue: `${metadata.title.length} characters`,
        targetValue: '30-60 characters',
        impactScore: 7
      })
    }
    
    if (metadata.focusKeyword && !metadata.title.toLowerCase().includes(metadata.focusKeyword.toLowerCase())) {
      recommendations.push({
        category: 'technical',
        type: 'error',
        priority: 'high',
        title: 'Focus Keyword Missing from Title',
        description: 'Your title does not contain the focus keyword.',
        suggestion: `Include your focus keyword "${metadata.focusKeyword}" in the title.`,
        currentValue: 'Not present',
        targetValue: 'Present in title',
        impactScore: 9
      })
    }
    
    // Meta Description Recommendations
    if (!metadata.metaDescription || metadata.metaDescription.length < 120 || metadata.metaDescription.length > 160) {
      recommendations.push({
        category: 'technical',
        type: 'warning',
        priority: 'medium',
        title: 'Meta Description Length Not Optimal',
        description: 'Your meta description length is not in the optimal range.',
        suggestion: 'Write a meta description between 120-160 characters.',
        currentValue: `${metadata.metaDescription?.length || 0} characters`,
        targetValue: '120-160 characters',
        impactScore: 6
      })
    }
    
    // Content Structure Recommendations
    if (contentStructure.headings.h1 === 0) {
      recommendations.push({
        category: 'content',
        type: 'error',
        priority: 'high',
        title: 'Missing H1 Tag',
        description: 'Your content does not have an H1 heading.',
        suggestion: 'Add one H1 heading as the main title of your content.',
        currentValue: '0 H1 tags',
        targetValue: '1 H1 tag',
        impactScore: 8
      })
    } else if (contentStructure.headings.h1 > 1) {
      recommendations.push({
        category: 'content',
        type: 'warning',
        priority: 'medium',
        title: 'Multiple H1 Tags',
        description: 'Your content has multiple H1 headings.',
        suggestion: 'Use only one H1 tag per page for better SEO.',
        currentValue: `${contentStructure.headings.h1} H1 tags`,
        targetValue: '1 H1 tag',
        impactScore: 6
      })
    }
    
    if (contentStructure.headings.h2 === 0) {
      recommendations.push({
        category: 'content',
        type: 'suggestion',
        priority: 'medium',
        title: 'Consider Adding H2 Headings',
        description: 'Your content lacks H2 headings for better structure.',
        suggestion: 'Add H2 headings to break up your content into logical sections.',
        currentValue: '0 H2 tags',
        targetValue: '2+ H2 tags',
        impactScore: 5
      })
    }
    
    // Image Recommendations
    if (!metadata.heroImageUrl) {
      recommendations.push({
        category: 'user-experience',
        type: 'suggestion',
        priority: 'medium',
        title: 'Missing Hero Image',
        description: 'Your article does not have a hero image.',
        suggestion: 'Add a relevant hero image to improve user engagement.',
        currentValue: 'No hero image',
        targetValue: 'Hero image with alt text',
        impactScore: 5
      })
    } else if (!metadata.heroImageAlt || metadata.heroImageAlt.trim().length === 0) {
      recommendations.push({
        category: 'user-experience',
        type: 'warning',
        priority: 'medium',
        title: 'Missing Hero Image Alt Text',
        description: 'Your hero image does not have alt text.',
        suggestion: 'Add descriptive alt text to your hero image for accessibility and SEO.',
        currentValue: 'No alt text',
        targetValue: 'Descriptive alt text',
        impactScore: 6
      })
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
} 