import { Suspense } from 'react'
import { api } from '@/lib/api'
import BlogPageClient from './BlogPageClient'

export default async function BlogPage() {
  try {
    // Fetch published articles and categories from backend API
    const [articlesResponse, categoriesResponse] = await Promise.all([
      api.getArticles({ published: true, limit: 50 }),
      api.getCategories()
    ])

    const articles = articlesResponse.articles || []
    const categories = categoriesResponse.categories || []

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPageClient articles={articles} categories={categories} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error fetching blog data:', error)
    
    // Fallback to empty data with error message
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPageClient articles={[]} categories={[]} />
      </Suspense>
    )
  }
}
