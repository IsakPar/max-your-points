"use client"

import * as React from "react"
import Link from "next/link"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  children: React.ReactNode
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ href, children, className = "", ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const baseClasses = "px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl shadow-md text-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-500 ease-in-out"
    
    const style = {
      background: "linear-gradient(90deg, #2DD4BF, #EAB308, #EA580C)",
      backgroundSize: "200% 100%",
      backgroundPosition: isHovered ? "100% 50%" : "0% 50%",
      transition: "background-position 0.5s ease-in-out",
    } as React.CSSProperties

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    if (href) {
      return (
        <Link 
          href={href} 
          className="inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className={`inline-block ${baseClasses} ${className}`}
            style={style}
          >
            {children}
          </span>
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton } 