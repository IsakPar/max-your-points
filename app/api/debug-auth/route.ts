import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cookies = request.headers.get('cookie')
    
    return NextResponse.json({
      authHeader: authHeader || 'No Authorization header',
      cookies: cookies || 'No cookies',
      hasToken: !!authHeader,
      tokenPreview: authHeader ? authHeader.substring(0, 20) + '...' : 'None'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
} 