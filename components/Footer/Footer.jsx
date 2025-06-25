"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import { Button } from "../ui/button"
import { SubscriptionSuccess } from "../blog/SubscriptionSuccess"

const OutlinedGradientButton = ({ href, children, type, disabled, onClick }) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl text-stone-950 hover:text-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

const GradientLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const style = {
    background: isHovered ? "linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)" : "none",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: isHovered ? "transparent" : "black",
    transition: "all 0.3s ease",
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium cursor-pointer"
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  )
}

const Footer = () => {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    console.log('Subscribe button clicked!', email) // Debug log
    
    if (!email) {
      alert("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    console.log('Sending subscription request...') // Debug log

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      console.log('Response status:', response.status) // Debug log
      const responseData = await response.json()
      console.log('Response data:', responseData) // Debug log

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      console.log('Subscription successful!') // Debug log
      setShowSuccess(true)
      // Don't clear email immediately so it shows in the success popup
      setTimeout(() => setEmail(""), 5000)
    } catch (error) {
      console.error('Subscription error:', error) // Debug log
      alert("Failed to subscribe. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <footer className="bg-[#D1F1EB] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div>
                <Image 
                  src="/max_your_points-logo.png" 
                  alt="Max Your Points Logo" 
                  width={192}
                  height={192}
                  className="h-48 w-auto"
                />
              </div>
              <p className="text-gray-600">
                Helping you maximize your travel rewards and experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-emerald-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-gray-600 hover:text-emerald-600">
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-emerald-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-gray-600 hover:text-emerald-600">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-600 hover:text-emerald-600">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe & Social */}
            <div className="space-y-6">
              {/* Subscribe Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Stay Updated</h3>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                    disabled={isSubmitting}
                  />
                  <OutlinedGradientButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </OutlinedGradientButton>
                </form>
              </div>

              {/* Social Media Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Twitter size={20} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Max Your Points. All rights reserved.</p>
              <p className="text-gray-600">
                Built by{" "}
                <GradientLink href="https://impdigital.services">
                  IMP Digital Services
                </GradientLink>
              </p>
            </div>
          </div>
        </div>
      </footer>

      <SubscriptionSuccess
        isVisible={showSuccess}
        email={email}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

// Helper component for footer links
const FooterLink = ({ href, children }) => {
  return (
    <Link href={href} className="py-1 inline-flex justify-start items-start hover:text-orange-500 transition-colors">
      <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight hover:text-orange-500">
        {children}
      </div>
    </Link>
  )
}

// Helper component for social media icons
const SocialIcon = ({ icon, href }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-stone-100 transition-colors"
      aria-label="Social media link"
    >
      <div className="text-stone-950">{icon}</div>
    </Link>
  )
}

export default Footer
