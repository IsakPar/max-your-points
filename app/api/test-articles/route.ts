import { NextRequest, NextResponse } from 'next/server'
import { 
  getPublishedArticles,
  getArticleBySlug,
  getFeaturedArticles,
  getCategories
} from '@/lib/articles-simple'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const test = searchParams.get('test') || 'all'

    let results: any = {}

    if (test === 'all' || test === 'published') {
      const publishedArticles = await getPublishedArticles(5, 0)
      results.publishedArticles = publishedArticles
    }

    if (test === 'all' || test === 'slug') {
      const singleArticle = await getArticleBySlug('test-best-airline-credit-cards-2025')
      results.singleArticle = singleArticle
    }

    if (test === 'all' || test === 'featured') {
      const featuredMain = await getFeaturedArticles('main', 3)
      const featuredCategory = await getFeaturedArticles('category', 3)
      results.featured = {
        main: featuredMain,
        category: featuredCategory
      }
    }

    if (test === 'all' || test === 'categories') {
      const categories = await getCategories()
      results.categories = categories
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      test,
      results
    })
  } catch (error) {
    console.error('Articles test API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 