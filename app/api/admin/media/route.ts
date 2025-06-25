import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'

// TODO: Replace with proper media management system
// This is a placeholder until we implement proper file upload with backend

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    console.log('Media API GET - forwarding to backend')
    
    const response = await fetch(`${BACKEND_URL}/api/media`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const formData = await request.formData()
    
    console.log('Media upload requested - forwarding to backend')
    
    const response = await fetch(`${BACKEND_URL}/api/media/upload`, {
      method: 'POST',
      headers: {
        ...(authHeader && { Authorization: authHeader })
      },
      body: formData
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('id')

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'Media ID required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/media/${mediaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 