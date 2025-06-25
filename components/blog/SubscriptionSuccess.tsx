"use client"

import * as React from "react"
import { CheckCircle2, Mail, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SubscriptionSuccessProps {
  isVisible: boolean
  email: string
  onClose: () => void
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 6000) // Extended to 6 seconds for better user experience
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  // Prevent scrolling when popup is open
  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9998] flex items-center justify-center p-4"
            onClick={onClose}
          />
          
          {/* Success popup - Perfect centering */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 30 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.5
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-emerald-100/50 w-full max-w-md mx-auto relative pointer-events-auto transform"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)'
              }}
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/20 to-teal-500/20 p-[1px]">
                <div className="bg-white rounded-3xl h-full w-full" />
              </div>
              
              {/* Main content */}
              <div className="relative p-8 sm:p-10">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 rounded-full p-1 z-10"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="text-center">
                  {/* Success icon with enhanced animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.2, 
                      type: "spring", 
                      damping: 15,
                      stiffness: 200
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Thank you message */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900 mb-3"
                  >
                    Thank You! 🎉
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-gray-600 mb-6 text-lg"
                  >
                    You've successfully subscribed to our newsletter!
                  </motion.p>

                  {/* Email confirmation with enhanced styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-100"
                  >
                    <div className="flex items-center gap-3 justify-center mb-2">
                      <Mail className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-emerald-800 font-semibold">
                        Check your email for confirmation
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium bg-white/50 rounded-lg px-3 py-1 inline-block">
                      Sent to: {email}
                    </p>
                  </motion.div>

                  {/* Additional message */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-gray-600 mb-4 leading-relaxed"
                  >
                    Get ready for exclusive travel tips, deals, and insights to maximize your points!
                  </motion.p>

                  {/* Unsubscribe link */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-xs text-gray-500 leading-relaxed"
                  >
                    You can unsubscribe at any time by visiting{" "}
                    <a 
                      href="/unsubscribe" 
                      className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      maxyourpoints.com/unsubscribe
                    </a>
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 