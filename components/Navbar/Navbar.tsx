"use client"

import React, { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GradientButton } from "@/components/ui/gradient-button"
import { categories, getCategoryPath } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { SubscribeDropdown } from "@/components/SubscribeDropdown/SubscribeDropdown"
import { SubscriptionSuccess } from "@/components/blog/SubscriptionSuccess"
import { CategoryDropdown } from "./CategoryDropdown"

interface NavItem {
  label: string
  href: string
}

const navigationItems: NavItem[] = [
  { label: "Credit Cards & Points", href: "/blog/categories/credit-cards-and-points" },
  { label: "Airlines & Aviation", href: "/blog/categories/airlines-and-aviation" },
  { label: "Hotels & Trip Reports", href: "/blog/categories/hotels-and-trip-reports" },
  { label: "Travel Hacks & Deals", href: "/blog/categories/travel-hacks-and-deals" }
]

interface MobileNavLinkProps {
  href: string
  onClick?: () => void
  children: React.ReactNode
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, onClick, children }) => {
  return (
    <Link href={href} onClick={onClick}>
      <div className="text-stone-950 text-base font-medium font-['Inter'] leading-normal hover:text-orange-500 transition-colors">
        {children}
      </div>
    </Link>
  )
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successEmail, setSuccessEmail] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubscriptionSuccess = (email: string) => {
    setSuccessEmail(email)
    setShowSuccess(true)
    setIsSubscribeOpen(false)
  }

  return (
    <>
      <nav
        className={`w-full h-16 px-4 md:px-16 bg-emerald-50 flex items-center justify-between fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Logo - Left side with defined width */}
        <div className="flex items-center w-80 flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/max_your_points-logo.png"
              alt="Max Your Points Logo"
              width={400}
              height={150}
              className="h-32 w-auto"
              priority
              sizes="(max-width: 768px) 200px, 400px"
              quality={95}
            />
          </Link>
        </div>

        {/* Desktop Navigation - Center with proper spacing */}
        <div className="hidden lg:flex justify-center flex-1 px-8">
          <CategoryDropdown />
        </div>

        {/* Subscribe Button - Right side */}
        <div className="hidden md:flex items-center w-32 justify-end flex-shrink-0">
          <GradientButton onClick={() => setIsSubscribeOpen(true)}>
            Subscribe
          </GradientButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center ml-auto">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-stone-950 focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-40 transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out lg:hidden`}
          style={{ top: "64px" }}
        >
          <div className="flex flex-col p-5 space-y-5">
            {navigationItems.map((item, index) => (
              <MobileNavLink
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </MobileNavLink>
            ))}
            <div className="pt-5">
              <GradientButton onClick={() => {
                setIsMenuOpen(false)
                setIsSubscribeOpen(true)
              }}>
                Subscribe
              </GradientButton>
            </div>
          </div>
        </div>
      </nav>

      <SubscribeDropdown 
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSuccess={handleSubscriptionSuccess}
      />

      <SubscriptionSuccess
        isVisible={showSuccess}
        email={successEmail}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

export default Navbar 