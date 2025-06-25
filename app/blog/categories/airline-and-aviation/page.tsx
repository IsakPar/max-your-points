import * as React from "react"
import { getArticlesByCategory, getFeaturedArticlesByCategory } from "@/lib/articles-simple"
import CTASection from "@/components/CTASection/CTASection"
import Image from "next/image"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import AirlineBlogGrid from "@/components/blog/AirlineBlogGrid"

// Transform database articles to component format
function transformToPostFormat(articles: any[]) {
  return articles.map(article => ({
    id: article.id, // Keep as string UUID
    title: article.title,
    summary: article.summary,
    category: article.category,
    readTime: article.readTime,
    image: article.image || "/placeholder.svg",
    slug: `/blog/${article.slug}`,
    date: article.date,
    author: article.author,
    excerpt: article.summary,
    tag: article.category // Add tag property for compatibility
  }))
}

export default async function AirlineAndAviationPage() {
  // Fetch featured articles for this category (max 3)
  const featuredArticlesResult = await getFeaturedArticlesByCategory('airlines-and-aviation').catch(() => [])
  const featuredPosts = transformToPostFormat(featuredArticlesResult)

  // Fetch recent articles for the grid (excluding featured ones to avoid duplicates)
  const result = await getArticlesByCategory('airlines-and-aviation', 24, 0).catch(() => ({ articles: [] }))
  const allPosts = transformToPostFormat(result.articles || [])
  
  // Remove featured articles from the grid to avoid duplicates
  const featuredIds = new Set(featuredPosts.map(post => post.id))
  const gridPosts = allPosts.filter(post => !featuredIds.has(post.id))

  console.log('✈️ Airline & Aviation page:')
  console.log(`🌟 Featured articles (max 3): ${featuredPosts.length}`)
  console.log(`📄 Grid articles: ${gridPosts.length}`)

  return (
    <main>
      <CategoryHero
        title="Airlines & Aviation"
        subtitle="Discover loyalty programs, elite strategies, and the future of flight with our in-depth aviation coverage."
        imageSrc="/images/frugal-flyer-37J8TymWXVA-unsplash.jpg"
        imageAlt="Business class seat before takeoff"
      />
      <FeaturedPosts posts={featuredPosts} />
      <AirlineBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 