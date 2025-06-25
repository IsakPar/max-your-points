"use client"

import * as React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-stone-950 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-stone-600 mb-6">
          Oops! The page you're looking for seems to have taken a detour. Let's get you back on track.
        </p>
        
        {/* Custom message */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-6 mb-8 shadow-sm">
          <p className="text-sm text-stone-600 leading-relaxed">
            This website was built by <span className="font-semibold text-stone-800">Isak Parild</span>. 
            If you think I've made a mistake or if you believe this page should exist, 
            please <a href="mailto:contact@max-your-points.com" className="text-blue-600 hover:text-blue-800 underline decoration-blue-600/30 hover:decoration-blue-800 transition-colors">contact us</a> and let me know.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 text-base font-medium text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2DD4BF, #EAB308, #EA580C)",
              backgroundSize: "200% 200%",
              backgroundPosition: "0% 50%",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundPosition = "100% 50%"
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundPosition = "0% 50%"
            }}
          >
            Return Home
          </Link>

          <div className="text-stone-500 text-sm font-medium">or</div>

          <Link
            href="/about"
            className="inline-block px-8 py-4 text-base font-medium text-stone-700 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-xl shadow-md hover:shadow-lg hover:bg-white/90 hover:border-stone-300 transition-all duration-300 transform hover:scale-105"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </main>
  )
} 