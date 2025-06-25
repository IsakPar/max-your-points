import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, XCircle, Target, FileText, Hash, Image, Link2, Eye } from 'lucide-react'

interface SEOAnalysis {
  score: number
  title: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  metaDescription: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  content: {
    score: number
    issues: string[]
    suggestions: string[]
    wordCount: number
    readabilityScore: number
    headingStructure: {
      h1: number
      h2: number
      h3: number
      h4: number
      h5: number
      h6: number
    }
  }
  keyword: {
    score: number
    density: number
    issues: string[]
    suggestions: string[]
  }
  technical: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  images: {
    score: number
    issues: string[]
    suggestions: string[]
  }
}

interface SEOCalculatorProps {
  title: string
  metaDescription: string
  content: string
  focusKeyword: string
  slug: string
  heroImageAlt: string
  heroImageUrl: string
}

const SEOCalculator: React.FC<SEOCalculatorProps> = ({
  title,
  metaDescription,
  content,
  focusKeyword,
  slug,
  heroImageAlt,
  heroImageUrl
}) => {
  // Utility functions
  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  const extractHeadings = (html: string) => {
    const headings = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 }
    const headingMatches = html.match(/<h([1-6])[^>]*>/gi) || []
    
    headingMatches.forEach((match: string) => {
      const levelMatch = match.match(/h([1-6])/i)
      if (levelMatch && levelMatch[1]) {
        const level = levelMatch[1]
        if (level >= '1' && level <= '6') {
          headings[`h${level}` as keyof typeof headings]++
        }
      }
    })
    
    return headings
  }

  const calculateReadability = (text: string): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const words = text.split(/\s+/).filter(w => w.length > 0).length
    const syllables = text.toLowerCase().match(/[aeiouy]+/g)?.length || 0
    
    if (sentences === 0 || words === 0) return 0
    
    // Simplified Flesch Reading Ease
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, score))
  }

  const analyzeKeywordDensity = (text: string, keyword: string): number => {
    if (!keyword.trim()) return 0
    
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    const keywordOccurrences = text.toLowerCase().split(keyword.toLowerCase()).length - 1
    
    return words.length > 0 ? (keywordOccurrences / words.length) * 100 : 0
  }

  const checkHtmlStructure = (html: string) => {
    const issues: string[] = []
    const suggestions: string[] = []
    
    // Check for semantic HTML
    if (!html.includes('<h1') && !html.includes('<h2') && !html.includes('<h3')) {
      issues.push('No heading structure detected')
      suggestions.push('Add proper heading hierarchy (H1, H2, H3) to improve content structure')
    }
    
    // Check for H1 tag
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
    if (h1Count === 0) {
      issues.push('Missing H1 tag')
      suggestions.push('Add an H1 tag as the main heading of your content')
    } else if (h1Count > 1) {
      issues.push('Multiple H1 tags detected')
      suggestions.push('Use only one H1 tag per page for better SEO')
    }
    
    // Check for paragraph tags
    if (html.length > 200 && !html.includes('<p>')) {
      issues.push('Plain text without paragraph tags')
      suggestions.push('Wrap your content in proper paragraph tags (<p>) for better semantics')
    }
    
    // Check for list structures
    if (html.includes('•') || html.includes('-') || /^\d+\./.test(html)) {
      if (!html.includes('<ul>') && !html.includes('<ol>')) {
        issues.push('Unstructured lists detected')
        suggestions.push('Convert bullet points to proper HTML lists (<ul>, <ol>) for better semantics')
      }
    }
    
    return { issues, suggestions }
  }

  // Main analysis function
  const analyzeContent = (): SEOAnalysis => {
    const plainTextContent = stripHtml(content)
    const wordCount = plainTextContent.split(/\s+/).filter(w => w.length > 0).length
    const headingStructure = extractHeadings(content)
    const readabilityScore = calculateReadability(plainTextContent)
    const keywordDensity = analyzeKeywordDensity(plainTextContent, focusKeyword)
    const htmlStructure = checkHtmlStructure(content)

    // Title Analysis
    const titleAnalysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[]
    }

    if (!title.trim()) {
      titleAnalysis.issues.push('Missing title')
      titleAnalysis.suggestions.push('Add a compelling title for your article')
    } else {
      if (title.length < 30) {
        titleAnalysis.issues.push('Title too short')
        titleAnalysis.suggestions.push('Expand your title to 30-60 characters for better SEO')
        titleAnalysis.score += 5
      } else if (title.length > 60) {
        titleAnalysis.issues.push('Title too long')
        titleAnalysis.suggestions.push('Shorten your title to under 60 characters to avoid truncation')
        titleAnalysis.score += 5
      } else {
        titleAnalysis.score += 15
      }

      if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) {
        titleAnalysis.score += 10
      } else if (focusKeyword) {
        titleAnalysis.issues.push('Focus keyword missing from title')
        titleAnalysis.suggestions.push(`Include your focus keyword "${focusKeyword}" in the title`)
      }
    }

    // Meta Description Analysis
    const metaAnalysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[]
    }

    if (!metaDescription.trim()) {
      metaAnalysis.issues.push('Missing meta description')
      metaAnalysis.suggestions.push('Add a meta description to improve click-through rates')
    } else {
      if (metaDescription.length < 120) {
        metaAnalysis.issues.push('Meta description too short')
        metaAnalysis.suggestions.push('Expand your meta description to 120-160 characters')
        metaAnalysis.score += 5
      } else if (metaDescription.length > 160) {
        metaAnalysis.issues.push('Meta description too long')
        metaAnalysis.suggestions.push('Shorten your meta description to under 160 characters')
        metaAnalysis.score += 5
      } else {
        metaAnalysis.score += 15
      }

      if (focusKeyword && metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
        metaAnalysis.score += 10
      } else if (focusKeyword) {
        metaAnalysis.issues.push('Focus keyword missing from meta description')
        metaAnalysis.suggestions.push(`Include your focus keyword "${focusKeyword}" in the meta description`)
      }
    }

    // Content Analysis
    const contentAnalysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[],
      wordCount,
      readabilityScore,
      headingStructure
    }

    if (wordCount < 300) {
      contentAnalysis.issues.push('Content too short')
      contentAnalysis.suggestions.push('Expand your content to at least 300 words for better SEO')
    } else if (wordCount < 500) {
      contentAnalysis.score += 10
      contentAnalysis.suggestions.push('Consider expanding to 500+ words for even better SEO')
    } else {
      contentAnalysis.score += 20
    }

    if (readabilityScore < 30) {
      contentAnalysis.issues.push('Content difficult to read')
      contentAnalysis.suggestions.push('Simplify sentences and use shorter paragraphs')
    } else if (readabilityScore < 60) {
      contentAnalysis.score += 5
      contentAnalysis.suggestions.push('Good readability, consider minor improvements')
    } else {
      contentAnalysis.score += 10
    }

    // Add HTML structure issues
    contentAnalysis.issues.push(...htmlStructure.issues)
    contentAnalysis.suggestions.push(...htmlStructure.suggestions)

    // Keyword Analysis
    const keywordAnalysis = {
      score: 0,
      density: keywordDensity,
      issues: [] as string[],
      suggestions: [] as string[]
    }

    if (!focusKeyword.trim()) {
      keywordAnalysis.issues.push('No focus keyword specified')
      keywordAnalysis.suggestions.push('Define a focus keyword to optimize your content')
    } else {
      if (keywordDensity < 0.5) {
        keywordAnalysis.issues.push('Keyword density too low')
        keywordAnalysis.suggestions.push(`Use "${focusKeyword}" more frequently in your content (aim for 0.5-2.5%)`)
      } else if (keywordDensity > 2.5) {
        keywordAnalysis.issues.push('Keyword density too high')
        keywordAnalysis.suggestions.push(`Reduce usage of "${focusKeyword}" to avoid keyword stuffing`)
      } else {
        keywordAnalysis.score += 15
      }

      if (slug.toLowerCase().includes(focusKeyword.toLowerCase())) {
        keywordAnalysis.score += 10
      } else {
        keywordAnalysis.issues.push('Focus keyword missing from URL')
        keywordAnalysis.suggestions.push(`Include "${focusKeyword}" in your URL slug`)
      }
    }

    // Technical Analysis
    const technicalAnalysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[]
    }

    if (!slug.trim()) {
      technicalAnalysis.issues.push('Missing URL slug')
      technicalAnalysis.suggestions.push('Add a SEO-friendly URL slug')
    } else {
      if (slug.length > 75) {
        technicalAnalysis.issues.push('URL slug too long')
        technicalAnalysis.suggestions.push('Keep URL slug under 75 characters')
      } else {
        technicalAnalysis.score += 10
      }

      if (/^[a-z0-9-]+$/.test(slug)) {
        technicalAnalysis.score += 10
      } else {
        technicalAnalysis.issues.push('URL slug contains invalid characters')
        technicalAnalysis.suggestions.push('Use only lowercase letters, numbers, and hyphens in URL slug')
      }
    }

    // Images Analysis
    const imagesAnalysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[]
    }

    if (!heroImageUrl.trim()) {
      imagesAnalysis.issues.push('Missing hero image')
      imagesAnalysis.suggestions.push('Add a hero image to improve engagement')
    } else {
      if (!heroImageAlt.trim()) {
        imagesAnalysis.issues.push('Missing alt text for hero image')
        imagesAnalysis.suggestions.push('Add descriptive alt text for better accessibility and SEO')
      } else {
        imagesAnalysis.score += 10
        if (focusKeyword && heroImageAlt.toLowerCase().includes(focusKeyword.toLowerCase())) {
          imagesAnalysis.score += 10
        } else if (focusKeyword) {
          imagesAnalysis.suggestions.push(`Consider including "${focusKeyword}" in the hero image alt text`)
        }
      }
    }

    // Calculate overall score
    const totalScore = titleAnalysis.score + metaAnalysis.score + contentAnalysis.score + 
                      keywordAnalysis.score + technicalAnalysis.score + imagesAnalysis.score

    return {
      score: Math.min(totalScore, 100),
      title: titleAnalysis,
      metaDescription: metaAnalysis,
      content: contentAnalysis,
      keyword: keywordAnalysis,
      technical: technicalAnalysis,
      images: imagesAnalysis
    }
  }

  const analysis = analyzeContent()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (score >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            SEO Score
          </CardTitle>
          <CardDescription>
            Overall content optimization score based on SEO best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">
                  <span className={getScoreColor(analysis.score)}>
                    {analysis.score}/100
                  </span>
                </span>
                {getScoreIcon(analysis.score)}
              </div>
              <Progress 
                value={analysis.score} 
                className="h-3"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Title: {analysis.title.score}/25</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>Meta: {analysis.metaDescription.score}/25</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Content: {analysis.content.score}/30</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Keywords: {analysis.keyword.score}/25</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span>Technical: {analysis.technical.score}/20</span>
            </div>
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>Images: {analysis.images.score}/20</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Content Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Word Count:</span>
              <p className={analysis.content.wordCount >= 300 ? 'text-green-600' : 'text-red-600'}>
                {analysis.content.wordCount}
              </p>
            </div>
            <div>
              <span className="font-medium">Readability:</span>
              <p className={analysis.content.readabilityScore >= 60 ? 'text-green-600' : 'text-yellow-600'}>
                {Math.round(analysis.content.readabilityScore)}/100
              </p>
            </div>
            <div>
              <span className="font-medium">Keyword Density:</span>
              <p className={analysis.keyword.density >= 0.5 && analysis.keyword.density <= 2.5 ? 'text-green-600' : 'text-red-600'}>
                {analysis.keyword.density.toFixed(1)}%
              </p>
            </div>
            <div>
              <span className="font-medium">Heading Structure:</span>
              <p className="text-xs">
                H1: {analysis.content.headingStructure.h1}, 
                H2: {analysis.content.headingStructure.h2}, 
                H3: {analysis.content.headingStructure.h3}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues and Suggestions */}
      {(analysis.title.issues.length > 0 || analysis.metaDescription.issues.length > 0 || 
        analysis.content.issues.length > 0 || analysis.keyword.issues.length > 0 || 
        analysis.technical.issues.length > 0 || analysis.images.issues.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Issues & Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...analysis.title.issues, ...analysis.metaDescription.issues, 
              ...analysis.content.issues, ...analysis.keyword.issues,
              ...analysis.technical.issues, ...analysis.images.issues].map((issue, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Suggestions for Improvement:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {[...analysis.title.suggestions, ...analysis.metaDescription.suggestions,
                  ...analysis.content.suggestions, ...analysis.keyword.suggestions,
                  ...analysis.technical.suggestions, ...analysis.images.suggestions].map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SEOCalculator 