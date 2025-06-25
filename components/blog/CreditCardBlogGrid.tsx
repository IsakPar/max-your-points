"use client"

import * as React from "react"
import { type BlogPost } from "@/lib/posts"

interface CreditCardBlogGridProps {
  posts: BlogPost[]
  initialFilter?: string | null
}

type FilterType = "Reviews" | "News" | "Guides" | "Deals" | null

export default function CreditCardBlogGrid({ posts, initialFilter }: CreditCardBlogGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(null)
  
  // Set initial filter when component mounts or initialFilter changes
  React.useEffect(() => {
    if (initialFilter) {
      const capitalizedFilter = initialFilter.charAt(0).toUpperCase() + initialFilter.slice(1)
      if (["Reviews", "News", "Guides", "Deals"].includes(capitalizedFilter)) {
        setActiveFilter(capitalizedFilter as FilterType)
      }
    }
  }, [initialFilter])

  const filters: FilterType[] = ["Reviews", "News", "Deals", "Guides"]

  const filteredPosts = React.useMemo(() => {
    if (!activeFilter) return posts
    return posts.filter(post => post.tag === activeFilter)
  }, [posts, activeFilter])

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(current => current === filter ? null : filter)
  }

  return (
    <div className="w-full py-12 bg-teal-50">
      {/* Toggle Menu */}
      <div id="toggle" className="flex justify-center mb-12">
        <div className="relative inline-flex rounded-2xl border border-stone-200 p-1.5 bg-white shadow-sm">
          {/* Sliding highlight for active button */}
          <div 
            className="absolute inset-0 pointer-events-none flex"
            style={{
              background: "linear-gradient(to right, #2DD4BF, #0EA5E9, #0284C7)",
              opacity: 0.1,
              borderRadius: "1rem"
            }}
          />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`relative px-6 py-2 mx-0.5 text-sm font-medium rounded-xl transition-all duration-200
                ${activeFilter === filter 
                  ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-md' 
                  : 'text-stone-600 hover:text-sky-600 hover:bg-sky-100/90 hover:scale-105 hover:shadow-sm'
                }`}
              style={{ zIndex: 1 }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {filteredPosts.map((post) => (
          <article 
            key={post.id}
            className="bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.05] hover:bg-[#D1F1EB] hover:-translate-y-2 cursor-pointer border border-transparent hover:border-teal-200 group"
            role="button"
            aria-label={`Read article: ${post.title}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                window.location.href = `/blog/${post.slug}`
              }
            }}
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            {/* Image Placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg transform rotate-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:brightness-110">
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                    <div className="w-10 h-5 rounded bg-white/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-28 h-3 rounded bg-white/20" />
                    <div className="w-20 h-3 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-gray-200 text-gray-700 group-hover:bg-teal-600 group-hover:text-white rounded-full text-sm font-medium transition-colors duration-500">
                  {post.tag}
                </span>
                <span className="text-stone-800 text-sm font-bold group-hover:text-stone-900 transition-colors duration-500">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 line-clamp-2 text-stone-950 group-hover:text-stone-900 group-hover:scale-105 transition-all duration-500 transform-gpu">
                {post.title}
              </h2>
              <p className="text-stone-950 text-sm mb-4 line-clamp-2 group-hover:text-stone-800 transition-colors duration-500">
                {post.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-800 group-hover:text-stone-900 transition-colors duration-500">{post.author}</span>
                <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors duration-500">{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 