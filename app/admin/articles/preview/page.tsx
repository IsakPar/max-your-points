'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Clock, User } from 'lucide-react'
import Link from 'next/link'

interface PreviewData {
  title: string
  summary: string
  content: string
  hero_image_url: string | null
  hero_image_alt: string | null
  category: string
  tags: string[]
  author: string
  date: string
  readTime: string
}

export default function ArticlePreviewPage() {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedData = sessionStorage.getItem('articlePreview')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setPreviewData(data)
      } catch (error) {
        console.error('Error parsing preview data:', error)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading preview...</div>
        </div>
      </div>
    )
  }

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">No Preview Data</h1>
              <p className="text-gray-600 mb-6">
                No article data found for preview. Please go back and try again.
              </p>
              <Button asChild>
                <Link href="/admin/articles/new">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-blue-600 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Eye className="w-5 h-5" />
            <span className="font-medium">Article Preview</span>
          </div>
          <Button 
            variant="outline" 
            className="text-blue-600 border-white bg-white hover:bg-gray-100"
            onClick={() => window.close()}
          >
            Close Preview
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {previewData.hero_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={previewData.hero_image_url}
                alt={previewData.hero_image_alt || previewData.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                {previewData.category}
              </Badge>
              {previewData.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {previewData.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {previewData.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{previewData.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{previewData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{previewData.readTime}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: previewData.content }}
              className="text-gray-800 leading-relaxed article-content"
            />
          </div>

          {/* Professional typography styles */}
          <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
            
            :global(.article-content) {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1 !important;
              text-rendering: optimizeLegibility !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            
            :global(.article-content h1) {
              font-family: 'Merriweather', Georgia, serif !important;
              font-size: 2.5rem !important;
              font-weight: 700 !important;
              line-height: 1.2 !important;
              margin: 2rem 0 1.25rem 0 !important;
              color: #111827 !important;
              letter-spacing: -0.025em !important;
            }
            
            :global(.article-content h2) {
              font-family: 'Merriweather', Georgia, serif !important;
              font-size: 2rem !important;
              font-weight: 700 !important;
              line-height: 1.25 !important;
              margin: 1.75rem 0 1rem 0 !important;
              color: #1f2937 !important;
              letter-spacing: -0.02em !important;
            }
            
            :global(.article-content h3) {
              font-family: 'Inter', sans-serif !important;
              font-size: 1.5rem !important;
              font-weight: 600 !important;
              line-height: 1.3 !important;
              margin: 1.5rem 0 0.75rem 0 !important;
              color: #374151 !important;
              letter-spacing: -0.015em !important;
            }
            
            :global(.article-content h4) {
              font-family: 'Inter', sans-serif !important;
              font-size: 1.25rem !important;
              font-weight: 600 !important;
              line-height: 1.35 !important;
              margin: 1.25rem 0 0.5rem 0 !important;
              color: #4b5563 !important;
              letter-spacing: -0.01em !important;
            }
            
            :global(.article-content p) {
              font-family: 'Inter', sans-serif !important;
              font-size: 1.125rem !important;
              font-weight: 400 !important;
              line-height: 1.75 !important;
              margin: 1rem 0 !important;
              color: #374151 !important;
              min-height: 1.75rem !important;
              letter-spacing: -0.005em !important;
            }
            
            :global(.article-content p:empty) {
              margin: 1rem 0 !important;
              min-height: 1.75rem !important;
            }
            
            :global(.article-content br) {
              display: block !important;
              margin: 0.75rem 0 !important;
              content: "" !important;
            }
            
            :global(.article-content .line-break) {
              display: block !important;
              margin: 0.75rem 0 !important;
            }
            
            :global(.article-content ul, .article-content ol) {
              font-family: 'Inter', sans-serif !important;
              font-size: 1.125rem !important;
              line-height: 1.7 !important;
              margin: 1.25rem 0 !important;
              padding-left: 1.75rem !important;
              color: #374151 !important;
            }
            
            :global(.article-content li) {
              margin: 0.5rem 0 !important;
              line-height: 1.7 !important;
            }
            
            :global(.article-content blockquote) {
              font-family: 'Merriweather', Georgia, serif !important;
              font-size: 1.25rem !important;
              font-style: italic !important;
              font-weight: 400 !important;
              line-height: 1.6 !important;
              border-left: 4px solid #6366f1 !important;
              padding: 1.5rem 2rem !important;
              margin: 2rem 0 !important;
              color: #4b5563 !important;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
              border-radius: 0.75rem !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
            }
            
            :global(.article-content img) {
              margin: 2rem 0 !important;
              border-radius: 0.75rem !important;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
              max-width: 100% !important;
              height: auto !important;
            }
            
            :global(.article-content figure.image-with-caption) {
              margin: 2rem 0 !important;
              text-align: center !important;
            }
            
            :global(.article-content figure.image-with-caption img) {
              margin: 0 !important;
              border-radius: 0.75rem !important;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
              max-width: 100% !important;
              height: auto !important;
            }
            
            :global(.article-content figcaption) {
              font-family: 'Inter', sans-serif !important;
              font-size: 0.875rem !important;
              font-style: italic !important;
              color: #6b7280 !important;
              margin-top: 0.75rem !important;
              line-height: 1.5 !important;
              text-align: center !important;
            }
            
            :global(.article-content strong) {
              font-weight: 600 !important;
              color: #1f2937 !important;
            }
            
            :global(.article-content em) {
              font-style: italic !important;
              color: #4b5563 !important;
            }
            
            :global(.article-content a) {
              color: #6366f1 !important;
              text-decoration: none !important;
              font-weight: 500 !important;
              border-bottom: 2px solid transparent !important;
              transition: all 0.2s ease !important;
            }
            
            :global(.article-content a:hover) {
              color: #4f46e5 !important;
              border-bottom-color: #6366f1 !important;
            }
            
            :global(.article-content code) {
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
              font-size: 0.9em !important;
              background-color: #f1f5f9 !important;
              color: #475569 !important;
              padding: 0.25rem 0.5rem !important;
              border-radius: 0.375rem !important;
              border: 1px solid #e2e8f0 !important;
            }
            
            :global(.article-content pre) {
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
              background-color: #1e293b !important;
              color: #f1f5f9 !important;
              padding: 1.5rem !important;
              border-radius: 0.75rem !important;
              margin: 1.5rem 0 !important;
              overflow-x: auto !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* First paragraph after headings */
            :global(.article-content h1 + p, .article-content h2 + p, .article-content h3 + p) {
              margin-top: 0.75rem !important;
            }
            
            /* Lead paragraph styling for first paragraph */
            :global(.article-content > p:first-of-type) {
              font-size: 1.25rem !important;
              font-weight: 400 !important;
              color: #4b5563 !important;
              line-height: 1.6 !important;
            }
          `}</style>

          {/* Preview Notice */}
          <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Preview Mode</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a preview of how your article will appear when published. 
                  Some features like comments and social sharing are not available in preview mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
} 