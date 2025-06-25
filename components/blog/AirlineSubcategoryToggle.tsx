"use client"

import * as React from "react"
import { categories } from "@/lib/categories"

interface AirlineSubcategoryToggleProps {
  onSubcategoryChange: (subcategory: string | null) => void
  activeSubcategory: string | null
}

export default function AirlineSubcategoryToggle({ 
  onSubcategoryChange, 
  activeSubcategory 
}: AirlineSubcategoryToggleProps) {
  const airlineCategory = categories.find(cat => cat.slug === "airlines-and-aviation")
  
  if (!airlineCategory) return null

  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex rounded-lg border border-stone-200 p-1 bg-white shadow-sm">
        <button
          onClick={() => onSubcategoryChange(null)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${!activeSubcategory 
              ? 'bg-emerald-600 text-white' 
              : 'text-stone-600 hover:bg-stone-100'
            }`}
        >
          All
        </button>
        {airlineCategory.subcategories.map((subcat) => (
          <button
            key={subcat.slug}
            onClick={() => onSubcategoryChange(subcat.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${activeSubcategory === subcat.slug 
                ? 'bg-emerald-600 text-white' 
                : 'text-stone-600 hover:bg-stone-100'
              }`}
          >
            {subcat.label}
          </button>
        ))}
      </div>
    </div>
  )
} 