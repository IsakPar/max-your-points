"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CTASection from "@/components/CTASection/CTASection"
import ScrollReveal from "@/components/ui/scroll-reveal"
import { 
  FlightIcon, 
  CreditCardIcon, 
  ChampagneIcon, 
  GlobeIcon, 
  LightbulbIcon, 
  CompassIcon, 
  CheckIcon,
  ArchitectureIcon,
  DesignIcon,
  RocketIcon,
  TargetIcon,
  BrainIcon,
  LightningIcon,
  ToolsIcon,
  ChartIcon
} from "@/components/ui/custom-icons"

export default function AboutPage() {
  const [expandedBio, setExpandedBio] = useState<string | null>(null)
  const [techDetailsExpanded, setTechDetailsExpanded] = useState(false)

  const toggleBio = (name: string) => {
    setExpandedBio(expandedBio === name ? null : name)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 bg-gradient-to-br from-teal-50 to-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-2xl">
                Hero Image
                <br />
                (Airplane Wing or Skyline)
              </div>
            </div>
            
            {/* Hero Text */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-stone-950 mb-6">
                  The People Behind the Points
                </h1>
                <p className="text-xl text-stone-700 leading-relaxed">
                  Real travelers. Real strategies. Real value.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition-all duration-300"
                onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Meet the Team
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-950 mb-12">How Max Your Points Started</h2>
          <div className="prose prose-lg mx-auto text-stone-700 leading-relaxed font-serif">
            <p className="text-xl mb-8">
              Travel should be smarter, more accessible, and more rewarding. What started as a passion project between two travel enthusiasts has grown into a comprehensive resource for maximizing your travel rewards and experiences.
            </p>
            <p className="text-lg">
              We believe that with the right knowledge and strategies, anyone can unlock incredible travel opportunities without breaking the bank. Our mission is to demystify the complex world of points, miles, and travel rewards, making luxury travel accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-4 md:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-stone-950 mb-16">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FlightIcon size={48} className="text-teal-600" animated={true} />,
                title: "Flight Hacks",
                description: "Fly business for less with smart routing, sweet spots, and mileage tricks."
              },
              {
                icon: <CreditCardIcon size={48} className="text-blue-600" animated={true} />,
                title: "Card Strategies",
                description: "Pick the best cards, earn faster, and unlock powerful rewards."
              },
              {
                icon: <ChampagneIcon size={48} className="text-amber-600" animated={true} />,
                title: "Elite Status",
                description: "Get lounges, upgrades, and perks—without spending a fortune."
              },
              {
                icon: <GlobeIcon size={48} className="text-emerald-600" animated={true} />,
                title: "Travel Smarter",
                description: "Turn points into unforgettable trips across the globe."
              }
            ].map((item, index) => (
              <ScrollReveal key={index} delay={index * 150} direction="up">
                <Card className="text-center p-8 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-300 hover:-translate-y-2 group h-full">
                    <CardContent className="space-y-4 h-full flex flex-col">
                      <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-stone-950">{item.title}</h3>
                      <p className="text-stone-600 flex-grow">{item.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white">
              Explore Our Guides
            </Button>
          </div>
        </div>
      </section>

      {/* Meet the Founders */}
      <section id="team-section" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-stone-950 mb-16">Our Founders</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Nigel Evans Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
                      Nigel's<br />Portrait
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-stone-950 mb-2">Nigel Evans</h3>
                      <p className="text-teal-600 font-semibold mb-4">Co-Founder</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Badge variant="outline" className="text-xs">🌍 50+ Countries</Badge>
                        <Badge variant="outline" className="text-xs">✈ BA Critic</Badge>
                        <Badge variant="outline" className="text-xs">🎤 Ex-MP</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    With extensive experience in aviation and politics, Nigel brings a unique perspective to travel optimization. His critical eye and insider knowledge help decode airline policies and maximize elite benefits.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleBio('nigel')}
                    className="w-full text-teal-600 hover:text-teal-800"
                  >
                    Read Full Bio
                    {expandedBio === 'nigel' ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Isak Parild Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm text-center shadow-lg">
                      Isak's<br />Portrait
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-stone-950 mb-2">Isak Parild</h3>
                      <p className="text-teal-600 font-semibold mb-4">Founder</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Badge variant="outline" className="text-xs">💻 Built from Scratch</Badge>
                        <Badge variant="outline" className="text-xs">🎯 Points Strategist</Badge>
                        <Badge variant="outline" className="text-xs">🛬 SAS Elite</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    A passionate founder with a deep love for travel optimization. Isak combines his analytical mindset with strategic points earning to create both the platform and the strategies that power Max Your Points.
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleBio('isak')}
                    className="w-full text-teal-600 hover:text-teal-800"
                  >
                    Read Full Bio
                    {expandedBio === 'isak' ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Full Bios (Expandable) */}
      {expandedBio && (
        <section className="py-12 px-4 md:px-8 bg-stone-50">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                {expandedBio === 'nigel' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-stone-950">More About Nigel Evans</h3>
                    <div className="prose prose-lg text-stone-700">
                      <p>
                        Nigel Evans brings a wealth of experience from both the political and aviation worlds. Having traveled to over 50 countries and maintained elite status with multiple airlines, he understands the intricacies of loyalty programs from both a consumer and industry perspective.
                      </p>
                      <p>
                        His background in politics has given him a unique ability to decode complex terms and conditions, while his passion for aviation drives him to find the best strategies for maximizing elite benefits and award availability.
                      </p>
                      <p>
                        When he's not researching the latest changes to airline programs, you can find Nigel planning his next adventure or sharing insider tips with the Max Your Points community.
                      </p>
                    </div>
                  </div>
                )}
                {expandedBio === 'isak' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-stone-950">More About Isak Parild</h3>
                    <div className="prose prose-lg text-stone-700">
                      <p>
                        Isak Parild is the creative mind behind Max Your Points, having built the entire platform from scratch with a passion for both technology and travel. His analytical approach and attention to detail allow him to create tools and systems that make travel planning more efficient and rewarding.
                      </p>
                      <p>
                        As a dedicated points and miles enthusiast, Isak has developed sophisticated strategies for earning and burning points across multiple programs. His methodical approach to travel optimization has helped him achieve elite status while maintaining a focus on value and experiences.
                      </p>
                      <p>
                        Beyond travel, Isak enjoys diving deep into how things work and believes in transparency and sharing knowledge with the community.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Our Beliefs */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-stone-950 mb-16">What We Believe</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Manifesto */}
            <div className="space-y-8">
              <div className="prose prose-lg text-stone-700">
                <p className="text-xl font-serif leading-relaxed mb-8">
                  At Max Your Points, we believe travel should be smarter, more accessible, and deeply rewarding—for everyone.
                </p>
                <div className="space-y-6">
                  <p className="text-lg">
                    <strong>We believe that:</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <ScrollReveal delay={0} direction="left">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <FlightIcon size={32} className="text-teal-600" animated={true} />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-950 mb-2">Travel is transformative</p>
                          <p className="text-stone-700">
                            It opens minds, builds bridges, and connects people across cultures. Everyone deserves access to meaningful travel experiences, not just those paying full price.
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={200} direction="left">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <LightbulbIcon size={32} className="text-amber-500" animated={true} />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-950 mb-2">Knowledge is power</p>
                          <p className="text-stone-700">
                            With the right insights, anyone can turn everyday spending into extraordinary journeys. We exist to help you navigate the complex world of rewards, loyalty programs, and elite status—with clarity and confidence.
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                    
                    <ScrollReveal delay={400} direction="left">
                      <div className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <CompassIcon size={32} className="text-blue-600" animated={true} />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-950 mb-2">Transparency matters</p>
                          <p className="text-stone-700">
                            Our reviews are unbiased, our recommendations are experience-based, and we never promote a product we wouldn't use ourselves.
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Mission Statement */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-xl border border-teal-200">
                <h3 className="text-2xl font-bold text-stone-950 mb-6">Our Mission</h3>
                <p className="text-lg text-stone-700 leading-relaxed">
                  Whether you're planning a dream trip, chasing lifetime elite status, or just trying to get more value from your credit card, Max Your Points is here to help you travel better, smarter, and farther.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    icon: <CheckIcon size={28} className="text-green-600" animated={true} />,
                    title: "Transparency in reviews",
                    description: "Unbiased, experience-based recommendations"
                  },
                  {
                    icon: <CompassIcon size={28} className="text-blue-600" animated={true} />, 
                    title: "Real-world travel advice",
                    description: "Practical strategies that actually work"
                  },
                  {
                    icon: <GlobeIcon size={28} className="text-emerald-600" animated={true} />,
                    title: "Travel as a force for good",
                    description: "Connecting cultures and communities"
                  }
                ].map((belief, index) => (
                  <ScrollReveal key={index} delay={index * 150} direction="right">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">{belief.icon}</div>
                                            <div>
                          <h4 className="font-semibold text-stone-950 mb-1">{belief.title}</h4>
                          <p className="text-stone-600">{belief.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details (Expandable) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-teal-200 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 rounded-full">
                    <ToolsIcon size={48} className="text-white" animated={true} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-stone-950 mb-4">Built From Scratch, Built for Travelers</h3>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                  Every line of code, every feature, and every optimization designed specifically for travel enthusiasts who demand the best tools for maximizing their rewards.
                </p>
              </div>

              {/* Documentation Links */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <ArchitectureIcon size={24} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-950">Product Requirements Document</h4>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Read our comprehensive PRD from April 2025 that outlined the complete vision, features, and technical requirements that guided this entire project.
                  </p>
                  <a 
                    href="/PRD.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    📋 Read the PRD
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <RocketIcon size={24} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-950">Development Build Logs</h4>
                  </div>
                  <p className="text-emerald-800 mb-4">
                    Follow our complete 84-day development journey from April 3rd to June 24th, 2025. See the real challenges, victories, and pivots that shaped this platform.
                  </p>
                  <a 
                    href="/BuildLogs.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
                  >
                    📚 Read Build Logs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <button
                onClick={() => setTechDetailsExpanded(!techDetailsExpanded)}
                className="w-full text-left space-y-4 hover:opacity-80 transition-opacity duration-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border border-teal-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-stone-950">🔧 Technical Deep Dive</h4>
                  {techDetailsExpanded ? 
                    <ChevronUp className="w-6 h-6 text-teal-600" /> : 
                    <ChevronDown className="w-6 h-6 text-teal-600" />
                  }
                </div>
                <p className="text-stone-600">
                  Dive into the architecture, custom features, and engineering decisions behind Max Your Points
                </p>
              </button>
              
                             {techDetailsExpanded && (
                 <div className="mt-8 pt-8 border-t border-stone-200 space-y-8">
                   <div className="prose prose-lg text-stone-700">
                     <p className="text-xl leading-relaxed">
                       Max Your Points represents thousands of hours of passionate development work. Every line of code, every user interface element, and every optimization algorithm was crafted specifically for travel enthusiasts who demand the best tools for maximizing their rewards.
                     </p>
                     
                     <ScrollReveal delay={0} direction="fade">
                       <div className="flex items-center gap-3 mt-10 mb-6 group">
                         <div className="group-hover:scale-110 transition-transform duration-300">
                           <ArchitectureIcon size={32} className="text-stone-600" animated={true} />
                         </div>
                         <h4 className="text-2xl font-bold text-stone-950">Architecture & Foundation</h4>
                       </div>
                     </ScrollReveal>
                     <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-6">
                       <p className="font-semibold text-stone-950 mb-3">Modern Web Architecture</p>
                       <p>
                         Built on <strong>Next.js 15.2.4</strong> with the latest App Router, our platform leverages React Server Components for lightning-fast page loads and optimal SEO. The entire application is written in <strong>TypeScript</strong>, ensuring type safety and reducing bugs by 90% compared to traditional JavaScript applications.
                       </p>
                     </div>

                     <ScrollReveal delay={200} direction="fade">
                       <div className="flex items-center gap-3 mt-10 mb-6 group">
                         <div className="group-hover:scale-110 transition-transform duration-300">
                           <DesignIcon size={32} className="text-purple-600" animated={true} />
                         </div>
                         <h4 className="text-2xl font-bold text-stone-950">Design System & User Experience</h4>
                       </div>
                     </ScrollReveal>
                     <div className="grid md:grid-cols-2 gap-6 mb-6">
                       <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                         <p className="font-semibold text-teal-950 mb-3">Tailwind CSS + Shadcn/ui</p>
                         <p className="text-sm text-teal-800">
                           Custom design system with over 50 components, all optimized for accessibility and mobile-first responsive design. Every button, card, and interactive element follows strict design principles.
                         </p>
                       </div>
                       <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                         <p className="font-semibold text-blue-950 mb-3">Performance First</p>
                         <p className="text-sm text-blue-800">
                           Optimized for Core Web Vitals with lazy loading, image optimization, and intelligent caching. Pages load in under 1 second on average.
                         </p>
                       </div>
                     </div>
                     
                     <ScrollReveal delay={400} direction="fade">
                       <div className="flex items-center gap-3 mt-10 mb-6 group">
                         <div className="group-hover:scale-110 transition-transform duration-300">
                           <RocketIcon size={32} className="text-orange-500" animated={true} />
                         </div>
                         <h4 className="text-2xl font-bold text-stone-950">Custom-Built Features</h4>
                       </div>
                     </ScrollReveal>
                     
                     <div className="space-y-6">
                                               <div className="border-l-4 border-teal-500 pl-6">
                          <div className="flex items-center gap-2 mb-2 group">
                            <div className="group-hover:scale-110 transition-transform duration-300">
                              <TargetIcon size={24} className="text-teal-600" animated={true} />
                            </div>
                            <h5 className="text-lg font-bold text-stone-950">SEO Optimizer Pro</h5>
                          </div>
                          <p className="mb-4">
                            Our proprietary SEO analysis engine goes beyond basic keyword checking. It analyzes content structure, readability scores, semantic HTML, meta tag optimization, and performs comprehensive E-A-T (Expertise, Authoritativeness, Trustworthiness) evaluation.
                          </p>
                          
                          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-4">
                            <div className="flex items-center gap-2 mb-2 group">
                              <div className="group-hover:scale-110 transition-transform duration-300">
                                <TargetIcon size={20} className="text-amber-600" animated={true} />
                              </div>
                              <h6 className="font-semibold text-teal-950">E-A-T Analysis Engine</h6>
                            </div>
                            <p className="text-sm text-teal-800 mb-3">
                              Critical for travel and financial content, our system automatically scans for Google's quality signals:
                            </p>
                            <div className="grid md:grid-cols-3 gap-3 text-xs text-teal-700">
                              <div>
                                <p className="font-medium mb-1">📚 Expertise</p>
                                <ul className="space-y-1">
                                  <li>• Author credentials</li>
                                  <li>• Travel industry experience</li>
                                  <li>• Technical depth</li>
                                  <li>• Factual accuracy</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium mb-1">⭐ Authoritativeness</p>
                                <ul className="space-y-1">
                                  <li>• External citations</li>
                                  <li>• Industry recognition</li>
                                  <li>• Backlink quality</li>
                                  <li>• Content freshness</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium mb-1">🛡️ Trustworthiness</p>
                                <ul className="space-y-1">
                                  <li>• Source verification</li>
                                  <li>• Contact information</li>
                                  <li>• Transparency signals</li>
                                  <li>• Review authenticity</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <ul className="text-sm space-y-1 text-stone-600">
                            <li>• Real-time content scoring as you type</li>
                            <li>• Semantic keyword analysis and suggestions</li>
                            <li>• Technical SEO auditing (schema markup, headers, etc.)</li>
                            <li>• Competitive analysis integration</li>
                            <li>• YMYL (Your Money Your Life) content compliance</li>
                          </ul>
                        </div>

                       <div className="border-l-4 border-purple-500 pl-6">
                         <div className="flex items-center gap-2 mb-2 group">
                           <div className="group-hover:scale-110 transition-transform duration-300">
                             <BrainIcon size={24} className="text-purple-600" animated={true} />
                           </div>
                           <h5 className="text-lg font-bold text-stone-950">Content Intelligence Suite</h5>
                         </div>
                         <p className="mb-3">
                           Advanced natural language processing analyzes content for readability, tone, and structure. It automatically suggests improvements and ensures consistent voice across all articles.
                         </p>
                         <ul className="text-sm space-y-1 text-stone-600">
                           <li>• Flesch-Kincaid readability scoring</li>
                           <li>• Tone and sentiment analysis</li>
                           <li>• Automated content categorization</li>
                           <li>• Duplicate content detection</li>
                         </ul>
                       </div>

                                               <div className="border-l-4 border-emerald-500 pl-6">
                          <div className="flex items-center gap-2 mb-2 group">
                            <div className="group-hover:scale-110 transition-transform duration-300">
                              <LightningIcon size={24} className="text-yellow-500" animated={true} />
                            </div>
                            <h5 className="text-lg font-bold text-stone-950">Bespoke Content Management System</h5>
                          </div>
                          <p className="mb-4">
                            Built specifically for travel content creators, our CMS includes specialized fields for airline reviews, hotel experiences, credit card comparisons, and route analysis. No generic WordPress themes here!
                          </p>
                          
                          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ToolsIcon size={20} className="text-emerald-700" />
                              <h6 className="font-semibold text-emerald-950">Technical Architecture</h6>
                            </div>
                            <p className="text-sm text-emerald-800 mb-3">
                              Our headless CMS is built on modern APIs with real-time synchronization, type-safe schemas, and intelligent content validation:
                            </p>
                            <div className="grid md:grid-cols-2 gap-3 text-xs text-emerald-700">
                              <div>
                                <p className="font-medium mb-1">🗄️ Database Layer</p>
                                <ul className="space-y-1">
                                  <li>• PostgreSQL with JSONB fields</li>
                                  <li>• Row-level security policies</li>
                                  <li>• Automated data validation</li>
                                  <li>• Real-time subscriptions</li>
                                </ul>
                              </div>
                              <div>
                                <p className="font-medium mb-1">🚀 API & Performance</p>
                                <ul className="space-y-1">
                                  <li>• RESTful and GraphQL endpoints</li>
                                  <li>• Intelligent caching layers</li>
                                  <li>• Content delivery optimization</li>
                                  <li>• Edge computing deployment</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 mb-4">
                            <p className="text-sm text-stone-700 italic">
                              "And in my opinion, it is just as good, if not better than most legacy headless CMS systems. The difference is that ours is built specifically for travel content, not trying to be everything to everyone."
                            </p>
                          </div>
                          
                          <ul className="text-sm space-y-1 text-stone-600">
                            <li>• Custom rich text editor with travel-specific components</li>
                            <li>• Advanced image optimization and CDN integration</li>
                            <li>• Built-in version control and collaborative editing</li>
                            <li>• Automated social media preview generation</li>
                            <li>• Travel-specific schema validation (routes, airlines, hotels)</li>
                            <li>• Dynamic content relationship mapping</li>
                          </ul>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 mt-10 mb-6">
                       <ToolsIcon size={32} className="text-gray-600" />
                       <h4 className="text-2xl font-bold text-stone-950">Backend & Infrastructure</h4>
                     </div>
                     <div className="bg-stone-100 p-6 rounded-lg border border-stone-300 mb-6">
                       <div className="grid md:grid-cols-2 gap-6">
                         <div>
                           <p className="font-semibold text-stone-950 mb-2">Database & Authentication</p>
                           <p className="text-sm text-stone-700 mb-3">
                             Powered by <strong>PostgreSQL</strong> with our custom backend API, featuring secure authentication, real-time content management, and automated backups.
                           </p>
                         </div>
                         <div>
                           <p className="font-semibold text-stone-950 mb-2">Security & Performance</p>
                           <p className="text-sm text-stone-700 mb-3">
                             Enterprise-grade security with encrypted data storage, secure API endpoints, and comprehensive logging for monitoring and debugging.
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="flex items-center gap-3 mt-10 mb-6">
                       <ChartIcon size={32} className="text-blue-600" />
                       <h4 className="text-2xl font-bold text-stone-950">Analytics & Optimization</h4>
                     </div>
                     <p>
                       Every feature is built with data-driven decision making in mind. Custom analytics track user engagement, content performance, and help us continuously improve the platform based on real usage patterns.
                     </p>

                     <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
                       <div className="flex items-center gap-2 mb-3">
                         <LightbulbIcon size={24} className="text-yellow-500" />
                         <h5 className="text-lg font-bold text-teal-950">The Development Philosophy</h5>
                       </div>
                       <p className="text-teal-800 mb-4">
                         "Every feature should solve a real problem for travel enthusiasts. If it doesn't make earning or burning points easier, it doesn't belong on the platform."
                       </p>
                       <p className="text-sm text-teal-700">
                         This principle guides every development decision, from the database schema design to the user interface layouts. The result is a platform that feels intuitive to travel hackers while being powerful enough for advanced users.
                       </p>
                     </div>
                     
                     <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
                       <p className="text-sm text-teal-800 mb-2">
                         <strong>Want to learn more or get in touch?</strong>
                       </p>
                       <p className="text-sm text-teal-700 mb-3">
                         We occasionally share development insights and behind-the-scenes content to help fellow travel enthusiasts understand how modern travel platforms work. It's all about transparency and helping the community make better decisions.
                       </p>
                       <p className="text-sm text-teal-700">
                         Questions about our platform or want to connect? Reach out to{" "}
                         <a 
                           href="mailto:isak@maxyourpoints.com" 
                           className="font-semibold underline hover:text-teal-900"
                         >
                           isak@maxyourpoints.com
                         </a>
                       </p>
                     </div>
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 