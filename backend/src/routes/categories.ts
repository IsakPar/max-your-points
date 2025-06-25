import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router: Router = Router();

// Mock categories data for fallback when database is not connected
const mockCategories = [
  {
    id: 'cat-1',
    name: 'Credit Cards & Points',
    slug: 'credit-cards-and-points',
    description: 'Maximize your credit card rewards and points earning potential',
    featured: true,
    articleCount: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-2',
    name: 'Airlines & Aviation',
    slug: 'airlines-and-aviation',
    description: 'Flight reviews, airline news, and aviation insights',
    featured: true,
    articleCount: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-3',
    name: 'Hotels & Trip Reports',
    slug: 'hotels-and-trip-reports',
    description: 'Hotel reviews and detailed trip reports',
    featured: false,
    articleCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-4',
    name: 'Travel Hacks & Deals',
    slug: 'travel-hacks-and-deals',
    description: 'Money-saving travel tips and exclusive deals',
    featured: false,
    articleCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check if database is connected
    if (!prisma) {
      console.log('🔄 Using fallback mock categories - database not connected');
      
      return res.json({
        categories: mockCategories
      });
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    res.json({
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        featured: category.featured,
        articleCount: category._count.articles,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }))
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message,
      categories: mockCategories // Fallback to mock data on error
    });
  }
});

// Get single category by slug or ID
router.get('/:slugOrId', async (req: Request, res: Response) => {
  try {
    const { slugOrId } = req.params;

    if (!prisma) {
      console.log('🔄 Using fallback mock category - database not connected');
      
      const category = mockCategories.find(cat => cat.slug === slugOrId || cat.id === slugOrId);
      
      if (!category) {
        return res.status(404).json({
          error: 'Category not found'
        });
      }

      return res.json(category);
    }

    // Try to find by slug first, then by ID
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId }
        ]
      },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    res.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      featured: category.featured,
      articleCount: category._count.articles,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    });

  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      error: 'Failed to fetch category',
      message: error.message
    });
  }
});

export default router; 