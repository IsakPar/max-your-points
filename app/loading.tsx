"use client"

import * as React from "react"

export default function Loading() {
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
            <h2 className="text-2xl font-semibold text-stone-800 mb-2">Loading...</h2>
            <p className="text-lg text-stone-600">
              Getting things ready for you
            </p>
          </div>
          
          {/* Pulsing dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
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