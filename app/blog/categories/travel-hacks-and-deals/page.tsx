"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getArticlesByCategory, clearArticleCache } from "@/lib/articles-simple"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import TravelHackBlogGrid from "@/components/blog/TravelHackBlogGrid"
import CTASection from "@/components/CTASection/CTASection"



// Helper function to fix tag field for TravelHackBlogGrid expectations
function getTagFromArticle(article: any): "News" | "Guides" | "Deals" | "Price Alerts" {
  // If the article already has a tag from articles-simple.ts, convert it to match TravelHackBlogGrid expectations
  if (article.tag) {
    const tag = article.tag
    if (["News", "Guides", "Deals"].includes(tag)) {
      return tag as "News" | "Guides" | "Deals" | "Price Alerts"
    }
    // Map other tags to appropriate travel hacks categories
    if (tag === "Reviews") {
      return "Guides" // Reviews become guides in travel hacks context
    }
    if (tag === "Trip Reports") {
      return "Guides" // Trip reports become guides
    }
  }
  
  // Fallback: try to infer from title or summary keywords
  const content = ((article.title || '') + " " + (article.summary || '')).toLowerCase()
  
  // More specific keyword detection
  if (content.includes('news') || content.includes('announcement') || content.includes('breaking') || content.includes('update') || content.includes('launch')) {
    return "News"
  }
  if (content.includes('deal') || content.includes('offer') || content.includes('discount') || content.includes('promotion') || content.includes('sale') || content.includes('bonus')) {
    return "Deals"
  }
  if (content.includes('alert') || content.includes('price drop') || content.includes('watch') || content.includes('monitor')) {
    return "Price Alerts"
  }
  
  // Default to Guides for educational/how-to content
  return "Guides"
}

// Component that uses useSearchParams - must be wrapped in Suspense
function TravelHacksContent() {
  const searchParams = useSearchParams()
  const [travelHackPosts, setTravelHackPosts] = React.useState<any[]>([])
  
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
        console.log('🔍 Loading travel hacks articles...')
        clearArticleCache() // Clear cache to ensure fresh data
        const result = await getArticlesByCategory('travel-hacks-and-deals', 50, 0)
        console.log('🔍 Raw result from getArticlesByCategory:', result)
        
        // The articles are already transformed by articles-simple.ts, just fix the tag field
        const posts = (result.articles || []).map(article => ({
          ...article,
          tag: getTagFromArticle(article), // Fix tag to match TravelHackBlogGrid expectations
          author: article.author || 'MaxYourPoints Team',
          excerpt: article.summary || 'No summary available'
        }))
        
        console.log(`✅ Loaded ${posts.length} articles for Travel Hacks & Deals`)
        console.log('🔍 Posts with images:', posts.map(p => ({ title: p.title, image: p.image })))
        setTravelHackPosts(posts)
      } catch (error) {
        console.error('❌ Error fetching travel hack posts:', error)
        setTravelHackPosts([])
      }
    }
    fetchPosts()
  }, [])

  // Get featured posts (first 3)
  const featuredPosts = travelHackPosts.slice(0, 3)

  console.log('🎯 Debug info:', {
    totalTravelHackPosts: travelHackPosts.length,
    filterParam,
    featuredPostsCount: featuredPosts.length
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#D1F1EB]">
        <CategoryHero
          title="Travel Hacks & Deals"
          subtitle="Insider tips and deals to maximize your travel experience"
          imageSrc="/images/marius-kriz-DH5eyHWPT50-unsplash.jpg"
          imageAlt="Palm tree and beach at Koh Samui"
        />
      </div>
      <div className="bg-[#D1F1EB] py-12">
        <FeaturedPosts posts={featuredPosts} />
        <div className="my-8 rounded-2xl">
          <CTASection />
        </div>
        <TravelHackBlogGrid posts={travelHackPosts} initialFilter={filterParam} />
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function TravelHacksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TravelHacksContent />
    </Suspense>
  )
} 