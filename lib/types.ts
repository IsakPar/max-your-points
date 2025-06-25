// Placeholder types for the custom CMS system
// These will be replaced with actual implementations

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: any // Rich text content
  heroImage?: {
    url: string
    alt: string
  }
  category: string | Category
  subCategories?: (string | Subcategory)[]
  metaDescription: string
  focusKeyword: string
  seoScore?: number
  tags?: { tag: string }[]
  relatedArticles?: (string | Article)[]
  publishedAt: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  category: string | Category
  description?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface QueryOptions {
  limit?: number
  page?: number
  sort?: string
  where?: any
} 