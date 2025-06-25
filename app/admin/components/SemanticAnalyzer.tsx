'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Wand2, 
  FileText,
  Eye,
  Code
} from 'lucide-react'

interface SemanticAnalysis {
  issues: SemanticIssue[]
  suggestions: SemanticSuggestion[]
  score: number
  fixedHtml?: string
  headingStructure: HeadingNode[]
}

interface SemanticIssue {
  type: string
  severity: 'error' | 'warning' | 'info'
  message: string
  element?: string
}

interface SemanticSuggestion {
  type: string
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

interface SemanticAnalyzerProps {
  content: string
  onContentChange?: (fixedContent: string) => void
}

export default function SemanticAnalyzer({ content, onContentChange }: SemanticAnalyzerProps) {
  const [analysis, setAnalysis] = useState<SemanticAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFixedContent, setShowFixedContent] = useState(false)

  const analyzeContent = async () => {
    if (!content || !content.trim()) {
      setAnalysis(null)
      return
    }

    setIsAnalyzing(true)
    try {
      // Import the semantic engine dynamically
      const { semanticEngine } = await import('@/lib/semantic-html-engine')
      const result = semanticEngine.analyzeHTML(content, {
        isArticleContent: true // This tells analyzer that title will be H1
      })
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing content:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applyFixes = () => {
    if (analysis?.fixedHtml && onContentChange) {
      onContentChange(analysis.fixedHtml)
      // Re-analyze after applying fixes
      setTimeout(analyzeContent, 100)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (score: number) => {
    if (score >= 85) return 'default'
    if (score >= 70) return 'secondary'
    return 'destructive'
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>
      case 'info':
        return <Badge variant="outline">Info</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Auto-analyze when content changes
  useEffect(() => {
    const timer = setTimeout(analyzeContent, 500)
    return () => clearTimeout(timer)
  }, [content])

  const renderHeadingStructure = (headings: HeadingNode[]) => {
    return (
      <div className="space-y-1">
        {headings.map((heading, index) => (
          <div 
            key={index}
            className="flex items-center gap-2"
            style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
          >
            <Badge variant="outline" className="text-xs">
              H{heading.level}
            </Badge>
            <span className="text-sm">{heading.text}</span>
            {heading.id && (
              <code className="text-xs bg-muted px-1 rounded">#{heading.id}</code>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Semantic HTML Analyzer
            </CardTitle>
            <CardDescription>
              Analyze and improve your content's semantic structure and accessibility. 
              Note: Your article title will be the H1 tag, so content should start with H2.
            </CardDescription>
          </div>
          <Button
            onClick={analyzeContent}
            disabled={isAnalyzing || !content?.trim()}
            size="sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isAnalyzing && (
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Analyzing semantic structure...</span>
          </div>
        )}

        {analysis && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Semantic Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </span>
                      <span className="text-lg text-muted-foreground">/100</span>
                    </div>
                    <Progress value={analysis.score} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Issues:</span>
                      <Badge variant={analysis.issues.length > 0 ? 'destructive' : 'default'}>
                        {analysis.issues.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Suggestions:</span>
                      <Badge variant="outline">{analysis.suggestions.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Headings:</span>
                      <Badge variant="outline">{analysis.headingStructure.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analysis.fixedHtml && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Auto-Fix Available
                    </CardTitle>
                    <CardDescription>
                      We can automatically fix some semantic issues in your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Button onClick={applyFixes} className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Apply Semantic Fixes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowFixedContent(!showFixedContent)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {showFixedContent ? 'Hide' : 'Preview'} Fixed HTML
                      </Button>
                    </div>
                    
                    {showFixedContent && (
                      <ScrollArea className="h-40 w-full rounded border bg-muted p-4">
                        <pre className="text-sm">
                          <code>{analysis.fixedHtml}</code>
                        </pre>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-3">
              {analysis.issues.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No semantic issues found! Your content structure looks great.
                  </AlertDescription>
                </Alert>
              ) : (
                analysis.issues.map((issue, index) => (
                  <Alert key={index} className="border-l-4" style={{
                    borderLeftColor: issue.severity === 'error' ? '#ef4444' : 
                                   issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'
                  }}>
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityBadge(issue.severity)}
                          {issue.element && (
                            <code className="text-xs bg-muted px-1 rounded">&lt;{issue.element}&gt;</code>
                          )}
                        </div>
                        <AlertDescription>{issue.message}</AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-3">
              {analysis.suggestions.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No suggestions available. Your content semantic structure is optimal!
                  </AlertDescription>
                </Alert>
              ) : (
                analysis.suggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{suggestion.description}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Badge variant="outline" className="mb-2">Before</Badge>
                        <ScrollArea className="h-20 w-full rounded border bg-muted p-2">
                          <code className="text-xs">{suggestion.before}</code>
                        </ScrollArea>
                      </div>
                      <div>
                        <Badge variant="default" className="mb-2">After</Badge>
                        <ScrollArea className="h-20 w-full rounded border bg-green-50 p-2">
                          <code className="text-xs">{suggestion.after}</code>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="structure" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Heading Structure
                  </CardTitle>
                  <CardDescription>
                    Visual representation of your content's heading hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.headingStructure.length === 0 ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No headings found in your content. Consider adding headings to improve structure and SEO.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="h-60 w-full">
                      {renderHeadingStructure(analysis.headingStructure)}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!analysis && !isAnalyzing && content?.trim() && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Click "Analyze" to check your content's semantic structure and get improvement suggestions.
            </AlertDescription>
          </Alert>
        )}

        {!content?.trim() && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Add some content to start analyzing its semantic structure.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 