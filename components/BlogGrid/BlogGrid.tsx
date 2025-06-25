"use client"

import * as React from "react"
import { type BlogPost } from "@/lib/posts"

interface BlogGridProps {
  posts: BlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="w-full bg-[#D1F1EB] py-12">
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Image Placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg transform rotate-3">
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                    <div className="w-10 h-5 rounded bg-white/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-28 h-3 rounded bg-white/20" />
                    <div className="w-20 h-3 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-sm font-medium">
                  {post.tag}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{post.author}</span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 