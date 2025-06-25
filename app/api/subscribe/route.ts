import { NextResponse } from 'next/server'
import { getMailgunService } from '@/lib/email/mailgun'
// Backend API handles subscriptions directly

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    console.log('📧 Newsletter subscription for:', email)

    // Check if email is already subscribed (placeholder)
    // TODO: Check via backend API
    const isAlreadySubscribed = false

    if (isAlreadySubscribed) {
      return NextResponse.json(
        { message: 'Email is already subscribed!' },
        { status: 200 }
      )
    }

    // Add subscriber via backend API (placeholder)
    // TODO: Call backend API to add subscriber
    console.log('➕ Adding subscriber via backend API (pending implementation)')

    // TODO: Add to email service (Mailgun integration pending)
    console.log('📧 Email service integration pending')

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter!' 
    })

  } catch (error) {
    console.error('❌ Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    )
  }
} 