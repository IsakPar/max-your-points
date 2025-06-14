"use client"

import React, { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { categories, getCategoryPath } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { SubscribeDropdown } from "@/components/SubscribeDropdown/SubscribeDropdown"

interface NavItem {
  label: string
  href: string
}

const navigationItems: NavItem[] = [
  { label: "Credit Cards & Points", href: "/blog/categories/credit-cards-and-points" },
  { label: "Airlines & Aviation", href: "/blog/categories/airline-and-aviation" },
  { label: "Hotels & Trip Reports", href: "/blog/categories/hotels-and-trip-reports" },
  { label: "Travel Hacks & Deals", href: "/blog/categories/travel-hacks-and-deals" }
]

interface MobileNavLinkProps {
  href: string
  onClick?: () => void
  children: React.ReactNode
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, onClick, children }) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-stone-950 text-base font-medium font-['Inter'] py-2 border-b border-gray-100 hover:text-orange-500 transition-colors"
  >
    {children}
  </Link>
)

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)

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

  return (
    <>
      <nav
        className={`w-full h-16 px-4 md:px-16 bg-emerald-50 flex items-center justify-between fixed top-0 left-0 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="w-20 h-9 relative overflow-hidden">
            <div className="w-16 h-9 left-[6.67px] top-0 absolute overflow-hidden">
              <div className="left-[50.82px] top-[10.87px] absolute">
                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.9112 7.08161L16.8741 7.11881C17.1343 6.41261 17.6546 6.15241 18.1006 6.15241C18.7325 6.15241 19.29 6.63561 19.29 7.34181C19.29 7.49051 19.29 7.67631 19.2157 7.89931C17.9148 11.2445 15.1643 12.9542 12.4882 13.2144C11.2617 15.2958 9.25461 16.8197 6.39261 16.8197C2.30411 16.8197 0.48291 13.5861 0.48291 10.0551C0.48291 5.70641 3.23341 0.874512 7.84221 0.874512C8.84571 0.874512 9.70061 1.09761 10.4068 1.39491C12.4882 2.17541 13.8263 4.88871 13.8263 7.78781C13.8263 8.71701 13.7519 9.64621 13.5289 10.5383C14.9042 10.0551 16.205 8.94001 16.9112 7.08161ZM9.14311 3.92231V3.88521C8.32541 3.88521 7.84221 4.96301 7.84221 6.26391C7.84221 8.15951 8.88291 9.90641 10.5183 10.5383C10.7785 9.72061 10.89 8.79141 10.89 7.71351C10.89 5.63211 10.2581 3.92231 9.14311 3.92231ZM6.42981 14.1064C7.47051 14.1064 8.51121 13.6604 9.32891 12.7312C6.91301 11.6533 5.38911 9.12591 5.38911 6.70991C5.38911 5.89221 5.53781 5.03741 5.76081 4.29401C4.27411 5.52061 3.41921 7.93651 3.41921 10.0551C3.41921 12.8055 4.72011 14.1064 6.42981 14.1064Z"
                    fill="#0D0500"
                  />
                </svg>
              </div>
              <div className="left-[34.33px] top-[11.32px] absolute">
                <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.0568 6.08131L17.0196 6.11851C17.2798 5.41231 17.7258 5.11501 18.1718 5.11501C18.8037 5.11501 19.4355 5.67251 19.4355 6.37871C19.4355 6.56451 19.3984 6.71321 19.324 6.89901C17.8745 10.43 15.7187 14.5557 12.2621 16.9716L12.1878 17.715C11.7789 22.1752 9.51169 24.9999 6.64969 24.9999C4.49389 24.9999 3.23018 23.5132 3.23018 21.7663C3.23018 18.607 6.46379 17.4548 9.47449 15.5221C9.54879 14.7415 9.58599 13.8495 9.62309 12.8459C8.13639 14.4813 6.53818 15.1504 5.12578 15.1504C2.30098 15.1504 -0.00341797 12.8459 -0.00341797 9.31501C-0.00341797 3.88841 3.56468 0.320312 7.54169 0.320312H7.57889C10.2922 0.320312 13.1913 1.76981 13.1913 4.37161C13.1913 5.22651 12.8196 9.87251 12.5223 13.4778C14.5293 11.5822 16.2019 8.49731 17.0568 6.08131ZM5.53459 12.4743C6.90989 12.4743 8.76828 11.6194 9.92048 7.41941C10.1063 6.49021 10.2178 5.67251 10.1807 4.70611C9.95769 3.70261 9.10279 3.10791 7.87618 3.10791C5.34878 3.10791 2.93288 5.52381 2.93288 9.20351C2.93288 11.4336 3.97358 12.4743 5.53459 12.4743ZM6.94698 22.2867H6.98419C7.76469 22.2867 8.61958 21.7663 9.17708 18.4212C7.54168 19.3875 6.01779 20.3539 6.01779 21.5061C6.01779 21.9893 6.38948 22.2867 6.94698 22.2867Z"
                    fill="#0D0500"
                  />
                </svg>
              </div>
              <div className="left-[18.55px] top-[10.87px] absolute">
                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.6485 7.08161L16.6114 7.11881C16.8715 6.41261 17.3919 6.15191 17.8379 6.15191C18.4698 6.15191 19.0273 6.63511 19.0273 7.34131C19.0273 7.49001 19.0273 7.67631 18.953 7.89931C17.6521 11.2445 14.9016 12.9542 12.2255 13.2144C10.999 15.2958 8.99191 16.8197 6.12991 16.8197C2.04141 16.8197 0.220215 13.5861 0.220215 10.0551C0.220215 5.70641 2.97061 0.874512 7.57951 0.874512C8.58301 0.874512 9.43791 1.09761 10.1441 1.39491C12.2255 2.17541 13.5636 4.88871 13.5636 7.78781C13.5636 8.71701 13.4892 9.64621 13.2662 10.5383C14.6415 10.0551 15.9423 8.94001 16.6485 7.08161ZM8.88041 3.92231V3.88521C8.06271 3.88521 7.57951 4.96301 7.57951 6.26391C7.57951 8.15951 8.62021 9.90641 10.2556 10.5383C10.5158 9.72061 10.6273 8.79141 10.6273 7.71351C10.6273 5.63211 9.99541 3.92231 8.88041 3.92231ZM6.16711 14.1064C7.20781 14.1064 8.24851 13.6604 9.06621 12.7312C6.65031 11.6533 5.12641 9.12591 5.12641 6.70991C5.12641 5.89221 5.27511 5.03741 5.49811 4.29401C4.01141 5.52061 3.15651 7.93651 3.15651 10.0551C3.15651 12.8055 4.45741 14.1064 6.16711 14.1064Z"
                    fill="#0D0500"
                  />
                </svg>
              </div>
              <div className="left-0 top-[10.24px] absolute">
                <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.1094 5.90851C20.589 5.90851 20.143 6.16871 19.8456 6.87491C18.8793 9.32801 16.8721 13.4909 14.8278 13.4909C13.5406 13.4909 12.5445 13.1998 11.5379 12.9056C10.51 12.6052 9.47117 12.3015 8.10028 12.3015C7.61708 12.3015 6.94804 12.3759 6.31617 12.4874C8.21975 9.89161 8.93089 6.74791 9.61997 0.805611C8.32251 0.723011 7.2671 0.483311 6.49782 0.241211C5.67617 7.77771 4.74311 10.6513 1.33554 13.4909C0.889514 13.8626 0.666504 14.383 0.666504 14.9034C0.666504 15.7211 1.37272 16.4273 2.26477 16.4273C2.56212 16.4273 2.89663 16.3158 3.23115 16.1671C5.12677 15.3122 6.279 15.0892 7.69142 15.0892C8.58959 15.0892 9.66433 15.3461 10.815 15.621C12.1404 15.9378 13.5665 16.2786 14.9394 16.2786C17.95 16.2786 19.92 13.3423 22.1129 7.65541C22.2245 7.46961 22.2616 7.24661 22.2616 7.06071C22.2616 6.35451 21.7041 5.90851 21.1094 5.90851Z"
                    fill="#0D0500"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex justify-center items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-stone-950 text-sm font-medium font-['Inter'] leading-normal hover:text-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="hidden md:flex items-center">
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
      />
    </>
  )
}

export default Navbar 