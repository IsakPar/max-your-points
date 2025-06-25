// Database-first interfaces (matching Supabase schema)

export interface DatabaseArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  hero_image_url: string | null
  hero_image_alt: string | null
  category_id: string
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  featured_main: boolean
  featured_category: boolean
  meta_description: string | null
  focus_keyword: string | null
  seo_score: number | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface DatabaseSubcategory {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string
  created_at: string
}

// Frontend-optimized interfaces (what components will use)

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  image: string | null
  imageAlt: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  subcategories: {
    id: string
    name: string
    slug: string
  }[]
  status: 'draft' | 'published' | 'scheduled'
  publishedAt: string | null
  featuredMain: boolean
  featuredCategory: boolean
  metaDescription: string | null
  focusKeyword: string | null
  seoScore: number | null
  tags: string[]
  author: string
  readTime: string
  createdAt: string
  updatedAt: string
}

export interface ArticlePreview {
  id: string
  title: string
  slug: string
  summary: string
  image: string | null
  imageAlt: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  publishedAt: string
  readTime: string
  author: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  articleCount?: number
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  description: string | null
  categoryId: string
  articleCount?: number
}

// Query result types with joins

export interface ArticleWithRelations {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  hero_image_url: string | null
  hero_image_alt: string | null
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  featured_main: boolean
  featured_category: boolean
  meta_description: string | null
  focus_keyword: string | null
  seo_score: number | null
  tags: string[]
  created_at: string
  updated_at: string
  categories: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  article_subcategories: {
    subcategories: {
      id: string
      name: string
      slug: string
      description: string | null
    }
  }[]
}

// Separate interface for articles with related articles
export interface ArticleWithRelatedArticles extends ArticleWithRelations {
  article_relations_article_relations_article_idToarticles: {
    related_articles: {
      id: string
      title: string
      slug: string
      summary: string
      hero_image_url: string | null
    }
  }[]
}

// Utility types

export interface PaginationOptions {
  limit?: number
  offset?: number
}

export interface ArticleQueryOptions extends PaginationOptions {
  status?: 'draft' | 'published' | 'scheduled'
  featured?: boolean
  categorySlug?: string
  subcategorySlug?: string
  tags?: string[]
}

export interface SearchOptions extends PaginationOptions {
  query: string
  category?: string
  tags?: string[]
}

// API Response types

export interface ArticlesResponse {
  articles: ArticlePreview[]
  total: number
  hasMore: boolean
}

export interface CategoriesResponse {
  categories: Category[]
  total: number
}

// Error types

export class ArticleNotFoundError extends Error {
  constructor(slug: string) {
    super(`Article with slug "${slug}" not found`)
    this.name = 'ArticleNotFoundError'
  }
}

export class CategoryNotFoundError extends Error {
  constructor(slug: string) {
    super(`Category with slug "${slug}" not found`)
    this.name = 'CategoryNotFoundError'
  }
}

// Helper type for transforming database results to frontend format
export type ArticleTransformer = (dbArticle: ArticleWithRelations) => Article
export type ArticlePreviewTransformer = (dbArticle: ArticleWithRelations) => ArticlePreview 