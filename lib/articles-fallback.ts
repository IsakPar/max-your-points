// Temporary fallback for articles while backend is being fixed
// This returns mock data to prevent Supabase calls

export async function getFeaturedArticles(limit = 3) {
  return [
    {
      id: '1',
      title: 'Maximize Your Chase Ultimate Rewards',
      summary: 'Learn how to get the most value from your Chase points with our comprehensive guide.',
      category: 'Credit Cards & Points',
      tag: 'Guides' as const,
      author: 'Max Your Points Team',
      date: 'January 15, 2025',
      readTime: '5 min read',
      image: '/travel-rewards-cards.png',
      slug: 'maximize-chase-ultimate-rewards'
    },
    {
      id: '2',
      title: 'Best Business Class Deals This Month',
      summary: 'Discover amazing business class flight deals and how to book them with points.',
      category: 'Airlines & Aviation',
      tag: 'News' as const,
      author: 'Max Your Points Team',
      date: 'January 12, 2025',
      readTime: '7 min read',
      image: '/first-class-cabin.png',
      slug: 'best-business-class-deals-january'
    }
  ]
}

export async function getPublishedArticles(limit = 10, offset = 0) {
  const articles = await getFeaturedArticles(limit)
  return {
    articles,
    total: articles.length,
    hasMore: false
  }
}

export async function getArticleBySlug(slug: string) {
  const articles = await getFeaturedArticles()
  return articles.find(article => article.slug === slug) || null
}

export async function getArticlesByCategory(categorySlug: string, limit = 10, offset = 0) {
  const articles = await getFeaturedArticles(limit)
  return {
    articles: articles.filter(article => 
      article.category.toLowerCase().includes(categorySlug.replace('-', ' '))
    ),
    total: 2,
    hasMore: false
  }
}

export function clearArticleCache() {
  console.log('🧹 Article cache cleared (fallback mode)')
} 