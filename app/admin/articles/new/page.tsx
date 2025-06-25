'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Eye, AlertCircle, Loader2 } from 'lucide-react'
import BlockEditor from '@/components/ui/block-editor'
import ImageUpload from '@/app/admin/components/ImageUpload'
import AdvancedSEOCalculator from '@/app/admin/components/AdvancedSEOCalculator'
import SemanticAnalyzer from '@/app/admin/components/SemanticAnalyzer'

interface ArticleFormData {
  title: string
  slug: string
  summary: string
  content: string
  hero_image_url: string
  hero_image_alt: string
  category_id: string
  status: 'draft' | 'published' | 'scheduled'
  published_at: string
  featured_main: boolean
  featured_category: boolean
  meta_description: string
  focus_keyword: string
  tags: string[]
}

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [seoScore, setSeoScore] = useState<number>(0)
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    hero_image_url: '',
    hero_image_alt: '',
    category_id: '',
    status: 'draft',
    published_at: '',
    featured_main: false,
    featured_category: false,
    meta_description: '',
    focus_keyword: '',
    tags: []
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug === generateSlug(prev.title) ? generateSlug(value) : prev.slug
    }))
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData(prev => ({ ...prev, tags }))
  }

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories()
      setCategories(response.categories || [])
    } catch (err: any) {
      console.error('Failed to fetch categories:', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (status: 'draft' | 'published') => {
    try {
      setLoading(true)
      setError(null)

      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required')
      }
      if (!formData.summary.trim()) {
        throw new Error('Summary is required')
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required')
      }
      if (!formData.category_id) {
        throw new Error('Category is required')
      }

      const articleData = {
        ...formData,
        status,
        published_at: status === 'published' ? new Date().toISOString() : formData.published_at || null
      }

      const result = await api.createArticle(articleData)
      
      console.log('✅ Article created:', result)
      router.push('/admin/articles')
      
    } catch (err: any) {
      console.error('Failed to create article:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const seoMetadata = {
    title: formData.title,
    metaDescription: formData.meta_description,
    slug: formData.slug,
    focusKeyword: formData.focus_keyword,
    secondaryKeywords: formData.tags,
    heroImageUrl: formData.hero_image_url,
    heroImageAlt: formData.hero_image_alt
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/articles" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
              <p className="text-gray-600 mt-1">
                Write and publish your content with advanced SEO optimization
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('draft')}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSubmit('published')}
              disabled={loading || !formData.title || !formData.content}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>
                  Basic information about your article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-url-slug"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the title (only lowercase letters, numbers, and hyphens)
                  </p>
                </div>

                <div>
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Brief description of the article..."
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.summary.length}/500 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Hero Image */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
                <CardDescription>
                  Main image for your article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.hero_image_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url }))}
                  onAltChange={(alt) => setFormData(prev => ({ ...prev, hero_image_alt: alt }))}
                  altValue={formData.hero_image_alt}
                  showMetadataFields={true}
                  category="article"
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
                <CardDescription>
                  Write your article using the block editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlockEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Start writing your article..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured-main">Featured on Homepage</Label>
                  <Switch
                    id="featured-main"
                    checked={formData.featured_main}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured_main: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured-category">Featured in Category</Label>
                  <Switch
                    id="featured-category"
                    checked={formData.featured_category}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured_category: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization</CardTitle>
                <CardDescription>
                  Optimize your article for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Brief description for search engines..."
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="focus-keyword">Focus Keyword</Label>
                  <Input
                    id="focus-keyword"
                    value={formData.focus_keyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, focus_keyword: e.target.value }))}
                    placeholder="Primary keyword to optimize for..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated keywords
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO Analysis */}
            <Tabs defaultValue="seo" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="seo">SEO Score</TabsTrigger>
                <TabsTrigger value="semantic">Semantic</TabsTrigger>
              </TabsList>
              
              <TabsContent value="seo" className="space-y-4">
                <AdvancedSEOCalculator
                  content={formData.content}
                  metadata={seoMetadata}
                  onScoreChange={setSeoScore}
                />
              </TabsContent>
              
              <TabsContent value="semantic" className="space-y-4">
                <SemanticAnalyzer
                  content={formData.content}
                  onContentChange={(fixedContent) => 
                    setFormData(prev => ({ ...prev, content: fixedContent }))
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 