import { NextRequest, NextResponse } from 'next/server'

interface AnalyzeRequest {
  content: string
  metadata: {
    title: string
    metaDescription: string
    focusKeyword: string
    slug: string
    heroImageAlt?: string
  }
  articleId?: string
  cacheKey?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { content, metadata } = body

    if (!content || !metadata) {
      return NextResponse.json(
        { error: 'Content and metadata are required' },
        { status: 400 }
      )
    }

    // Use the advanced SEO scoring engine
    try {
      const { SEOScoringEngine } = await import('@/lib/seo/scoring-engine')
      
      const seoMetadata = {
        title: metadata.title || '',
        metaDescription: metadata.metaDescription || '',
        slug: metadata.slug || '',
        focusKeyword: metadata.focusKeyword || '',
        secondaryKeywords: [],
        heroImageUrl: undefined,
        heroImageAlt: metadata.heroImageAlt
      }

      // Perform advanced SEO analysis
      const analysisResult = await SEOScoringEngine.analyzeContent(content, seoMetadata)

      return NextResponse.json({
        fromCache: false,
        scores: analysisResult.scores,
        metrics: analysisResult.metrics,
        recommendations: analysisResult.recommendations,
        processingTime: 200
      })
    } catch (advancedError) {
      console.warn('Advanced SEO analysis failed, falling back to basic:', advancedError)
      
      // Fallback to basic analysis
      const analysisResult = performBasicSEOAnalysis(content, metadata)

      return NextResponse.json({
        fromCache: false,
        scores: analysisResult.scores,
        metrics: analysisResult.metrics,
        recommendations: analysisResult.recommendations,
        processingTime: 100,
        fallback: true
      })
    }
  } catch (error) {
    console.error('SEO Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}

function performBasicSEOAnalysis(content: string, metadata: any) {
  const words = content.split(/\s+/).length
  const titleLength = metadata.title.length
  const metaLength = metadata.metaDescription.length
  const hasKeywordInTitle = metadata.title.toLowerCase().includes(metadata.focusKeyword.toLowerCase())
  const hasKeywordInMeta = metadata.metaDescription.toLowerCase().includes(metadata.focusKeyword.toLowerCase())

  // Basic scoring
  let contentScore = 50
  let technicalScore = 50
  let keywordScore = 50

  // Content scoring
  if (words >= 300) contentScore += 20
  if (words >= 800) contentScore += 10
  if (words > 2000) contentScore -= 5 // Too long

  // Technical scoring
  if (titleLength >= 30 && titleLength <= 60) technicalScore += 20
  if (metaLength >= 120 && metaLength <= 160) technicalScore += 20

  // Keyword scoring
  if (hasKeywordInTitle) keywordScore += 25
  if (hasKeywordInMeta) keywordScore += 25

  const overallScore = Math.round((contentScore + technicalScore + keywordScore) / 3)

  return {
    scores: {
      overall: overallScore,
      contentQuality: contentScore,
      keywordOptimization: keywordScore,
      technicalSEO: technicalScore,
      userExperience: 70 // Default score
    },
    metrics: {
      textMetrics: {
        wordCount: words,
        sentenceCount: content.split(/[.!?]+/).length,
        paragraphCount: content.split(/\n\s*\n/).length,
        averageSentenceLength: Math.round(words / content.split(/[.!?]+/).length)
      },
      readabilityScores: {
        fleschReadingEase: 60, // Mock score
        readingTimeMinutes: Math.ceil(words / 200)
      },
      keywordAnalysis: [{
        keyword: metadata.focusKeyword,
        frequency: (content.toLowerCase().match(new RegExp(metadata.focusKeyword.toLowerCase(), 'g')) || []).length,
        density: 0,
        tfIdfScore: 0.5,
        prominence: hasKeywordInTitle ? 80 : 40
      }],
      contentStructure: {
        headings: [],
        lists: 0,
        images: 0,
        links: { internal: 0, external: 0 }
      }
    },
    recommendations: generateBasicRecommendations(metadata, words, hasKeywordInTitle, hasKeywordInMeta)
  }
}

function generateBasicRecommendations(metadata: any, words: number, hasKeywordInTitle: boolean, hasKeywordInMeta: boolean) {
  const recommendations: any[] = []

  if (!hasKeywordInTitle) {
    recommendations.push({
      category: 'keyword',
      type: 'title',
      priority: 'high',
      title: 'Include focus keyword in title',
      description: 'Your title should include the focus keyword for better SEO.',
      suggestion: `Include "${metadata.focusKeyword}" in your title`,
      currentValue: 'Missing',
      targetValue: 'Present',
      impactScore: 85
    })
  }

  if (!hasKeywordInMeta) {
    recommendations.push({
      category: 'keyword',
      type: 'meta',
      priority: 'medium',
      title: 'Include focus keyword in meta description',
      description: 'Your meta description should include the focus keyword.',
      suggestion: `Include "${metadata.focusKeyword}" in your meta description`,
      currentValue: 'Missing',
      targetValue: 'Present',
      impactScore: 70
    })
  }

  if (words < 300) {
    recommendations.push({
      category: 'content',
      type: 'length',
      priority: 'high',
      title: 'Increase content length',
      description: 'Content should be at least 300 words for better SEO.',
      suggestion: 'Add more valuable content to reach at least 300 words',
      currentValue: words.toString(),
      targetValue: '300+',
      impactScore: 80
    })
  }

  return recommendations
} 