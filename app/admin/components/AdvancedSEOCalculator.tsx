'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Target, 
  FileText, 
  Hash, 
  Image, 
  Link2, 
  Eye, 
  Clock,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Zap,
  BarChart3,
  CheckSquare,
  AlertTriangle,
  Info
} from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'

interface SEOMetadata {
  title: string
  metaDescription: string
  slug: string
  focusKeyword: string
  secondaryKeywords?: string[]
  heroImageUrl?: string
  heroImageAlt?: string
}

interface SEOScores {
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

interface SEORecommendation {
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

interface TextMetrics {
  wordCount: number
  sentenceCount: number
  paragraphCount: number
  averageSentenceLength: number
}

interface ReadabilityScores {
  fleschReadingEase: number
  fleschKincaidGrade: number
  gunningFogIndex: number
  smogIndex: number
  readingTimeMinutes: number
  targetAudience: string
  recommendations: string[]
}

interface AdvancedSEOCalculatorProps {
  content: string
  metadata: SEOMetadata
  articleId?: string
  onScoreChange?: (score: number) => void
}

export default function AdvancedSEOCalculator({
  content,
  metadata,
  articleId,
  onScoreChange
}: AdvancedSEOCalculatorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scores, setScores] = useState<SEOScores | null>(null)
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>([])
  const [textMetrics, setTextMetrics] = useState<TextMetrics | null>(null)
  const [readabilityScores, setReadabilityScores] = useState<ReadabilityScores | null>(null)
  const [lastAnalyzedHash, setLastAnalyzedHash] = useState<string>('')
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [fromCache, setFromCache] = useState<boolean>(false)
  
  const { toast } = useToast()

  // Debounced analysis function
  const performAnalysis = useCallback(async (forceRefresh = false) => {
    if (!content || !metadata.title) return

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          metadata,
          articleId,
          cacheKey: forceRefresh ? 'force-refresh' : lastAnalyzedHash
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      setScores(data.scores)
      setRecommendations(data.recommendations || [])
      setTextMetrics(data.metrics?.textMetrics)
      setReadabilityScores(data.metrics?.readabilityScores)
      setLastAnalyzedHash(data.contentHash)
      setProcessingTime(data.processingTime)
      setFromCache(data.fromCache)
      
      if (onScoreChange) {
        onScoreChange(data.scores.overall)
      }

      if (!data.fromCache) {
        toast({
          title: 'SEO Analysis Complete',
          description: `Analysis completed in ${data.processingTime}ms`,
          variant: 'default'
        })
      }

    } catch (error) {
      console.error('SEO Analysis Error:', error)
      toast({
        title: 'Analysis Failed',
        description: 'Could not complete SEO analysis. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [content, metadata, articleId, lastAnalyzedHash, onScoreChange, toast])

  // Auto-analyze when content changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      performAnalysis()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer)
  }, [content, metadata.title, metadata.metaDescription, metadata.focusKeyword, metadata.slug])

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

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200'
    if (score >= 60) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'low': return <Info className="w-4 h-4 text-blue-600" />
      default: return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  if (isAnalyzing && !scores) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Analyzing your content...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className={`${scores ? getScoreBgColor(scores.overall) : 'bg-gray-100'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>SEO Score</CardTitle>
              {fromCache && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Cached
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => performAnalysis(true)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>
          <CardDescription>
            Advanced SEO analysis using industry-standard algorithms
            {processingTime > 0 && (
              <span className="ml-2 text-xs">
                • Analyzed in {processingTime}ms
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scores ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold">
                      <span className={getScoreColor(scores.overall)}>
                        {scores.overall}/100
                      </span>
                    </span>
                    {getScoreIcon(scores.overall)}
                  </div>
                  <Progress 
                    value={scores.overall} 
                    className="h-4"
                  />
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {scores.contentQuality}/35
                  </div>
                  <div className="text-sm text-gray-600">Content Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {scores.keywordOptimization}/30
                  </div>
                  <div className="text-sm text-gray-600">Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {scores.technicalSEO}/20
                  </div>
                  <div className="text-sm text-gray-600">Technical</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {scores.userExperience}/15
                  </div>
                  <div className="text-sm text-gray-600">User Experience</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Enter content and metadata to see SEO analysis
            </div>
          )}
        </CardContent>
      </Card>

      {scores && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Scores</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Length Score</span>
                    <span className={getScoreColor(scores.breakdown.contentLength)}>
                      {scores.breakdown.contentLength}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Readability</span>
                    <span className={getScoreColor(scores.breakdown.readability)}>
                      {scores.breakdown.readability}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Structure</span>
                    <span className={getScoreColor(scores.breakdown.contentStructure)}>
                      {scores.breakdown.contentStructure}/100
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Keyword Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Density</span>
                    <span className={getScoreColor(scores.breakdown.keywordDensity)}>
                      {scores.breakdown.keywordDensity}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distribution</span>
                    <span className={getScoreColor(scores.breakdown.keywordDistribution)}>
                      {scores.breakdown.keywordDistribution}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>LSI Keywords</span>
                    <span className={getScoreColor(scores.breakdown.lsiKeywords)}>
                      {scores.breakdown.lsiKeywords}/100
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Technical SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Title</span>
                    <span className={getScoreColor(scores.breakdown.titleOptimization)}>
                      {scores.breakdown.titleOptimization}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meta Description</span>
                    <span className={getScoreColor(scores.breakdown.metaDescriptionOptimization)}>
                      {scores.breakdown.metaDescriptionOptimization}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>URL Structure</span>
                    <span className={getScoreColor(scores.breakdown.urlStructure)}>
                      {scores.breakdown.urlStructure}/100
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    User Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Engagement</span>
                    <span className={getScoreColor(scores.breakdown.contentEngagement)}>
                      {scores.breakdown.contentEngagement}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visual Content</span>
                    <span className={getScoreColor(scores.breakdown.visualContent)}>
                      {scores.breakdown.visualContent}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scannability</span>
                    <span className={getScoreColor(scores.breakdown.contentScannability)}>
                      {scores.breakdown.contentScannability}/100
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Scores Tab */}
          <TabsContent value="detailed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complete Score Breakdown</CardTitle>
                <CardDescription>
                  All individual scoring components and their contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(scores.breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={value} className="w-32 h-2" />
                        <span className={`font-semibold ${getScoreColor(value)}`}>
                          {value}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Alert key={index} className={getPriorityColor(rec.priority)}>
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(rec.priority)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {rec.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Impact: {rec.impactScore}/10
                            </Badge>
                          </div>
                        </div>
                        <AlertDescription className="mb-2">
                          {rec.description}
                        </AlertDescription>
                        <div className="text-sm bg-white bg-opacity-50 p-2 rounded">
                          <strong>Suggestion:</strong> {rec.suggestion}
                        </div>
                        {rec.currentValue && rec.targetValue && (
                          <div className="text-xs mt-2 flex gap-4">
                            <span><strong>Current:</strong> {rec.currentValue}</span>
                            <span><strong>Target:</strong> {rec.targetValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Excellent SEO!</h3>
                  <p className="text-gray-600">
                    No major issues found. Your content is well-optimized for search engines.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Text Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Word Count</span>
                      <span className="font-semibold">{textMetrics.wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sentences</span>
                      <span className="font-semibold">{textMetrics.sentenceCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paragraphs</span>
                      <span className="font-semibold">{textMetrics.paragraphCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Sentence Length</span>
                      <span className="font-semibold">
                        {Math.round(textMetrics.averageSentenceLength)} words
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {readabilityScores && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Readability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Reading Ease</span>
                      <span className="font-semibold">
                        {Math.round(readabilityScores.fleschReadingEase)}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade Level</span>
                      <span className="font-semibold">
                        {Math.round(readabilityScores.fleschKincaidGrade)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reading Time</span>
                      <span className="font-semibold">
                        {readabilityScores.readingTimeMinutes} min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Audience</span>
                      <span className="font-semibold text-sm">
                        {readabilityScores.targetAudience}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 