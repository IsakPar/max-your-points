'use client'

import { Category } from '@/lib/categories'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryTogglesProps {
  category: Category
}
// <- CategoryToggles.tsx ->
export function CategoryToggles({ category }: CategoryTogglesProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {category.subcategories.map((subcat) => {
        const isActive = pathname === `/blog/categories/${category.slug}/${subcat.slug}`
        return (
          <Link
            key={subcat.slug}
            href={`/blog/categories/${category.slug}/${subcat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {subcat.label}
          </Link>
        )
      })}
    </div>
  )
} 