"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getArticlesByCategory, clearArticleCache } from "@/lib/articles-simple"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import AirlineBlogGrid from "@/components/blog/AirlineBlogGrid"


// Helper function to fix tag field for AirlineBlogGrid expectations
function getTagFromArticle(article: any): "Reviews" | "News" | "Guides" | "Deals" {
  // If the article already has a tag from articles-simple.ts, convert it to match AirlineBlogGrid expectations
  if (article.tag) {
    const tag = article.tag
    if (["Reviews", "News", "Guides", "Deals"].includes(tag)) {
      return tag as "Reviews" | "News" | "Guides" | "Deals"
    }
    // Map "Trip Reports" to "Guides" for airlines category
    if (tag === "Trip Reports") {
      return "Guides"
    }
  }
  
  // Fallback: try to infer from title or summary keywords
  const content = ((article.title || '') + " " + (article.summary || '')).toLowerCase()
  
  // More specific keyword detection
  if (content.includes('review') || content.includes('experience') || content.includes('rating') || content.includes('tested')) {
    return "Reviews"
  }
  if (content.includes('news') || content.includes('announcement') || content.includes('breaking') || content.includes('update') || content.includes('launch')) {
    return "News"
  }
  if (content.includes('deal') || content.includes('offer') || content.includes('discount') || content.includes('promotion') || content.includes('sale') || content.includes('bonus')) {
    return "Deals"
  }
  
  // Default to Guides for educational/how-to content
  return "Guides"
}

// Component that uses useSearchParams - must be wrapped in Suspense
function AirlinesContent() {
  const searchParams = useSearchParams()
  const [airlinePosts, setAirlinePosts] = React.useState<any[]>([])
  
  // Get filter parameter from URL
  const filterParam = searchParams.get('filter')

  // Scroll to toggle section if filter parameter is present
  React.useEffect(() => {
    if (filterParam) {
      // Scroll to toggle section after a brief delay to allow page to load
      setTimeout(() => {
        const toggleElement = document.getElementById('toggle')
        if (toggleElement) {
          const elementPosition = toggleElement.offsetTop
          const offsetPosition = elementPosition - 100 // 100px higher than the element
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 500)
    }
  }, [filterParam])

  // Fetch posts for this category
  React.useEffect(() => {
    async function fetchPosts() {
      try {
        console.log('🔍 Loading airlines articles...')
        clearArticleCache() // Clear cache to ensure fresh data
        const result = await getArticlesByCategory('airlines-and-aviation', 50, 0)
        console.log('🔍 Raw result from getArticlesByCategory:', result)
        
        // The articles are already transformed by articles-simple.ts, just fix the tag field
        const posts = (result.articles || []).map(article => ({
          ...article,
          tag: getTagFromArticle(article), // Fix tag to match AirlineBlogGrid expectations
          author: article.author || 'MaxYourPoints Team',
          excerpt: article.summary || 'No summary available'
        }))
        
        console.log(`✅ Loaded ${posts.length} articles for Airlines & Aviation`)
        console.log('🔍 Posts with images:', posts.map(p => ({ title: p.title, image: p.image })))
        setAirlinePosts(posts)
      } catch (error) {
        console.error('❌ Error fetching airline posts:', error)
        setAirlinePosts([])
      }
    }
    fetchPosts()
  }, [])

  // Get featured posts (first 3)
  const featuredPosts = airlinePosts.slice(0, 3)

  console.log('🎯 Debug info:', {
    totalAirlinePosts: airlinePosts.length,
    filterParam,
    featuredPostsCount: featuredPosts.length
  })

  return (
    <main>
      <div className="bg-[#D1F1EB]">
        <CategoryHero
          title="Explore Airlines & Aviation"
          subtitle="Discover loyalty programs, elite strategies, and the future of flight with our in-depth aviation coverage."
          imageSrc="/images/frugal-flyer-37J8TymWXVA-unsplash.jpg"
          imageAlt="Business class seat before takeoff"
        />
      </div>
      <div className="bg-[#D1F1EB] py-12">
        <FeaturedPosts posts={featuredPosts} />
        <div className="my-8 rounded-2xl">
          <CTASection />
        </div>
        <AirlineBlogGrid posts={airlinePosts} initialFilter={filterParam} />
      </div>
    </main>
  )
}

// Main component with Suspense boundary
export default function AirlinesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AirlinesContent />
    </Suspense>
  )
} 