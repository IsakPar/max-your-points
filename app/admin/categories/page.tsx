import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Plus, Edit, Trash2, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

// Mock categories for development
const mockCategories = [
  {
    id: '1',
    name: 'Travel Hacks and Deals',
    slug: 'travel-hacks-and-deals',
    description: 'Money-saving tips and exclusive travel deals',
    color: '#3B82F6',
    article_count: 5
  },
  {
    id: '2',
    name: 'Credit Cards and Points',
    slug: 'credit-cards-and-points',
    description: 'Maximize your credit card rewards and points',
    color: '#10B981',
    article_count: 8
  },
  {
    id: '3',
    name: 'Hotels and Trip Reports',
    slug: 'hotels-and-trip-reports',
    description: 'Hotel reviews and detailed trip experiences',
    color: '#F59E0B',
    article_count: 12
  },
  {
    id: '4',
    name: 'Airlines and Aviation',
    slug: 'airlines-and-aviation',
    description: 'Airline reviews, routes, and aviation insights',
    color: '#EF4444',
    article_count: 7
  }
]

export default function CategoriesPage() {
  const categories = mockCategories

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your content with categories and subcategories
          </p>
        </div>
        <div className="flex space-x-3">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {category.article_count} articles
                </Badge>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Slug: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{category.slug}</code>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 