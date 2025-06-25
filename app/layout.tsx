import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { CookieConsentBanner } from "@/components/CookieConsentBanner"
import Script from "next/script"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: "Max Your Points - Travel Rewards & Points Optimization",
  description: "Discover how to maximize your travel rewards points and credit card benefits. Expert tips on flights, hotels, and travel hacking for savvy travelers.",
  keywords: "travel rewards, credit card points, airline miles, hotel points, travel hacking",
  authors: [{ name: "Max Your Points" }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#D1F1EB',
}

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://maxyourpoints.com",
  "name": "MaxYourPoints",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://maxyourpoints.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Max Your Points",
  "url": siteUrl,
  "logo": `${siteUrl}/max_your_points-logo.png`,
  "description": "Travel rewards and points optimization expert guidance.",
  "sameAs": [
    "https://twitter.com/maxyourpoints",
    "https://facebook.com/maxyourpoints"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Content Security Policy optimized for Safari compatibility
  // In development mode (Next.js dev server), allow localhost:3005 for backend API
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  // CSP configuration for development
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;
    style-src 'self' 'unsafe-inline' https: data:;
    img-src 'self' data: https: blob:;
    font-src 'self' https: data:;
    connect-src 'self' https: wss: data: ${isDevelopment ? 'http://localhost:3005' : ''};
    media-src 'self' https: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    worker-src 'self' blob:;
    child-src 'self' blob:;
  `.replace(/\s+/g, ' ').trim()

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/max_your_points_favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/max_your_points_favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/max_your_points_favicon.png" />
        <link rel="shortcut icon" href="/max_your_points_favicon.png" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/aircraft-landing.jpg"
          as="image"
          type="image/jpeg"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//vercel.live" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
        <SpeedInsights />
        <Analytics />
        <Toaster position="bottom-right" />
        
        
        {/* Load non-critical scripts after page load */}
        <Script
          id="performance-observer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Observe and log performance metrics
              if ('PerformanceObserver' in window) {
                try {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                      }
                      if (entry.entryType === 'first-input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                      }
                    }
                  });
                  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
                } catch (e) {
                  console.log('Performance observer not supported');
                }
              }
              
              // Reduce main thread blocking
              if ('scheduler' in window && 'postTask' in window.scheduler) {
                window.scheduler.postTask(() => {
                  // Defer non-critical operations
                }, { priority: 'background' });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
