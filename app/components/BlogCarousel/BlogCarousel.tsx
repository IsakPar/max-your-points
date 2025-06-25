"use client"

import { useState, useEffect, useRef } from "react"
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
  theme?: 'light' | 'dark' | 'teal'
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
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg text-stone-950 hover:text-orange-500"
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

const BlogCarousel = ({
  title = "Latest from Our Blog",
  subtitle = "Discover our most recent insights and travel tips",
  posts = [],
  postsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  className = "",
  autoplay = false,
  autoplayDelay = 5000,
  theme = "light",
}: BlogCarouselProps) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
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
      dark: {
        container: "bg-stone-900",
        title: "text-white",
        subtitle: "text-gray-300",
      },
      teal: {
        container: "bg-teal-50",
        title: "text-stone-900",
        subtitle: "text-stone-700",
      },
    }

    const currentTheme = themeStyles[theme] || themeStyles.light

    return (
      <section className={`py-16 md:py-24 ${currentTheme.container} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${currentTheme.title}`}>
              {title}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${currentTheme.subtitle}`}>
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
      title: "text-stone-950",
      subtitle: "text-stone-950",
      card: "bg-white border border-gray-200",
      category: "bg-gray-200 text-gray-700",
      date: "text-stone-800",
      excerpt: "text-stone-950",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-gray-700 hover:bg-gray-100",
      dots: "bg-gray-300",
      activeDot: "bg-teal-500",
    },
    dark: {
      container: "bg-stone-900",
      title: "text-white",
      subtitle: "text-gray-300",
      card: "bg-stone-800 border border-stone-700",
      category: "bg-stone-700 text-gray-300",
      date: "text-gray-400",
      excerpt: "text-gray-300",
      button: "text-teal-400 hover:text-orange-400",
      nav: "bg-stone-800 text-gray-300 hover:bg-stone-700",
      dots: "bg-gray-600",
      activeDot: "bg-teal-400",
    },
    teal: {
      container: "bg-teal-50",
      title: "text-stone-950",
      subtitle: "text-stone-950",
      card: "bg-white border border-teal-100",
      category: "bg-gray-200 text-gray-700",
      date: "text-stone-800",
      excerpt: "text-stone-950",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-teal-700 hover:bg-teal-50",
      dots: "bg-teal-200",
      activeDot: "bg-teal-500",
    },
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Determine how many posts to show based on screen size
  const getPostsPerView = () => {
    if (isMobile) return postsPerView.mobile
    if (isTablet) return postsPerView.tablet
    return postsPerView.desktop
  }

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext()
      }, autoplayDelay)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplay, autoplayDelay])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? blogPosts.length - getPostsPerView() : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= blogPosts.length - getPostsPerView() ? 0 : prev + 1))
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
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
  }

  const handleCardClick = (slug: string) => {
    router.push(slug)
  }

  return (
    <section className={`w-full max-w-[1440px] px-4 md:px-16 py-12 md:py-20 ${currentTheme.container} ${className}`}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.title}`}>{title}</h2>
            <p className={`mt-2 text-base md:text-lg ${currentTheme.subtitle}`}>{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className={`p-2 rounded-full ${currentTheme.nav} transition-colors`}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className={`p-2 rounded-full ${currentTheme.nav} transition-colors`}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
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
                  className={`h-full ${currentTheme.card} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                  onClick={() => handleCardClick(post.slug)}
                >
                  <div className="aspect-[16/9] relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentTheme.category}`}>
                        {post.category}
                      </span>
                      <span className={`text-sm ${currentTheme.date}`}>{post.readTime}</span>
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${currentTheme.title}`}>{post.title}</h3>
                    <p className={`text-base ${currentTheme.excerpt} mb-4`}>{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${currentTheme.date}`}>{post.date}</span>
                      <OutlinedGradientButton href={post.slug}>Read More</OutlinedGradientButton>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: blogPosts.length - getPostsPerView() + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? currentTheme.activeDot : currentTheme.dots
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogCarousel 