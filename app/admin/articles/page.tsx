'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Plus, Eye, Edit, Calendar, User, Star, Clock, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function ArticlesPage() {
  const [articlesData, setArticlesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getArticles({ published: false }) // Get all articles including drafts
      setArticlesData(response.articles || [])
    } catch (err: any) {
      console.error('Failed to fetch articles:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    try {
      await api.deleteArticle(id)
      await fetchArticles() // Refresh the list
    } catch (err: any) {
      console.error('Failed to delete article:', err)
      setError(`Failed to delete article: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // Calculate enhanced statistics
  const stats = {
    total: articlesData.length,
    published: articlesData.filter(a => a.status === 'published').length,
    draft: articlesData.filter(a => a.status === 'draft').length,
    scheduled: articlesData.filter(a => a.status === 'scheduled').length,
    featuredMain: articlesData.filter(a => a.featured_main).length,
    featuredCategory: articlesData.filter(a => a.featured_category).length,
  }

  const getStatusBadge = (status: string, publishedAt: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'scheduled':
        const isScheduled = new Date(publishedAt) > new Date()
        return isScheduled ? 
          <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge> :
          <Badge className="bg-orange-100 text-orange-800">Ready to Publish</Badge>
      case 'draft':
      default:
        return <Badge variant="secondary">Draft</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading articles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-2">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Articles
            </CardTitle>
            <FileText className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">All articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published
            </CardTitle>
            <Eye className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
            <p className="text-xs text-gray-600 mt-1">Live articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Drafts
            </CardTitle>
            <Edit className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
            <p className="text-xs text-gray-600 mt-1">Unpublished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Scheduled
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.scheduled}</div>
            <p className="text-xs text-gray-600 mt-1">Future posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured Main
            </CardTitle>
            <Star className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.featuredMain}</div>
            <p className="text-xs text-gray-600 mt-1">Homepage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured Category
            </CardTitle>
            <Star className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.featuredCategory}</div>
            <p className="text-xs text-gray-600 mt-1">Category pages</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            Manage and edit your blog content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articlesData.length > 0 ? (
            <div className="space-y-4">
              {articlesData.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <div className="flex space-x-2">
                        {getStatusBadge(article.status, article.published_at)}
                        {article.featured_main && (
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            <Star className="w-3 h-3 mr-1" />
                            Main
                          </Badge>
                        )}
                        {article.featured_category && (
                          <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                            <Star className="w-3 h-3 mr-1" />
                            Category
                          </Badge>
                        )}
                        {article.seo_score > 0 && (
                          <Badge 
                            variant="outline" 
                            className={`
                              ${article.seo_score >= 80 ? 'border-green-200 text-green-700' : 
                                article.seo_score >= 60 ? 'border-yellow-200 text-yellow-700' : 
                                'border-red-200 text-red-700'}
                            `}
                          >
                            SEO: {article.seo_score}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {article.status === 'scheduled' && article.published_at ? 
                            `Scheduled: ${new Date(article.published_at).toLocaleDateString()}` :
                            `Created: ${new Date(article.created_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      {article.categories?.name && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{article.categories.name}</span>
                        </div>
                      )}
                      {article.summary && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">•</span>
                          <span className="truncate max-w-xs">{article.summary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/articles/${article.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    {article.status === 'published' && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first blog post
              </p>
              <Button asChild>
                <Link href="/admin/articles/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Article
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 