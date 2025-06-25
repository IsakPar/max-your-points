"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  readTime: string
  image: string
  slug: string
  date: string
}

interface PostsPerView {
  mobile: number
  tablet: number
  desktop: number
}

interface OutlinedGradientButtonProps {
  href?: string
  children: React.ReactNode
}

interface BlogCarouselProps {
  title?: string
  subtitle?: string
  posts?: BlogPost[]
  postsPerView?: PostsPerView
  className?: string
  autoplay?: boolean
  autoplayDelay?: number
  theme?: 'light' | 'teal'
}

const OutlinedGradientButton = ({ href, children }: OutlinedGradientButtonProps) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl text-stone-950 hover:text-orange-500"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

// Use a custom hook for responsive breakpoints with debouncing
const useResponsiveBreakpoints = () => {
  const [breakpoints, setBreakpoints] = useState({
    isMobile: false,
    isTablet: false,
  })

  useEffect(() => {
    // Debounce resize handler to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout
    
    const updateBreakpoints = () => {
      const width = window.innerWidth
      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
      })
    }

    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateBreakpoints, 150)
    }

    // Initial check
    updateBreakpoints()

    // Use passive listener for better performance
    window.addEventListener("resize", debouncedResize, { passive: true })
    
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return breakpoints
}

const BlogCarousel = ({
  title = "Latest from Our Blog",
  subtitle = "Discover our most recent insights and travel tips",
  posts = [],
  postsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  className = "",
  autoplay = false,
  autoplayDelay = 5000,
  theme = "teal",
}: BlogCarouselProps) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const { isMobile, isTablet } = useResponsiveBreakpoints()
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // If no posts are provided, show empty state instead of default posts
  if (!posts || posts.length === 0) {
    const themeStyles = {
      light: {
        container: "bg-white",
        title: "text-stone-900",
        subtitle: "text-stone-700",
      },
      teal: {
        container: "bg-teal-50",
        title: "text-stone-900",
        subtitle: "text-stone-700",
      },
    }

    return (
      <section className={`py-16 md:py-24 ${themeStyles[theme].container} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${themeStyles[theme].title}`}>
              {title}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${themeStyles[theme].subtitle}`}>
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Recent Articles</h3>
              <p className="text-gray-600 max-w-sm mx-auto text-sm">
                Stay tuned for fresh content coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const blogPosts = posts

  // Theme styles
  const themeStyles = {
    light: {
      container: "bg-white",
      title: "text-stone-900",
      subtitle: "text-stone-700",
      card: "bg-white border border-gray-200",
      category: "bg-gray-100 text-gray-700",
      date: "text-stone-700",
      excerpt: "text-stone-700",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-gray-700 hover:bg-gray-100",
      dots: "bg-gray-300",
      activeDot: "bg-teal-500",
    },
    teal: {
      container: "bg-teal-50",
      title: "text-stone-900",
      subtitle: "text-stone-700",
      card: "bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/40 border border-teal-100 backdrop-blur-sm",
      category: "bg-teal-100 text-teal-800",
      date: "text-stone-700",
      excerpt: "text-stone-700",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-teal-700 hover:bg-teal-50",
      dots: "bg-teal-200",
      activeDot: "bg-teal-500",
    },
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  // Determine how many posts to show based on screen size
  const getPostsPerView = useCallback(() => {
    if (isMobile) return postsPerView.mobile
    if (isTablet) return postsPerView.tablet
    return postsPerView.desktop
  }, [isMobile, isTablet, postsPerView])

  // Memoized navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? blogPosts.length - getPostsPerView() : prev - 1))
  }, [blogPosts.length, getPostsPerView])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= blogPosts.length - getPostsPerView() ? 0 : prev + 1))
  }, [blogPosts.length, getPostsPerView])

  // Defer autoplay initialization to reduce initial blocking
  useEffect(() => {
    if (!autoplay) return

    // Use requestIdleCallback to defer autoplay setup
    const scheduleAutoplay = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          autoplayTimerRef.current = setInterval(handleNext, autoplayDelay)
        })
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          autoplayTimerRef.current = setInterval(handleNext, autoplayDelay)
        }, 100)
      }
    }

    scheduleAutoplay()

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplay, autoplayDelay, handleNext])

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Optimized touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrev()
    }
  }, [touchStart, touchEnd, handleNext, handlePrev])

  const handleCardClick = useCallback((slug: string) => {
    router.push(slug)
  }, [router])

  return (
    <section className={`w-full max-w-[1440px] px-4 md:px-16 py-12 md:py-20 ${currentTheme.container} ${className}`}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.title}`}>{title}</h2>
            <p className={`mt-2 text-base md:text-lg ${currentTheme.subtitle}`}>{subtitle}</p>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / getPostsPerView())}%)` }}
          >
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className={`flex-none w-full sm:w-1/2 lg:w-1/3 p-4 transition-all duration-300`}
                style={{ width: `${100 / getPostsPerView()}%` }}
              >
                <article
                  className={`h-full ${currentTheme.card} rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.05] hover:bg-[#D1F1EB] hover:-translate-y-2 cursor-pointer group border border-transparent hover:border-teal-200`}
                  onClick={() => handleCardClick(post.slug)}
                  role="button"
                  aria-label={`Read article: ${post.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(post.slug)
                    }
                  }}
                >
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-500 ${
                        theme === 'teal' 
                          ? 'bg-gray-200 text-gray-700 group-hover:bg-teal-600 group-hover:text-white' 
                          : currentTheme.category
                      }`}>
                        {post.category}
                      </span>
                      <span className={`text-sm font-bold transition-colors duration-500 ${currentTheme.date} group-hover:text-stone-900`}>{post.readTime}</span>
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 transition-all duration-500 transform-gpu ${currentTheme.title} group-hover:text-stone-900 group-hover:scale-105`}>{post.title}</h3>
                    <p className={`text-base mb-4 transition-colors duration-500 ${currentTheme.excerpt} group-hover:text-stone-800`}>{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm transition-colors duration-500 ${currentTheme.date} group-hover:text-stone-800`}>{post.date}</span>
                      <div className="rounded-xl inline-flex justify-center items-center gap-2 transition-colors duration-500 min-h-[44px] min-w-[44px] p-2 text-stone-950 group-hover:text-stone-800">
                        <Link href={post.slug} className="inline-flex items-center gap-2 group/link">
                          <span className="text-base font-bold font-['Inter'] leading-normal">
                            Read more<span className="sr-only"> about {post.title}</span>
                          </span>
                          <ChevronRight size={24} className="transition-transform duration-500 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation and View All Container */}
        <div className="w-full flex justify-between items-center mt-6">
          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center items-center gap-4">
            <button
              onClick={handlePrev}
              className={`p-3 rounded-full ${currentTheme.nav} transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(blogPosts.length / getPostsPerView()) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? currentTheme.activeDot : currentTheme.dots
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className={`p-3 rounded-full ${currentTheme.nav} transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* View All Button */}
          <div className="ml-4">
            <Link href="/blog" className="inline-block">
              <OutlinedGradientButton>
                View all
              </OutlinedGradientButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogCarousel 