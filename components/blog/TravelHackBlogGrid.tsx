"use client"

import * as React from "react"
import { type BlogPost } from "@/lib/posts"

interface TravelHackBlogGridProps {
  posts: BlogPost[]
  initialFilter?: string | null
}

type FilterType = "News" | "Guides" | "Deals" | "Price Alerts" | null

export default function TravelHackBlogGrid({ posts, initialFilter }: TravelHackBlogGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(null)
  
  // Set initial filter when component mounts or initialFilter changes
  React.useEffect(() => {
    if (initialFilter) {
      const capitalizedFilter = initialFilter.charAt(0).toUpperCase() + initialFilter.slice(1)
      if (["News", "Guides", "Deals", "Price Alerts"].includes(capitalizedFilter)) {
        setActiveFilter(capitalizedFilter as FilterType)
      }
    }
  }, [initialFilter])

  const filters: FilterType[] = ["News", "Guides", "Deals", "Price Alerts"]

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
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border hover:border-sky-100"
          >
            {/* Image Placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg transform rotate-3">
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
                <span className="px-3 py-1 bg-teal-50 text-stone-900 rounded-full text-sm font-medium">
                  {post.tag}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-sky-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{post.author}</span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 