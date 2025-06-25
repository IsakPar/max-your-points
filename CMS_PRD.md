# Max Your Points CMS - Product Requirements Document (PRD)

## Executive Summary

Max Your Points CMS is a custom-built, Next.js-based content management system designed specifically for travel and points optimization content. The system features advanced SEO optimization, semantic HTML analysis, rich content editing, intelligent media management, and planned internal article linking capabilities.

## Current Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15.2.4 with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with TypeScript, Prisma ORM
- **Database**: PostgreSQL (Railway hosted)
- **Authentication**: JWT-based with middleware protection
- **Package Manager**: pnpm (as per project standards)

### Admin System Structure
```
/admin/
├── Dashboard (Analytics & Quick Actions)
├── Articles (Content Management)
├── Media (Image Library & Processing)
├── Users (Admin User Management)
├── Categories (Content Organization)
└── Newsletter (Subscriber Management)
```

## Core Components Architecture

### 1. Content Management System

#### 1.1 Rich Text Editing System
**Primary Editor**: BlockNote Editor (`block-editor.tsx`)
- **Block-based editing approach**: Modern, intuitive content creation
- **Drag-and-drop interface**: Enhanced UX for content organization
- **Integrated file upload**: Seamless media integration
- **Mantine UI components**: Consistent design system
- **Extensible architecture**: Ready for AI-powered enhancements
- **Real-time collaboration ready**: Future-proof for multi-user editing

**Legacy Support**: TipTap Rich Text Editor (`rich-text-editor.tsx`)
- Maintained for existing content compatibility
- Custom figure extension for image captions
- Semantic HTML output with DOMPurify sanitization
- Advanced formatting capabilities

#### 1.2 Article Management Features
**Current Implementation:**
- Article creation/editing interface (placeholder - backend integration needed)
- Category and subcategory assignment
- SEO metadata management
- Publishing controls (draft/published/scheduled)
- Featured article designation (main page vs category)

**Database Schema Support:**
```typescript
interface DatabaseArticle {
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
```

### 2. Advanced SEO Analysis System

#### 2.1 SEO Calculator (`AdvancedSEOCalculator.tsx`)
**Features:**
- **Real-time Analysis**: 1-second debounced content analysis
- **Comprehensive Scoring**: Overall, content quality, keyword optimization, technical SEO, UX
- **Caching System**: Content hash-based caching for performance
- **Multi-tab Interface**: Overview, Issues, Recommendations, Metrics

**Scoring Breakdown:**
- Content Quality (length, readability, structure)
- Keyword Optimization (density, distribution, LSI keywords)
- Technical SEO (title, meta description, URL structure)
- User Experience (engagement, visual content, scannability)

**API Integration:**
```typescript
// POST /api/seo/analyze
{
  content: string,
  metadata: SEOMetadata,
  articleId?: string,
  cacheKey?: string
}
```

#### 2.2 Semantic HTML Analyzer (`SemanticAnalyzer.tsx`)
**Capabilities:**
- **Heading Structure Analysis**: Proper H1-H6 hierarchy validation
- **Accessibility Checks**: Alt text, semantic markup validation
- **Auto-fix Suggestions**: Generates corrected HTML
- **Article-specific Rules**: Assumes title will be H1, content starts with H2

**Analysis Output:**
```typescript
interface SemanticAnalysis {
  issues: SemanticIssue[]
  suggestions: SemanticSuggestion[]
  score: number
  fixedHtml?: string
  headingStructure: HeadingNode[]
}
```

### 3. Media Management System

#### 3.1 Image Upload & Processing (`ImageUpload.tsx`)
**Advanced Features:**
- **Multi-format Support**: JPEG, PNG, WebP, GIF, HEIC/HEIF
- **HEIC Conversion**: Automatic HEIC to PNG conversion
- **Image Optimization**: Automatic compression with ratio reporting
- **Metadata Management**: Alt text, captions, titles, tags
- **Drag & Drop Interface**: Enhanced UX with progress indicators
- **URL Import**: Alternative to file upload

**Processing Pipeline:**
1. File validation (size, type)
2. HEIC detection and conversion
3. Image optimization and compression
4. Metadata extraction and storage
5. Database record creation

#### 3.2 Media Library (`media/page.tsx`)
**Comprehensive Management:**
- **Search & Filter**: By filename, alt text, tags, categories
- **Metadata Editing**: In-place editing of image metadata
- **Usage Tracking**: Track where images are used
- **Batch Operations**: Bulk metadata updates
- **Storage Analytics**: File sizes, compression ratios

**Database Schema:**
```typescript
interface ImageMetadata {
  id: string
  file_path: string
  file_name: string
  public_url: string
  alt_text: string
  caption: string
  title: string
  file_size: number
  original_size: number
  compression_ratio: number
  was_heic: boolean
  was_optimized: boolean
  usage_count: number
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}
```

### 4. User Management & Authentication

#### 4.1 Authentication System
**Implementation:**
- **JWT-based**: 7-day token expiration
- **Middleware Protection**: Route-level access control
- **Cookie + LocalStorage**: Dual storage for reliability
- **Development Fallback**: Temp admin user when DB unavailable

**Credentials (Development):**
- Email: `isak@maxyourpoints.com`
- Password: `admin123`

#### 4.2 User Management (`CreateUserDialog.tsx`)
**Features:**
- Role-based access control
- User creation with validation
- Password security requirements
- Account status management

### 5. Admin Dashboard

#### 5.1 Dashboard Overview (`admin/page.tsx`)
**Current Metrics Display:**
- Total users count
- Total articles count
- Media files count
- Growth statistics

**Quick Actions:**
- New article creation
- Media library access
- User management
- Content overview

## Advanced Features Implementation

### 6. SEO & Analytics Engine

#### 6.1 Text Analysis Engine (`lib/seo/text-analysis.ts`)
**Capabilities:**
- **Readability Scores**: Flesch Reading Ease, Gunning Fog Index, SMOG
- **Keyword Analysis**: Density calculations, frequency analysis
- **Content Metrics**: Word count, sentence analysis, paragraph structure
- **LSI Keyword Detection**: Latent Semantic Indexing support

#### 6.2 Scoring Engine (`lib/seo/scoring-engine.ts`)
**Scoring Categories:**
- **Content Quality**: Length, readability, structure analysis
- **Keyword Optimization**: Primary/secondary keyword analysis
- **Technical SEO**: Meta tags, URL structure, heading hierarchy
- **Internal Linking**: Current basic scoring (needs enhancement)

### 7. Content Processing Pipeline

#### 7.1 Semantic HTML Engine (`lib/semantic-html-engine.ts`)
**Processing Features:**
- **HTML Parsing**: DOM-based content analysis
- **Structure Validation**: Heading hierarchy enforcement
- **Auto-correction**: Generates semantically correct HTML
- **Accessibility Compliance**: WCAG guideline adherence

#### 7.2 Content Sanitization
**Security Measures:**
- **DOMPurify Integration**: XSS prevention
- **Content Validation**: Safe HTML output
- **Image Processing**: Secure file handling

## NEW FEATURE: Internal Article Linking Engine

### 8. Intelligent Article Interlinking System

#### 8.1 Core Requirements
**Objective**: Build an AI-powered system that analyzes article content and suggests 2-3 relevant internal articles for interlinking based on multiple relevance metrics.

#### 8.2 Analysis Metrics
**Content Similarity Scoring:**
1. **Category Matching** (Weight: 25%)
   - Primary category alignment
   - Subcategory overlap
   - Category hierarchy relevance

2. **Tag Similarity** (Weight: 20%)
   - Shared tags analysis
   - Tag frequency weighting
   - Semantic tag relationships

3. **Keyword Analysis** (Weight: 25%)
   - Focus keyword matching
   - Secondary keyword overlap
   - LSI keyword correlation

4. **Content Analysis** (Weight: 20%)
   - Word frequency analysis
   - Topic modeling (TF-IDF)
   - Semantic similarity scoring

5. **User Engagement** (Weight: 10%)
   - Article performance metrics
   - Click-through rates
   - Time on page correlation

#### 8.3 Technical Implementation

**Database Requirements:**
```sql
-- New table for article relationships
CREATE TABLE article_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  related_article_id UUID REFERENCES articles(id),
  relevance_score DECIMAL(5,2),
  relation_type VARCHAR(50), -- 'category', 'keyword', 'semantic', 'manual'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_article_relations_article_id ON article_relations(article_id);
CREATE INDEX idx_article_relations_score ON article_relations(relevance_score DESC);
```

**API Endpoints:**
```typescript
// Get suggestions for article
GET /api/articles/{id}/suggestions
Response: {
  suggestions: Array<{
    article: ArticlePreview,
    relevanceScore: number,
    reasons: string[],
    suggestedAnchorText: string[]
  }>
}

// Update article relationships
POST /api/articles/{id}/relations
Body: {
  relatedArticleIds: string[],
  autoGenerated: boolean
}
```

#### 8.4 Frontend Integration

**Article Editor Enhancement:**
```typescript
// New component: InternalLinkSuggestions.tsx
interface LinkSuggestion {
  article: {
    id: string
    title: string
    slug: string
    summary: string
    category: string
  }
  relevanceScore: number
  suggestedText: string[]
  reasons: string[]
}
```

**Editor Integration Points:**
1. **Real-time Suggestions**: As user types, analyze content and suggest links
2. **Sidebar Panel**: Dedicated linking suggestions panel
3. **Inline Suggestions**: Contextual link suggestions within editor
4. **Batch Processing**: Analyze existing articles for link opportunities

#### 8.5 Algorithm Implementation

**Content Analysis Pipeline:**
```typescript
class ArticleLinkingEngine {
  // 1. Extract article features
  extractFeatures(article: Article): ArticleFeatures
  
  // 2. Calculate similarity scores
  calculateSimilarity(sourceArticle: Article, targetArticle: Article): SimilarityScore
  
  // 3. Rank suggestions
  rankSuggestions(similarities: SimilarityScore[]): RankedSuggestion[]
  
  // 4. Generate anchor text suggestions
  generateAnchorText(sourceContent: string, targetArticle: Article): string[]
}
```

**Scoring Algorithm:**
```typescript
interface SimilarityScore {
  categoryScore: number      // 0-100
  tagScore: number          // 0-100
  keywordScore: number      // 0-100
  contentScore: number      // 0-100
  engagementScore: number   // 0-100
  finalScore: number        // Weighted average
}
```

#### 8.6 Performance Optimization

**Caching Strategy:**
- **Article Vectors**: Pre-computed feature vectors for all articles
- **Similarity Matrix**: Cached pairwise similarity scores
- **Suggestion Cache**: TTL-based caching of suggestions
- **Incremental Updates**: Only recalculate when articles change

**Background Processing:**
- **Batch Analysis**: Nightly processing of all articles
- **Real-time Updates**: When articles are published/updated
- **Performance Monitoring**: Track suggestion quality and usage

## FUTURE FEATURE: Daily Airfare Intelligence System

### 9. Travel Price Monitoring & Content Generation

#### 9.1 Core Requirements
**Objective**: Build an automated system that scrapes web sources for daily airfare deals and generates content suggestions, enhancing the travel deals content strategy.

#### 9.2 Data Sources & Scraping Strategy
**Primary Sources:**
1. **Airline Websites**: Direct carrier pricing data
   - Major carriers (Delta, American, United, Southwest, etc.)
   - Low-cost carriers (Spirit, Frontier, JetBlue, etc.)
   - International carriers (Lufthansa, Emirates, British Airways, etc.)

2. **Travel Aggregators**: Comprehensive price comparison
   - Google Flights API integration
   - Kayak price monitoring
   - Expedia/Priceline data feeds
   - Momondo deal tracking

3. **Deal Aggregator Sites**: Specialized fare tracking
   - Scott's Cheap Flights / Going.com API
   - Secret Flying deal feeds
   - The Flight Deal RSS monitoring
   - Airfarewatchdog price alerts

#### 9.3 Technical Architecture

**Scraping Infrastructure:**
```typescript
interface AirfareDeal {
  id: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  price: number
  currency: string
  airline: string
  fareClass: 'economy' | 'premium_economy' | 'business' | 'first'
  dealQuality: 'excellent' | 'good' | 'fair' // Based on historical pricing
  validUntil: string
  bookingUrl: string
  restrictions: string[]
  lastUpdated: string
  source: string
}
```

**Database Schema:**
```sql
CREATE TABLE airfare_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin VARCHAR(3) NOT NULL,        -- Airport codes
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  airline VARCHAR(100) NOT NULL,
  fare_class VARCHAR(20) NOT NULL,
  deal_quality VARCHAR(20) NOT NULL,
  deal_score INTEGER NOT NULL,       -- 0-100 based on historical data
  valid_until TIMESTAMP NOT NULL,
  booking_url TEXT,
  restrictions TEXT[],
  source VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route VARCHAR(7) NOT NULL,         -- Format: ORIGIN-DESTINATION
  price DECIMAL(10,2) NOT NULL,
  airline VARCHAR(100),
  fare_class VARCHAR(20),
  recorded_date DATE NOT NULL,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_airfare_deals_route ON airfare_deals(origin, destination);
CREATE INDEX idx_airfare_deals_date ON airfare_deals(departure_date);
CREATE INDEX idx_airfare_deals_quality ON airfare_deals(deal_quality, deal_score DESC);
```

#### 9.4 Scraping Automation

**Daily Scraping Pipeline:**
```typescript
class AirfareScrapingEngine {
  // 1. Popular route monitoring
  async scrapePopularRoutes(): Promise<AirfareDeal[]>
  
  // 2. Seasonal route analysis
  async scrapeSeasonalDeals(): Promise<AirfareDeal[]>
  
  // 3. Last-minute deal detection
  async scrapeLastMinuteDeals(): Promise<AirfareDeal[]>
  
  // 4. Long-haul international deals
  async scrapeInternationalDeals(): Promise<AirfareDeal[]>
  
  // 5. Deal quality assessment
  async assessDealQuality(deal: AirfareDeal): Promise<number>
}
```

**Scheduling & Automation:**
- **Morning Scrape** (6 AM): Fresh deals from overnight price changes
- **Midday Check** (12 PM): Airline flash sales and promotions
- **Evening Update** (6 PM): End-of-day pricing adjustments
- **Weekend Intensive** (Saturday): Comprehensive route analysis

#### 9.5 Content Generation Integration

**Automated Content Suggestions:**
```typescript
interface DealContentSuggestion {
  dealId: string
  contentType: 'article' | 'social_post' | 'newsletter_item'
  suggestedTitle: string
  suggestedContent: string
  targetAudience: string[]
  urgency: 'high' | 'medium' | 'low'
  estimatedValue: number  // Potential traffic/engagement value
}
```

**Content Templates:**
1. **Breaking Deal Articles**: "Flash Sale: $299 NYC to London on Virgin Atlantic"
2. **Route Analysis**: "Best Time to Book: LAX to Tokyo Pricing Trends"
3. **Destination Spotlights**: "Why This $450 Deal to Iceland is Perfect for Fall"
4. **Comparison Articles**: "5 Incredible European Deals Under $400 This Week"

#### 9.6 AI-Powered Deal Analysis

**Machine Learning Components:**
```typescript
class DealIntelligenceEngine {
  // Predict deal lifespan
  async predictDealDuration(deal: AirfareDeal): Promise<number>
  
  // Assess content potential
  async calculateContentValue(deal: AirfareDeal): Promise<number>
  
  // Generate writing suggestions
  async generateContentIdeas(deals: AirfareDeal[]): Promise<DealContentSuggestion[]>
  
  // Price trend analysis
  async analyzePriceTrends(route: string, timespan: number): Promise<PriceTrend>
}
```

**Content Automation Features:**
- **Auto-Draft Creation**: Generate article drafts for exceptional deals
- **Social Media Posts**: Auto-create Twitter/Instagram content
- **Newsletter Integration**: Populate deal sections automatically
- **Urgency Scoring**: Prioritize deals by booking urgency

#### 9.7 Integration with CMS

**BlockNote Editor Integration:**
```typescript
// Custom BlockNote block for airfare deals
const AirfareDealBlock = {
  type: 'airfare-deal',
  props: {
    dealId: string,
    displayMode: 'card' | 'inline' | 'table'
  },
  render: ({ props }) => <AirfareDealDisplay {...props} />
}
```

**Admin Dashboard Enhancements:**
- **Deal Dashboard**: Real-time deal monitoring and content suggestions
- **Route Performance**: Historical pricing and content performance correlation
- **Content Pipeline**: Automated article creation from deals
- **Alert System**: Notification for exceptional deals requiring immediate content

#### 9.8 Compliance & Ethics

**Legal Considerations:**
- **Rate Limiting**: Respectful scraping with appropriate delays
- **Terms of Service**: Compliance with all source website terms
- **Data Attribution**: Proper crediting of deal sources
- **GDPR Compliance**: User data protection for deal alerts

**Quality Controls:**
- **Deal Verification**: Multiple source confirmation
- **Price Accuracy**: Real-time validation before publishing
- **Booking Link Testing**: Automated link verification
- **Historical Tracking**: Deal success rate monitoring

## Technical Specifications

### 10. API Architecture

#### 10.1 Backend API Structure
```
/api/
├── auth/           # Authentication endpoints
├── admin/          # Admin-specific operations
│   ├── upload/     # Media upload processing
│   ├── images/     # Image metadata management
│   └── users/      # User management
├── articles/       # Article CRUD operations
├── categories/     # Category management
├── seo/            # SEO analysis endpoints
├── deals/          # Airfare deal management (Phase 4)
├── scraping/       # Deal scraping endpoints (Phase 4)
└── health/         # System health checks
```

#### 10.2 Database Schema (Current + Future)
**Core Tables:**
- `articles` - Main content storage
- `categories` - Content categorization
- `subcategories` - Hierarchical categorization
- `users` - Admin user management
- `image_metadata` - Media file tracking
- `article_relations` - Internal linking (Phase 2)
- `airfare_deals` - Deal data storage (Phase 4)
- `price_history` - Historical pricing (Phase 4)

### 11. Security & Performance

#### 11.1 Security Measures
- **CSP Headers**: Content Security Policy for XSS prevention
- **JWT Authentication**: Secure token-based auth
- **Input Sanitization**: DOMPurify for content cleaning
- **File Upload Security**: Type validation, size limits
- **Environment Separation**: Development/production configurations

#### 11.2 Performance Optimizations
- **Image Optimization**: Automatic compression and format conversion
- **Content Caching**: Hash-based caching for SEO analysis
- **Lazy Loading**: Dynamic component loading
- **Bundle Optimization**: Next.js built-in optimizations

## Development Roadmap

### Phase 1: Backend Integration (Current Priority)
- [ ] Connect admin pages to new backend API
- [ ] Implement article CRUD operations
- [ ] Complete media management integration
- [ ] User management backend connection

### Phase 2: Internal Linking Engine (New Feature)
- [ ] Design and implement similarity algorithms
- [ ] Create article relationship database schema
- [ ] Build suggestion API endpoints
- [ ] Develop frontend linking interface
- [ ] Implement real-time suggestion engine

### Phase 3: Advanced Features
- [ ] Enhanced SEO recommendations
- [ ] Content performance analytics
- [ ] Advanced media processing
- [ ] Multi-user collaboration features

### Phase 4: AI Enhancement & Travel Data Intelligence
- [ ] Machine learning-based content optimization
- [ ] Automated tag suggestions
- [ ] Content quality scoring improvements
- [ ] Predictive analytics for content performance
- [ ] **AI-Powered BlockNote Extensions**: Smart content blocks with ML suggestions
- [ ] **Daily Airfare Scraping System**: Automated deal discovery and content generation
- [ ] **Travel Price Intelligence**: Real-time monitoring and alert system

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint validation
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load testing for article analysis
- **Security Tests**: Authentication and authorization validation

### Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code style enforcement
- **Prettier**: Consistent code formatting
- **Component Documentation**: Comprehensive JSDoc comments
- **API Documentation**: OpenAPI/Swagger specifications

## Conclusion

The Max Your Points CMS represents a sophisticated, custom-built content management system tailored specifically for travel and points content. With its advanced SEO analysis, semantic HTML validation, intelligent media processing, and planned internal linking engine, it provides a comprehensive solution for high-quality content creation and optimization.

The upcoming Internal Article Linking Engine will significantly enhance content discoverability and SEO performance by intelligently suggesting relevant internal links based on multiple content analysis metrics, making it a standout feature in the travel content management space. 