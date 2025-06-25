'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Removed Supabase - using backend API
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Upload, Calendar, Star, Settings, Tag, AlertCircle, Clock, Image as ImageIcon, Globe, Search } from 'lucide-react'
import Link from 'next/link'
import SimpleDynamicEditor from '@/components/ui/simple-dynamic-editor'
import ImageUpload from '../../components/ImageUpload'
import { useToast } from '@/components/ui/use-toast'

interface Category {
  id: string
  name: string
  description?: string
  slug: string
}

interface Subcategory {
  id: string
  name: string
  description?: string
  category_id: string
  slug: string
}

interface Article {
  id: string
  title: string
  slug: string
}

export default function NewArticlePageWordPressStyle() {
  const router = useRouter()
  const { toast } = useToast()
  // Using backend API instead of Supabase

  // Content state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  
  // Publication state
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [publishDate, setPublishDate] = useState('')
  const [publishTime, setPublishTime] = useState('')
  
  // Categorization
  const [categoryId, setCategoryId] = useState('')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  // Media
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('')
  
  // Author & metadata
  const [authorName, setAuthorName] = useState('Max Your Points Team')
  const [readingTime, setReadingTime] = useState(1)
  
  // SEO
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [slug, setSlug] = useState('')
  
  // Features
  const [featured, setFeatured] = useState(false)
  const [trendingScore, setTrendingScore] = useState(0)
  
  // Related articles
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState<string[]>([])
  
  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Replace with actual backend API calls
        console.log('Loading data from backend API...')
        setCategories([])
        setSubcategories([])
        setArticles([])
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setSlug(autoSlug)
    }
  }, [title, slug])

  // Calculate reading time
  useEffect(() => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const time = Math.max(1, Math.ceil(wordCount / 200))
    setReadingTime(time)
  }, [content])

  // Auto-generate meta description from summary
  useEffect(() => {
    if (summary && !metaDescription) {
      setMetaDescription(summary.slice(0, 160))
    }
  }, [summary, metaDescription])

  const filteredSubcategories = subcategories.filter(sub => sub.category_id === categoryId)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Preview functionality
  const handlePreview = () => {
    // Create a preview object with current form data
    const previewData = {
      title: title || 'Untitled Article',
      summary: summary || 'No summary provided',
      content: content || '<p>No content yet</p>',
      hero_image_url: heroImageUrl || null,
      hero_image_alt: heroImageAlt || null,
      category: categories.find(c => c.id === categoryId)?.name || 'Uncategorized',
      tags: tags,
      author: authorName || 'Max Your Points Team',
      date: new Date().toLocaleDateString(),
      readTime: readingTime + ' min read'
    }
    
    console.log('🔍 Preview data:', previewData)
    
    // Store preview data in sessionStorage
    sessionStorage.setItem('articlePreview', JSON.stringify(previewData))
    
    // Open preview in new tab
    window.open('/admin/articles/preview', '_blank')
  }

  const handleSave = async (saveStatus: 'draft' | 'published' | 'scheduled') => {
    setIsSaving(true)
    setError('')

    try {
      // Validation
      const errors = []
      if (!title.trim()) errors.push('Title')
      if (!summary.trim()) errors.push('Summary')
      if (!content.trim()) errors.push('Content')
      if (!categoryId) errors.push('Category')
      if (!heroImageUrl.trim()) errors.push('Hero Image')
      if (!heroImageAlt.trim()) errors.push('Hero Image Alt Text')

      if (saveStatus === 'published') {
        if (!metaDescription.trim()) errors.push('Meta Description')
        if (!focusKeyword.trim()) errors.push('Focus Keyword')
      }

      if (errors.length > 0) {
        const errorMessage = `The following fields are required: ${errors.join(', ')}`
        toast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive'
        })
        throw new Error(errorMessage)
      }

      let finalPublishDate = new Date()
      if (saveStatus === 'scheduled' && publishDate && publishTime) {
        finalPublishDate = new Date(`${publishDate}T${publishTime}:00`)
        if (finalPublishDate <= new Date()) {
          throw new Error('Scheduled date must be in the future')
        }
      } else if (saveStatus === 'published') {
        finalPublishDate = new Date()
      }

      // Save article
      const articleData = {
        title: title.trim(),
        slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        summary: summary.trim(),
        content: content.trim(),
        status: saveStatus,
        publish_date: finalPublishDate.toISOString(),
        category_id: categoryId,
        hero_image_url: heroImageUrl.trim(),
        hero_image_alt: heroImageAlt.trim(),
        meta_description: metaDescription.trim(),
        focus_keyword: focusKeyword.trim(),
        author_name: authorName.trim(),
        reading_time: readingTime,
        featured,
        trending_score: trendingScore,
        tags: tags.length > 0 ? tags : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // TODO: Replace with backend API call
      console.log('Saving article to backend:', articleData)
      
      // Mock successful response for now
      const articleResult = { id: 'mock-id-' + Date.now() }
      const articleError = null

      if (articleError) throw articleError

      const articleId = articleResult.id

      // Save subcategories
      if (selectedSubcategories.length > 0) {
        // TODO: Replace with backend API call
        console.log('Saving subcategories to backend:', selectedSubcategories)
      }

      // Save related articles
      if (selectedRelatedArticles.length > 0) {
        // TODO: Replace with backend API call
        console.log('Saving related articles to backend:', selectedRelatedArticles)
      }

      const statusMessages = {
        draft: 'Article saved as draft',
        published: 'Article published successfully!',
        scheduled: `Article scheduled for ${finalPublishDate.toLocaleDateString()}`
      }

      toast({
        title: 'Success',
        description: statusMessages[saveStatus],
        variant: 'default'
      })

      router.push('/admin/articles')

    } catch (err: any) {
      console.error('Article save error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: `Failed to save article: ${errorMessage}`,
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* WordPress-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/articles">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Articles
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">Add New Article</h1>
              {title && (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500 truncate max-w-xs">{title}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!title || !content}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add title"
                className="text-2xl font-bold border-none shadow-none p-0 h-auto placeholder:text-gray-400 focus:ring-0"
                style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
              />
            </div>

            {/* Permalink */}
            {slug && (
              <div className="flex items-center text-sm text-gray-500">
                <Globe className="w-4 h-4 mr-1" />
                <span>Permalink: </span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="ml-2 text-blue-600 border-none shadow-none p-0 h-auto focus:ring-0 bg-transparent"
                />
              </div>
            )}

            {/* Main Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <SimpleDynamicEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your article..."
                className="min-h-[600px] border-none"
              />
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
                <CardDescription>
                  Brief description that appears in article previews and search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a compelling summary of your article..."
                  rows={3}
                  maxLength={200}
                  className="resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{summary.length}/200 characters</span>
                  <span className="text-xs text-gray-400">Used for previews and meta description</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Publish Box */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Publish</CardTitle>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={status} onValueChange={(value: 'draft' | 'published' | 'scheduled') => setStatus(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm">Date</Label>
                      <Input
                        type="date"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Time</Label>
                      <Input
                        type="time"
                        value={publishTime}
                        onChange={(e) => setPublishTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Featured Article</Label>
                  <Switch
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>

                <div className="pt-3 border-t">
                  <Button
                    onClick={() => handleSave(status)}
                    disabled={isSaving}
                    className="w-full"
                    size="sm"
                  >
                    {isSaving ? 'Saving...' : status === 'draft' ? 'Save Draft' : status === 'scheduled' ? 'Schedule' : 'Publish'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Primary Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose category" />
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

                {filteredSubcategories.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Subcategories</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {filteredSubcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`sub-${subcategory.id}`}
                            checked={selectedSubcategories.includes(subcategory.id)}
                            onChange={() => {
                              if (selectedSubcategories.includes(subcategory.id)) {
                                setSelectedSubcategories(selectedSubcategories.filter(id => id !== subcategory.id))
                              } else if (selectedSubcategories.length < 4) {
                                setSelectedSubcategories([...selectedSubcategories, subcategory.id])
                              }
                            }}
                            disabled={!selectedSubcategories.includes(subcategory.id) && selectedSubcategories.length >= 4}
                            className="rounded"
                          />
                          <Label 
                            htmlFor={`sub-${subcategory.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {subcategory.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add new tag"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-red-100"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={heroImageUrl}
                  onChange={setHeroImageUrl}
                  onAltChange={setHeroImageAlt}
                  altValue={heroImageAlt}
                  label=""
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                />
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Focus Keyword</Label>
                  <Input
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Main keyword to rank for"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Meta Description</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Description for search engines"
                    className="mt-1"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
} 