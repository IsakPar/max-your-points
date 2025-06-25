import { NextResponse } from 'next/server'
// Backend API handles newsletter subscribers directly

export async function GET() {
  try {
    console.log('📧 Admin fetching newsletter subscribers - backend integration pending')
    
    // Placeholder: Will connect to backend API
    const subscribers: any[] = []

    console.log(`✅ Successfully fetched ${subscribers.length} subscribers`)
    
    return NextResponse.json({ 
      success: true,
      subscribers: subscribers
    })

  } catch (error) {
    console.error('❌ Newsletter subscribers fetch error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 