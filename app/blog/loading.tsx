"use client"

import * as React from "react"

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Loading spinner with gradient */}
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full border-4 border-transparent animate-spin"
              style={{
                background: "linear-gradient(135deg, #2DD4BF, #EAB308, #EA580C)",
                backgroundSize: "200% 200%",
                animation: "spin 1s linear infinite, gradient 2s ease-in-out infinite alternate",
              }}
            />
            <div className="absolute inset-2 bg-emerald-50 rounded-full"></div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-stone-800 mb-2">Loading Blog</h2>
            <p className="text-lg text-stone-600 mb-4">
              Fetching the latest travel insights for you
            </p>
            <p className="text-sm text-stone-500">
              Loading articles about maximizing your travel rewards...
            </p>
          </div>
          
          {/* Simulated article placeholders */}
          <div className="w-full max-w-md space-y-3">
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-3 bg-stone-200 rounded w-3/4"></div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-3 bg-stone-200 rounded w-2/3"></div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-stone-200 rounded mb-2"></div>
              <div className="h-3 bg-stone-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  )
} 