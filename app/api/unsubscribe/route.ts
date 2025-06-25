import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'

// Newsletter unsubscribe via Railway backend
export async function POST(request: Request) {
  try {
    console.log('📧 Unsubscribe API called')
    
    const { email } = await request.json()
    console.log('📧 Email to unsubscribe:', email)

    // Validate email
    if (!email || typeof email !== 'string') {
      console.log('❌ Invalid email: missing or wrong type')
      return NextResponse.json(
        { 
          success: false,
          error: 'Email is required'
        },
        { status: 400 }
      )
    }

    // More thorough email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      )
    }

    // Forward to Railway backend
    try {
      const response = await fetch(`${BACKEND_URL}/api/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      return NextResponse.json(data, { status: response.status })

    } catch (backendError) {
      console.error('❌ Backend request failed:', backendError)
      
      // Fallback response when backend is unavailable
      return NextResponse.json({ 
        success: true,
        message: 'If you were subscribed, you have been successfully unsubscribed.',
        fallback: true
      })
    }

  } catch (error) {
    console.error('❌ Unsubscribe error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 