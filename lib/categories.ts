export interface Category {
  label: string
  slug: string
  subcategories: {
    label: string
    slug: string
  }[]
}

export const categories: Category[] = [
  {
    label: "Airlines & Aviation",
    slug: "airlines-and-aviation",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Credit Cards & Points",
    slug: "credit-cards-and-points",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Hotels & Trip Reports",
    slug: "hotels-and-trip-reports",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Trip Reports", slug: "trip-reports" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Travel Hacks & Deals",
    slug: "travel-hacks-and-deals",
    subcategories: [
      { label: "News", slug: "news" },
      { label: "Guides", slug: "guides" },
      { label: "Deals", slug: "deals" },
      { label: "Price Alerts", slug: "price-alerts" },
    ],
  },
]

// Helper functions
export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug)
}

export const getCategoryByLabel = (label: string) => {
  return categories.find(category => category.label === label)
}

export const getCategoryPath = (categorySlug: string, subcategorySlug?: string) => {
  return `/blog/categories/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ''}`
} 