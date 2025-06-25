"use client"

import React, { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
}

export const ScrollReveal = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  duration = 600,
  threshold = 0.1 
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [delay, threshold])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(50px)'
      case 'down':
        return 'translateY(-50px)'
      case 'left':
        return 'translateX(50px)'
      case 'right':
        return 'translateX(-50px)'
      case 'fade':
        return 'scale(0.8)'
      default:
        return 'translateY(50px)'
    }
  }

  const getVisibleTransform = () => {
    switch (direction) {
      case 'fade':
        return 'scale(1)'
      default:
        return 'translate(0)'
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? getVisibleTransform() : getInitialTransform(),
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}

export default ScrollReveal 