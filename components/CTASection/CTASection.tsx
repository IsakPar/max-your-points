"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SubscriptionSuccess } from "@/components/blog/SubscriptionSuccess"

type DesignType = 'gradient-teal' | 'gradient-orange' | 'pattern-dots' | 'pattern-lines' | 'overlay-teal'

interface CTASectionProps {
  title?: string
  description?: string
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary'
  className?: string
  withSubscribeForm?: boolean
  onSubscribe?: ((email: string) => Promise<void>) | null
  redirectUrl?: string | null
  design?: DesignType
}

interface CustomButtonProps {
  href?: string
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const CTASection = ({
  title = "Stay Updated with Our Insights",
  description = "Subscribe to our newsletter for exclusive travel tips and the latest updates in travel rewards.",
  buttonText = "Subscribe",
  buttonVariant = "primary",
  className = "",
  withSubscribeForm = true,
  onSubscribe = null,
  redirectUrl = null,
  design = "gradient-teal",
}: CTASectionProps) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  // Design styles
  const designStyles = {
    "gradient-teal": {
      container: "bg-gradient-to-br from-emerald-50 to-teal-100",
      wrapper: "bg-gradient-to-br from-teal-500/10 to-emerald-500/20 backdrop-blur-sm",
      title: "text-stone-900",
      description: "text-stone-700",
      input: "bg-white/80 border-teal-200 text-stone-900 placeholder-gray-500 focus:border-teal-400",
    },
    "gradient-orange": {
      container: "bg-gradient-to-br from-amber-50 to-orange-100",
      wrapper: "bg-gradient-to-br from-orange-500/10 to-amber-500/20 backdrop-blur-sm",
      title: "text-stone-900",
      description: "text-stone-700",
      input: "bg-white/80 border-orange-200 text-stone-900 placeholder-gray-500 focus:border-orange-400",
    },
    "pattern-dots": {
      container:
        "bg-emerald-50 bg-[radial-gradient(circle,_rgba(45,212,191,0.15)_1px,_transparent_1px)] bg-[length:20px_20px]",
      wrapper: "bg-white/60 backdrop-blur-sm",
      title: "text-stone-900",
      description: "text-stone-700",
      input: "bg-white/90 border-gray-200 text-stone-900 placeholder-gray-500",
    },
    "pattern-lines": {
      container:
        "bg-emerald-50 bg-[linear-gradient(45deg,rgba(45,212,191,0.1)_25%,transparent_25%,transparent_50%,rgba(45,212,191,0.1)_50%,rgba(45,212,191,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]",
      wrapper: "bg-white/60 backdrop-blur-sm",
      title: "text-stone-900",
      description: "text-stone-700",
      input: "bg-white/90 border-gray-200 text-stone-900 placeholder-gray-500",
    },
    "overlay-teal": {
      container: "bg-teal-600",
      wrapper: "bg-gradient-to-br from-teal-600/90 to-emerald-600/90",
      title: "text-white",
      description: "text-teal-100",
      input: "bg-white/20 border-teal-400/30 text-white placeholder-teal-100/70 focus:border-white",
    },
  }

  const currentDesign = designStyles[design] || designStyles["gradient-teal"]

  // Custom button with inline styles for precise gradient control
  const CustomButton = ({ href, children, type, disabled }: CustomButtonProps) => {
    const style = {
      background: "linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
      backgroundSize: "200% 100%",
      backgroundPosition: "0% 50%",
      transition: "background-position 0.5s ease",
    }

    const buttonContent = (
      <button
        type={type}
        disabled={disabled}
        className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl shadow-md text-white disabled:opacity-70 disabled:cursor-not-allowed"
        style={style}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundPosition = "100% 50%"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundPosition = "0% 50%"
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setSubmitStatus("error")
      setErrorMessage("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      if (onSubscribe) {
        // Use the provided custom handler
        await onSubscribe(email)
      } else {
        // Use our API endpoint
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error("Subscription failed")
        }
      }
      setShowSuccess(true)
      setSubmitStatus("success")
      // Don't clear email immediately so it shows in the success popup
      setTimeout(() => setEmail(""), 5000)

      // Redirect if URL is provided
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 2000)
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine success/error message background based on design
  const successBgClass = design.includes("overlay") ? "bg-emerald-500/30" : "bg-emerald-100"
  const successTextClass = design.includes("overlay") ? "text-white" : "text-emerald-800"
  const errorBgClass = design.includes("overlay") ? "bg-red-500/30" : "bg-red-100"
  const errorTextClass = design.includes("overlay") ? "text-white" : "text-red-800"

  return (
    <>
      <section
        className={`w-full max-w-[1440px] px-4 md:px-16 py-12 md:py-20 flex flex-col justify-start items-center gap-8 overflow-hidden ${className}`}
      >
        <div
          className={`self-stretch p-6 md:p-12 ${currentDesign.wrapper} rounded-xl flex flex-col justify-between items-center overflow-hidden shadow-lg border border-white/20`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-4">
              <h2 className={`self-stretch ${currentDesign.title} text-2xl md:text-4xl font-bold leading-tight`}>
                {title}
              </h2>
              <p className={`self-stretch ${currentDesign.description} text-base md:text-lg font-medium leading-relaxed`}>
                {description}
              </p>
              <p className={`self-stretch ${currentDesign.description} text-sm opacity-75`}>
                You can unsubscribe at any time by visiting maxyourpoints.com/unsubscribe
              </p>
            </div>

            {withSubscribeForm ? (
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                  <div className="flex flex-col gap-4">
                    {/* Error message only (success will use popup) */}
                    {submitStatus === "error" && (
                      <div className={`p-3 rounded-lg ${errorBgClass} flex items-center gap-2`}>
                        <AlertCircle size={16} className={errorTextClass} />
                        <span className={`text-sm ${errorTextClass}`}>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                                             <input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="Enter your email"
                         className={`flex-1 px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${currentDesign.input}`}
                         disabled={isSubmitting}
                         required
                       />
                      <CustomButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Subscribing..." : buttonText}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full md:w-auto flex justify-center md:justify-end">
                <CustomButton href={redirectUrl || "/subscribe"}>
                  {buttonText}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </section>

      <SubscriptionSuccess
        isVisible={showSuccess}
        email={email}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

export default CTASection
