"use client"

import React from 'react'
import { Article } from '@/lib/types'
import Head from 'next/head'

interface BlogPostContentProps {
  article: Article
}

// Rich text renderer component for Payload's lexical content
function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null
  
  // Handle Payload's lexical content structure
  if (content.root && content.root.children) {
    return (
      <div className="prose prose-lg max-w-none">
        {content.root.children.map((child: any, index: number) => {
          if (child.type === 'paragraph') {
            return (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {child.children?.map((textChild: any, textIndex: number) => (
                  <span key={textIndex}>{textChild.text}</span>
                ))}
              </p>
            )
          }
          
          if (child.type === 'heading') {
            const headingLevel = child.tag || 2
            if (headingLevel === 1) {
              return (
                <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4">
                  {child.children?.map((textChild: any, textIndex: number) => (
                    <span key={textIndex}>{textChild.text}</span>
                  ))}
                </h1>
              )
            }
            if (headingLevel === 2) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4">
                  {child.children?.map((textChild: any, textIndex: number) => (
                    <span key={textIndex}>{textChild.text}</span>
                  ))}
                </h2>
              )
            }
            if (headingLevel === 3) {
              return (
                <h3 key={index} className="text-xl font-bold text-gray-900 mb-4">
                  {child.children?.map((textChild: any, textIndex: number) => (
                    <span key={textIndex}>{textChild.text}</span>
                  ))}
                </h3>
              )
            }
            return (
              <h4 key={index} className="text-lg font-bold text-gray-900 mb-4">
                {child.children?.map((textChild: any, textIndex: number) => (
                  <span key={textIndex}>{textChild.text}</span>
                ))}
              </h4>
            )
          }
          
          // Handle quote blocks
          if (child.type === 'quote') {
            return (
              <blockquote key={index} className="border-l-4 border-emerald-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg">
                <p className="text-lg font-medium text-gray-800 italic">"{child.quote}"</p>
                {child.author && (
                  <footer className="mt-2 text-sm text-gray-600">
                    — {child.author}
                    {child.source && <span>, {child.source}</span>}
                  </footer>
                )}
              </blockquote>
            )
          }
          
          // Handle callout blocks
          if (child.type === 'callout') {
            const bgColor = child.calloutType === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                            child.calloutType === 'error' ? 'bg-red-50 border-red-200' :
                            'bg-blue-50 border-blue-200'
            
            return (
              <div key={index} className={`border-l-4 p-6 my-6 rounded-r-lg ${bgColor}`}>
                {child.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">{child.title}</h4>
                )}
                <div className="text-gray-700">
                  <RichTextRenderer content={{ root: { children: child.content } }} />
                </div>
              </div>
            )
          }
          
          return null
        })}
      </div>
    )
  }
  
  return <div className="prose prose-lg max-w-none">{JSON.stringify(content)}</div>
}

export default function BlogPostContent({ article }: BlogPostContentProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'
  
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.summary,
    "image": article.heroImage && typeof article.heroImage === 'object' 
      ? `${siteUrl}${article.heroImage.url}` 
      : "",
    "author": {
      "@type": "Person",
      "name": "MaxYourPoints Team"
    },
    "datePublished": article.publishedAt,
    "publisher": {
      "@type": "Organization",
      "name": "MaxYourPoints",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/max_your_points-logo.png`
      }
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": typeof article.category === 'object' ? article.category.name : 'Category',
        "item": `${siteUrl}/blog/categories/${typeof article.category === 'object' ? article.category.slug : 'category'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${siteUrl}/blog/${article.slug}`
      }
    ]
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Image */}
        {article.heroImage && typeof article.heroImage === 'object' && (
          <div className="mb-8">
            <img
              src={`${siteUrl}${article.heroImage.url}`}
              alt={article.heroImage.alt || article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}
        
        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-3 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-sm font-medium">
              {typeof article.category === 'object' ? article.category.name : 'Category'}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          {/* Summary */}
          {article.summary && (
            <p className="text-xl text-stone-600 mb-6 leading-relaxed">
              {article.summary}
            </p>
          )}
          
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-gray-500 text-sm border-b border-gray-200 pb-6">
            <span>Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            {article.tags && article.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {article.tags.slice(0, 3).map((tagItem, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {typeof tagItem === 'object' ? tagItem.tag : tagItem}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>
        
        {/* Content */}
        <article className="mb-12">
          <RichTextRenderer content={article.content} />
        </article>
        
        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {article.relatedArticles.slice(0, 4).map((relatedArticle, index) => {
                if (typeof relatedArticle !== 'object') return null
                
                return (
                  <a
                    key={index}
                    href={`/blog/${relatedArticle.slug}`}
                    className="block bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {relatedArticle.heroImage && typeof relatedArticle.heroImage === 'object' && (
                      <div className="aspect-[16/9] bg-gray-200">
                        <img
                          src={`${siteUrl}${relatedArticle.heroImage.url}`}
                          alt={relatedArticle.heroImage.alt || relatedArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="px-2 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-xs font-medium">
                        {typeof relatedArticle.category === 'object' ? relatedArticle.category.name : 'Category'}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2 hover:text-emerald-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </>
  )
} 