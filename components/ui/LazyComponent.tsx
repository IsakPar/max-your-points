"use client"

import { useState, useEffect, useRef, ReactNode } from 'react'

interface LazyComponentProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
}

const LazyComponent = ({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded" />, 
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}: LazyComponentProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentElement = elementRef.current
    
    if (!currentElement) return

    // Use Intersection Observer to lazy load components
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(currentElement)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(currentElement)

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

export default LazyComponent 