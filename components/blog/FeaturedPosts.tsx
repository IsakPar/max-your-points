"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BlogPost } from "@/lib/posts"

interface FeaturedPostsProps {
  posts: BlogPost[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="py-24 bg-teal-50">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16">
        {posts.map((post, index) => (
          <div key={post.id} className="mb-24 last:mb-0">
            <div className="bg-teal-50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-[1.05] hover:bg-[#D1F1EB] hover:-translate-y-2 cursor-pointer border border-transparent hover:border-teal-200 group">
              <div className={`flex flex-col lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}>
                {/* Image Column */}
                <div className="flex-1">
                  <div className="relative aspect-[4/3]">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center relative">
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
                    )}
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="flex-1 p-8">
                  <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-gray-200 text-gray-700 group-hover:bg-teal-600 group-hover:text-white backdrop-blur-sm rounded-full text-sm font-medium transition-colors duration-500">
                      {post.tag}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 group-hover:text-stone-900 group-hover:scale-105 transition-all duration-500 transform-gpu">
                      {post.title}
                    </h2>
                    <p className="text-base text-stone-950 leading-relaxed group-hover:text-stone-800 transition-colors duration-500">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm font-medium text-stone-900 group-hover:text-stone-800 transition-colors duration-500">
                          {post.author}
                        </div>
                        <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-500">
                          {post.date}
                        </div>
                      </div>
                      <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-500">
                        {post.readTime} min read
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-stone-950 font-bold font-['Inter'] group-hover:text-stone-800 transition-colors duration-500 group/link"
                    >
                      Read More
                      <svg
                        className="w-6 h-6 transition-transform duration-500 group-hover/link:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 