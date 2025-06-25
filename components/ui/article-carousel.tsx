'use client'

import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  image?: string
  readTime?: string
  category?: string
  date?: string
}

interface ArticleCarouselProps {
  articles: Article[]
  title?: string
}

export function ArticleCarousel({ articles, title = "See Other Articles" }: ArticleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      checkScrollButtons()
      
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email || !email.includes("@") || !email.includes(".")) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setEmail("")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-teal-50 -mx-6 px-6 py-16 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Articles Carousel Section - only show if there are articles */}
        {articles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-950">
                {title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="flex-none w-80 group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                    {article.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {article.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full mb-3">
                          {article.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {article.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{article.readTime}</span>
                          </div>
                        )}
                        {article.date && (
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter CTA - using the same design as CTASection */}
        <section>
          <div className="p-6 md:p-12 bg-gradient-to-br from-teal-500/10 to-emerald-500/20 backdrop-blur-sm rounded-xl flex flex-col justify-between items-center overflow-hidden shadow-lg border border-white/20">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-4">
                <h2 className="self-stretch text-stone-900 text-2xl md:text-4xl font-bold leading-tight">
                  {articles.length > 0 ? "Stay Updated with Max Your Points" : "Stay Updated with Our Insights"}
                </h2>
                <p className="self-stretch text-stone-700 text-base md:text-lg font-medium leading-relaxed">
                  Subscribe to our newsletter for exclusive travel tips and the latest updates in travel rewards.
                </p>
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                  <div className="flex flex-col gap-4">
                    {/* Status messages */}
                    {submitStatus === "success" && (
                      <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <div className="w-4 h-4 text-emerald-600">✓</div>
                        Thanks for subscribing! Check your email for confirmation.
                      </div>
                    )}
                    
                    {submitStatus === "error" && (
                      <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <div className="w-4 h-4 text-red-600">⚠</div>
                        Please enter a valid email address.
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="bg-white/80 border-teal-200 text-stone-900 placeholder-gray-500 focus:border-teal-400 flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors"
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl shadow-md text-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-500 ease-in-out"
                        style={{
                          background: "linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
                          backgroundSize: "200% 100%",
                          backgroundPosition: "0% 50%",
                          transition: "background-position 0.5s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundPosition = "100% 50%"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundPosition = "0% 50%"
                        }}
                      >
                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                      </button>
                    </div>

                    <div className="text-xs text-stone-600 text-center md:text-right">
                      <span className="font-medium">Join 10,000+ travelers</span> • Unsubscribe anytime
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 