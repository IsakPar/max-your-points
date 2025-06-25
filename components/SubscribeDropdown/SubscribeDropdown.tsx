"use client"

import React, { useState } from "react"
import { X, Mail } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"

interface SubscribeDropdownProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string) => void
}

export const SubscribeDropdown: React.FC<SubscribeDropdownProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Navbar subscribe button clicked!', email) // Debug log
    
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
      
      // Call the parent's success handler with the email
      onSuccess(email)
      
      // Clear email after delay (match CTA/Footer timing)
      setTimeout(() => setEmail(""), 5000)
    } catch (error) {
      console.error('Subscription error:', error) // Debug log
      alert("Failed to subscribe. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-25" onClick={onClose}>
      <div 
        className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-60"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 rounded-full p-1"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get the latest travel tips and credit card strategies delivered to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-500 text-gray-900"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <GradientButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </GradientButton>
        </form>
        
        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
          You can unsubscribe at any time by visiting{" "}
          <span className="text-emerald-600 font-medium">maxyourpoints.com/unsubscribe</span>
        </p>
      </div>
    </div>
  )
} 