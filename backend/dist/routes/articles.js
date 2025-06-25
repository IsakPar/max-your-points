"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const index_1 = require("../index");
const router = (0, express_1.Router)();
// Validation schemas
const createArticleSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long'),
    slug: zod_1.z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
    summary: zod_1.z.string().min(1, 'Summary is required').max(500, 'Summary too long'),
    content: zod_1.z.string().min(1, 'Content is required'),
    hero_image_url: zod_1.z.string().url().optional().nullable(),
    hero_image_alt: zod_1.z.string().optional().nullable(),
    category_id: zod_1.z.string().min(1, 'Category ID is required'),
    status: zod_1.z.enum(['draft', 'published', 'scheduled']).default('draft'),
    published_at: zod_1.z.string().datetime().optional().nullable(),
    featured_main: zod_1.z.boolean().default(false),
    featured_category: zod_1.z.boolean().default(false),
    meta_description: zod_1.z.string().max(160, 'Meta description too long').optional().nullable(),
    focus_keyword: zod_1.z.string().optional().nullable(),
    tags: zod_1.z.array(zod_1.z.string()).default([])
});
const updateArticleSchema = createArticleSchema.partial();
// Fallback test data when database is not connected
const mockArticles = [
    {
        id: 'mock-1',
        title: 'How to Maximize Your Credit Card Points',
        slug: 'maximize-credit-card-points',
        summary: 'Learn the best strategies to earn and redeem credit card points for maximum value.',
        excerpt: 'Learn the best strategies to earn and redeem credit card points for maximum value.',
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a sample article about maximizing credit card points...' }] }] },
        featuredImage: '/travel-rewards-cards.png',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        metaDescription: 'Learn how to maximize your credit card points and get the most value from your travel rewards.',
        author: { name: 'Max Your Points Team' },
        categories: [{ category: { id: 'cat-1', name: 'Credit Cards & Points', slug: 'credit-cards-and-points' } }]
    },
    {
        id: 'mock-2',
        title: 'Best First Class Flight Experiences of 2024',
        slug: 'best-first-class-flights-2024',
        summary: 'Discover the most luxurious first class flight experiences you can book with points.',
        excerpt: 'Discover the most luxurious first class flight experiences you can book with points.',
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a sample article about first class flights...' }] }] },
        featuredImage: '/first-class-cabin.png',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        metaDescription: 'Explore the best first class flight experiences and learn how to book them with points.',
        author: { name: 'Max Your Points Team' },
        categories: [{ category: { id: 'cat-2', name: 'Airlines & Aviation', slug: 'airlines-and-aviation' } }]
    }
];
// Get all articles with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { limit = '10', offset = '0', category, published = 'true' } = req.query;
        // Parse parameters
        const limitNum = parseInt(limit, 10) || 10;
        const offsetNum = parseInt(offset, 10) || 0;
        const publishedBool = published === 'true';
        // Check if database is connected
        if (!index_1.prisma) {
            console.log('🔄 Using fallback mock data - database not connected');
            // Filter mock data
            let filteredArticles = mockArticles.filter(article => !publishedBool || article.status === 'PUBLISHED');
            if (category) {
                filteredArticles = filteredArticles.filter(article => article.categories.some(cat => cat.category.slug === category));
            }
            // Apply pagination
            const paginatedArticles = filteredArticles.slice(offsetNum, offsetNum + limitNum);
            return res.json({
                articles: paginatedArticles.map(article => ({
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    summary: article.summary,
                    excerpt: article.excerpt,
                    content: article.content,
                    featuredImage: article.featuredImage,
                    hero_image_url: article.featuredImage,
                    categoryId: article.categories[0]?.category?.id || null,
                    category: article.categories[0]?.category || null,
                    published: article.status === 'PUBLISHED',
                    featured: true, // Mock data is featured
                    createdAt: article.createdAt,
                    updatedAt: article.updatedAt,
                    publishedAt: article.publishedAt,
                    metaDescription: article.metaDescription,
                    tags: [],
                    authorName: article.author.name
                })),
                total: filteredArticles.length,
                hasMore: offsetNum + limitNum < filteredArticles.length
            });
        }
        // Build query filters
        const where = {};
        if (publishedBool) {
            where.status = 'PUBLISHED';
        }
        if (category) {
            where.categories = {
                some: {
                    category: {
                        slug: category
                    }
                }
            };
        }
        // Get articles with pagination
        const [articles, total] = await Promise.all([
            index_1.prisma.article.findMany({
                where,
                take: limitNum,
                skip: offsetNum,
                orderBy: {
                    publishedAt: 'desc'
                },
                include: {
                    author: true,
                    categories: {
                        include: {
                            category: true
                        }
                    }
                }
            }),
            index_1.prisma.article.count({ where })
        ]);
        res.json({
            articles: articles.map(article => ({
                id: article.id,
                title: article.title,
                slug: article.slug,
                summary: article.excerpt,
                excerpt: article.excerpt,
                content: article.content,
                featuredImage: article.featuredImage,
                hero_image_url: article.featuredImage,
                categoryId: article.categories[0]?.category?.id || null,
                category: article.categories[0]?.category || null,
                published: article.status === 'PUBLISHED',
                featured: false, // Will need to add featured fields to schema later
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                publishedAt: article.publishedAt,
                metaDescription: article.metaDescription,
                tags: [], // Will need to add tags to schema later
                authorName: article.author.name
            })),
            total,
            hasMore: offsetNum + limitNum < total
        });
    }
    catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({
            error: 'Failed to fetch articles',
            message: error.message,
            articles: [],
            total: 0
        });
    }
});
// Get single article by slug or ID
router.get('/:slugOrId', async (req, res) => {
    try {
        const { slugOrId } = req.params;
        if (!index_1.prisma) {
            console.log('🔄 Using fallback mock data - database not connected');
            const article = mockArticles.find(a => a.slug === slugOrId || a.id === slugOrId);
            if (!article) {
                return res.status(404).json({
                    error: 'Article not found'
                });
            }
            return res.json({
                id: article.id,
                title: article.title,
                slug: article.slug,
                summary: article.summary,
                excerpt: article.excerpt,
                content: article.content,
                featuredImage: article.featuredImage,
                hero_image_url: article.featuredImage,
                categoryId: article.categories[0]?.category?.id || null,
                category: article.categories[0]?.category || null,
                published: article.status === 'PUBLISHED',
                featured: true,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                publishedAt: article.publishedAt,
                metaDescription: article.metaDescription,
                tags: [],
                authorName: article.author.name
            });
        }
        // Try to find by slug first, then by ID
        let article = await index_1.prisma.article.findFirst({
            where: {
                OR: [
                    { slug: slugOrId },
                    { id: slugOrId }
                ]
            },
            include: {
                author: true,
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });
        if (!article) {
            return res.status(404).json({
                error: 'Article not found'
            });
        }
        res.json({
            id: article.id,
            title: article.title,
            slug: article.slug,
            summary: article.excerpt,
            excerpt: article.excerpt,
            content: article.content,
            featuredImage: article.featuredImage,
            hero_image_url: article.featuredImage,
            categoryId: article.categories[0]?.category?.id || null,
            category: article.categories[0]?.category || null,
            published: article.status === 'PUBLISHED',
            featured: false, // Will need to add featured fields to schema later
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt,
            metaDescription: article.metaDescription,
            tags: [], // Will need to add tags to schema later
            authorName: article.author.name
        });
    }
    catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({
            error: 'Failed to fetch article',
            message: error.message
        });
    }
});
// Create new article
router.post('/', async (req, res) => {
    try {
        // Validate request body
        const validatedData = createArticleSchema.parse(req.body);
        if (!index_1.prisma) {
            return res.status(503).json({
                error: 'Database not available',
                message: 'Cannot create articles when database is disconnected'
            });
        }
        // Get user ID from JWT token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authentication token provided'
            });
        }
        const jwt = require('jsonwebtoken');
        let authorId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            authorId = decoded.userId;
            // If it's the temp admin, create a real user in database
            if (authorId === 'temp-admin-001') {
                const existingUser = await index_1.prisma.user.findUnique({
                    where: { email: 'isak@maxyourpoints.com' }
                });
                if (!existingUser) {
                    const bcrypt = require('bcryptjs');
                    const hashedPassword = await bcrypt.hash('admin123', 12);
                    const newUser = await index_1.prisma.user.create({
                        data: {
                            email: 'isak@maxyourpoints.com',
                            password: hashedPassword,
                            name: 'Isak Parild',
                            role: 'SUPER_ADMIN',
                            verified: true
                        }
                    });
                    authorId = newUser.id;
                }
                else {
                    authorId = existingUser.id;
                }
            }
        }
        catch (jwtError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid authentication token'
            });
        }
        // Check if slug already exists
        const existingArticle = await index_1.prisma.article.findUnique({
            where: { slug: validatedData.slug }
        });
        if (existingArticle) {
            return res.status(400).json({
                error: 'Slug already exists',
                message: 'An article with this slug already exists'
            });
        }
        // Create the article
        const article = await index_1.prisma.article.create({
            data: {
                title: validatedData.title,
                slug: validatedData.slug,
                excerpt: validatedData.summary,
                content: validatedData.content,
                featuredImage: validatedData.hero_image_url,
                status: validatedData.status.toUpperCase(),
                publishedAt: validatedData.published_at ? new Date(validatedData.published_at) : null,
                metaDescription: validatedData.meta_description,
                authorId: authorId,
                categories: {
                    create: {
                        categoryId: validatedData.category_id
                    }
                }
            },
            include: {
                author: true,
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });
        console.log('✅ Article created:', article.title);
        res.status(201).json({
            id: article.id,
            title: article.title,
            slug: article.slug,
            summary: article.excerpt,
            content: article.content,
            hero_image_url: article.featuredImage,
            hero_image_alt: validatedData.hero_image_alt,
            category_id: validatedData.category_id,
            status: article.status.toLowerCase(),
            published_at: article.publishedAt,
            featured_main: validatedData.featured_main,
            featured_category: validatedData.featured_category,
            meta_description: article.metaDescription,
            focus_keyword: validatedData.focus_keyword,
            tags: validatedData.tags,
            created_at: article.createdAt,
            updated_at: article.updatedAt,
            author: article.author
        });
    }
    catch (error) {
        console.error('Error creating article:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        res.status(500).json({
            error: 'Failed to create article',
            message: error.message
        });
    }
});
// Update article
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateArticleSchema.parse(req.body);
        if (!index_1.prisma) {
            return res.status(503).json({
                error: 'Database not available',
                message: 'Cannot update articles when database is disconnected'
            });
        }
        // Check if article exists
        const existingArticle = await index_1.prisma.article.findUnique({
            where: { id }
        });
        if (!existingArticle) {
            return res.status(404).json({
                error: 'Article not found'
            });
        }
        // Check slug uniqueness if slug is being updated
        if (validatedData.slug && validatedData.slug !== existingArticle.slug) {
            const slugExists = await index_1.prisma.article.findUnique({
                where: { slug: validatedData.slug }
            });
            if (slugExists) {
                return res.status(400).json({
                    error: 'Slug already exists',
                    message: 'An article with this slug already exists'
                });
            }
        }
        // Update the article
        const updateData = {};
        if (validatedData.title)
            updateData.title = validatedData.title;
        if (validatedData.slug)
            updateData.slug = validatedData.slug;
        if (validatedData.summary)
            updateData.excerpt = validatedData.summary;
        if (validatedData.content)
            updateData.content = validatedData.content;
        if (validatedData.hero_image_url !== undefined)
            updateData.featuredImage = validatedData.hero_image_url;
        if (validatedData.status)
            updateData.status = validatedData.status.toUpperCase();
        if (validatedData.published_at !== undefined) {
            updateData.publishedAt = validatedData.published_at ? new Date(validatedData.published_at) : null;
        }
        if (validatedData.meta_description !== undefined)
            updateData.metaDescription = validatedData.meta_description;
        const article = await index_1.prisma.article.update({
            where: { id },
            data: updateData,
            include: {
                author: true,
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });
        console.log('✅ Article updated:', article.title);
        res.json({
            id: article.id,
            title: article.title,
            slug: article.slug,
            summary: article.excerpt,
            content: article.content,
            hero_image_url: article.featuredImage,
            hero_image_alt: validatedData.hero_image_alt,
            category_id: validatedData.category_id,
            status: article.status.toLowerCase(),
            published_at: article.publishedAt,
            featured_main: validatedData.featured_main,
            featured_category: validatedData.featured_category,
            meta_description: article.metaDescription,
            focus_keyword: validatedData.focus_keyword,
            tags: validatedData.tags || [],
            created_at: article.createdAt,
            updated_at: article.updatedAt,
            author: article.author
        });
    }
    catch (error) {
        console.error('Error updating article:', error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        res.status(500).json({
            error: 'Failed to update article',
            message: error.message
        });
    }
});
// Delete article
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!index_1.prisma) {
            return res.status(503).json({
                error: 'Database not available',
                message: 'Cannot delete articles when database is disconnected'
            });
        }
        // Check if article exists
        const existingArticle = await index_1.prisma.article.findUnique({
            where: { id }
        });
        if (!existingArticle) {
            return res.status(404).json({
                error: 'Article not found'
            });
        }
        // Delete the article
        await index_1.prisma.article.delete({
            where: { id }
        });
        console.log('✅ Article deleted:', existingArticle.title);
        res.json({
            message: 'Article deleted successfully',
            deletedId: id
        });
    }
    catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({
            error: 'Failed to delete article',
            message: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=articles.js.map