"use client"

// Updated to use real categories structure
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight, Clock, User } from "lucide-react"
import { getArticlesByCategory } from "@/lib/articles-simple"
import { categories, getCategoryPath } from "@/lib/categories"

// Convert categories to the format needed for dropdown
const categoryItems = categories.map(category => ({
  label: category.label,
  href: getCategoryPath(category.slug),
  category: category.label,
  slug: category.slug
}))

interface CategoryDropdownProps {
  className?: string
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ className = "" }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [categoryArticles, setCategoryArticles] = useState<Record<string, any[]>>({})

  const handleMouseEnter = async (category: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setActiveCategory(category)

    // Fetch articles for this category if not already loaded
    if (!categoryArticles[category]) {
      try {
        // Convert category display name to slug for database query
        const categorySlug = categories.find(cat => cat.label === category)?.slug
        if (categorySlug) {
          const result = await getArticlesByCategory(categorySlug, 3, 0)
          setCategoryArticles(prev => ({
            ...prev,
            [category]: result.articles || []
          }))
        }
      } catch (error) {
        console.error('Error fetching articles for category:', category, error)
        setCategoryArticles(prev => ({
          ...prev,
          [category]: []
        }))
      }
    }
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveCategory(null)
    }, 150) // Small delay to allow moving to dropdown
    setTimeoutId(timeout)
  }

  const handleDropdownEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }

  const handleDropdownLeave = () => {
    setActiveCategory(null)
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const getArticlesForCategory = (category: string) => {
    return categoryArticles[category] || []
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-10">
        {categoryItems.map((item, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.category)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-1 text-stone-950 text-sm font-medium font-['Inter'] leading-normal hover:text-orange-500 transition-colors duration-300 ${
                activeCategory === item.category ? 'text-orange-500' : ''
              }`}
            >
              {item.label}
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-300 ${
                  activeCategory === item.category ? 'rotate-180' : ''
                }`} 
              />
            </Link>

            {/* Dropdown */}
            {activeCategory === item.category && (
              <div
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Featured Articles */}
                    <div>
                      <h3 className="text-lg font-bold text-stone-950 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                        Latest Articles
                      </h3>
                      <div className="space-y-4">
                        {getArticlesForCategory(item.category).map((post) => (
                          <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group flex gap-3 p-4 rounded-xl hover:bg-[#D1F1EB] transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/20"
                          >
                            <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-500">
                              {post.image ? (
                                <Image
                                  src={post.image}
                                  alt={post.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500"
                                />
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-400 rounded bg-transparent"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-stone-950 line-clamp-2 group-hover:text-stone-900 transition-colors duration-500">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-2 text-xs text-stone-600 group-hover:text-stone-700 transition-colors duration-500">
                                <span className="flex items-center gap-1">
                                  <User size={12} />
                                  {post.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {post.readTime}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-orange-500 transition-colors duration-500 group"
                      >
                        View all articles
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-500" />
                      </Link>
                    </div>

                    {/* Subcategories */}
                    <div>
                      <h3 className="text-lg font-bold text-stone-950 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Browse Topics
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {categories.find(cat => cat.label === item.category)?.subcategories.map((subcat, subIndex) => {
                          console.log(`Rendering subcategory: ${subcat.label} for category: ${item.category}`)
                          const categorySlug = categories.find(cat => cat.label === item.category)!.slug
                          return (
                          <Link
                            key={subIndex}
                            href={`/blog/categories/${categorySlug}?filter=${subcat.slug}#toggle`}
                            className="group flex items-center justify-between p-4 rounded-xl hover:bg-[#FFF7ED] hover:shadow-md hover:shadow-orange-500/20 transition-all duration-500 hover:scale-[1.02]"
                          >
                            <span className="text-sm font-medium text-stone-700 group-hover:text-orange-600 transition-colors duration-500">
                              {subcat.label}
                            </span>
                            <ChevronRight 
                              size={16} 
                              className="text-stone-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-500" 
                            />
                          </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 