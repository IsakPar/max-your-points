"use client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

interface CategoryTagProps {
  children: React.ReactNode
}

const CategoryTag = ({ children }: CategoryTagProps) => {
  return <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">{children}</span>
}

interface BlogPostProps {
  post: {
    id: number
    title: string
    summary: string
    category: string
    readTime: string
    image: string
    slug: string
  }
}

// Update the BlogPost component to make the entire card clickable with hover effect
const BlogPost = ({ post }: BlogPostProps) => {
  const { title, summary, category, readTime, image, slug } = post
  const router = useRouter()

  const handleCardClick = () => {
    router.push(slug)
  }

  return (
    <div
      className="flex-1 flex flex-col md:flex-row justify-start items-start md:items-start gap-4 md:gap-8 p-4 rounded-lg transition-all duration-300 hover:shadow-elevation cursor-pointer bg-transparent"
      onClick={handleCardClick}
    >
      <div className="w-full md:w-2/5 h-48 md:h-64 flex-shrink-0 overflow-hidden rounded-md">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <div className="flex justify-start items-center gap-4">
            <CategoryTag>{category}</CategoryTag>
            <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">{readTime}</div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h3 className="w-full text-stone-950 text-xl md:text-2xl font-bold leading-relaxed md:leading-loose">
              {title}
            </h3>
            <p className="w-full text-stone-950 text-base font-bold font-['Inter'] leading-normal line-clamp-3">
              {summary}
            </p>
          </div>
        </div>
        <div
          className="rounded-xl inline-flex justify-center items-center gap-2 text-stone-950 hover:text-orange-500 transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevent triggering the parent click
        >
          <Link href={slug} className="inline-flex items-center gap-2">
            <span className="text-base font-bold font-['Inter'] leading-normal">Read more</span>
            <ChevronRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface OutlinedGradientButtonProps {
  href?: string
  children: React.ReactNode
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

interface BlogShowcaseProps {
  title?: string
  subtitle?: string
  posts?: Array<{
    id: number
    title: string
    summary: string
    category: string
    readTime: string
    image: string
    slug: string
  }>
  className?: string
}

// Update the BlogShowcase component
const BlogShowcase: React.FC<BlogShowcaseProps> = ({
  title = "Explore Our Latest Insights",
  subtitle = "Discover tips and tricks for savvy travelers.",
  posts = [],
  className = "",
}) => {
  // If no posts are provided, show empty state instead of default posts
  if (!posts || posts.length === 0) {
    return (
      <section className={`py-16 md:py-24 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 mb-4">
              {title}
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on bringing you amazing travel content. Check back soon for the latest insights and tips!
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`w-full max-w-[1440px] px-4 md:px-16 py-16 md:py-28 flex flex-col justify-start items-start gap-10 md:gap-20 overflow-hidden bg-[#ECFDF5] ${className}`}
    >
      <div className="w-full md:w-[768px] flex flex-col justify-start items-start gap-4">
        <div className="inline-flex justify-start items-center">
          <div className="text-stone-950 text-base font-bold font-['Inter'] leading-normal">Blog</div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start md:items-center gap-4 md:gap-6">
          <h2 className="self-stretch text-stone-950 text-3xl md:text-5xl font-bold leading-tight md:leading-[57.60px]">
            {title}
          </h2>
          <p className="self-stretch text-stone-950 text-base md:text-lg font-bold font-['Inter'] leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-8 md:gap-12">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-center md:items-end gap-4">
        <Link href="/blog" className="inline-block">
          <OutlinedGradientButton>
            View all
          </OutlinedGradientButton>
        </Link>
      </div>
    </section>
  )
}

export default BlogShowcase 