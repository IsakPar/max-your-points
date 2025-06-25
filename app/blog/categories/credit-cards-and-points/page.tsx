"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getArticlesByCategory, clearArticleCache } from "@/lib/articles-simple"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import CreditCardBlogGrid from "@/components/blog/CreditCardBlogGrid"



// Helper function to fix tag field for CreditCardBlogGrid expectations
function getTagFromArticle(article: any): "Reviews" | "News" | "Guides" | "Deals" {
  // If the article already has a tag from articles-simple.ts, convert it to match CreditCardBlogGrid expectations
  if (article.tag) {
    const tag = article.tag
    if (["Reviews", "News", "Guides", "Deals"].includes(tag)) {
      return tag as "Reviews" | "News" | "Guides" | "Deals"
    }
    // Map "Trip Reports" to "Guides" for credit cards category
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
function CreditCardsContent() {
  const searchParams = useSearchParams()
  const [creditCardPosts, setCreditCardPosts] = React.useState<any[]>([])
  
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
        console.log('🔍 Loading credit cards articles...')
        clearArticleCache() // Clear cache to ensure fresh data
        const result = await getArticlesByCategory('credit-cards-and-points', 50, 0)
        console.log('🔍 Raw result from getArticlesByCategory:', result)
        
        // The articles are already transformed by articles-simple.ts, just fix the tag field
        const posts = (result.articles || []).map(article => ({
          ...article,
          tag: getTagFromArticle(article), // Fix tag to match CreditCardBlogGrid expectations
          author: article.author || 'MaxYourPoints Team',
          excerpt: article.summary || 'No summary available'
        }))
        
        console.log(`✅ Loaded ${posts.length} articles for Credit Cards & Points`)
        console.log('🔍 Posts with images:', posts.map(p => ({ title: p.title, image: p.image })))
        setCreditCardPosts(posts)
      } catch (error) {
        console.error('❌ Error fetching credit card posts:', error)
        setCreditCardPosts([])
      }
    }
    fetchPosts()
  }, [])

  // Get featured posts (first 3)
  const featuredPosts = creditCardPosts.slice(0, 3)

  console.log('🎯 Debug info:', {
    totalCreditCardPosts: creditCardPosts.length,
    filterParam,
    featuredPostsCount: featuredPosts.length
  })

  return (
    <main>
      <div className="bg-[#D1F1EB]">
        <CategoryHero
          title="Master Your Credit Card Rewards"
          subtitle="Discover how to maximize your credit card rewards and points, from choosing the right cards to strategic spending and redemption strategies."
          imageSrc="/images/cardmapr-nl-EjAkfNQb46k-unsplash.jpg"
          imageAlt="a series of different AMEX cards on a table"
        />
      </div>
      <div className="bg-[#D1F1EB] py-12">
        <FeaturedPosts posts={featuredPosts} />
        <div className="my-8 rounded-2xl">
          <CTASection />
        </div>
        <CreditCardBlogGrid posts={creditCardPosts} initialFilter={filterParam} />
      </div>
    </main>
  )
}

// Main component with Suspense boundary
export default function CreditCardsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreditCardsContent />
    </Suspense>
  )
} 