import React from "react"
import CTASection from "@/components/CTASection/CTASection"
import Header from "@/components/Header"
import BlogShowcase from "@/components/BlogShowcase"
import BlogCarousel from "@/components/BlogCarousel/BlogCarousel"
import { getPublishedArticles, getFeaturedArticles, clearArticleCache } from "@/lib/articles-simple"

// Transform database articles to component format
function transformToShowcaseFormat(articles: any[]) {
  return articles.map(article => ({
    id: parseInt(article.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: article.title,
    summary: article.summary,
    category: article.category,
    readTime: article.readTime,
    image: article.image || "/placeholder.svg",
    slug: `/blog/${article.slug}`
  }))
}

function transformToCarouselFormat(articles: any[]) {
  return articles.map(article => ({
    id: parseInt(article.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: article.title,
    excerpt: article.summary,
    category: article.category,
    readTime: article.readTime,
    image: article.image || "/placeholder.svg",
    slug: `/blog/${article.slug}`,
    date: article.date
  }))
}

export default async function Home() {
  // Clear cache to ensure fresh data
  clearArticleCache()
  
  // Fetch data from database with better error handling
  const [featuredArticlesResult, latestArticlesResult] = await Promise.all([
    // Only get 3 most recent featured articles for top section
    getFeaturedArticles('main', 3).catch((error) => {
      console.log('No featured articles found:', error.message)
      return []
    }),
    // Get 12 most recent articles for the bottom section
    getPublishedArticles(12, 0).catch((error) => {
      console.log('No published articles found:', error.message)
      return { articles: [] }
    })
  ])

  // Transform data for components only if we have data
  // Top section: Up to 3 most recent featured articles
  const showcasePosts = featuredArticlesResult.length > 0 
    ? transformToShowcaseFormat(featuredArticlesResult)
    : []
  
  // Bottom section: Last 12 articles (all articles, not just featured)
  const carouselPosts = latestArticlesResult.articles && latestArticlesResult.articles.length > 0
    ? transformToCarouselFormat(latestArticlesResult.articles)
    : []

  console.log('🏠 Home page data:')
  console.log('Top featured articles (max 3):', featuredArticlesResult.length)
  console.log('Recent articles (max 12):', latestArticlesResult.articles?.length || 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <Header />
      <BlogShowcase posts={showcasePosts} />
      <div className="bg-gradient-to-r from-teal-50 to-emerald-100">
        <CTASection />
      </div>
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
        <BlogCarousel 
          title="Recent Articles"
          subtitle="Our latest insights, tips, and travel guides"
          theme="teal"
          autoplay={true}
          posts={carouselPosts}
        />
      </div>
    </main>
  )
}
