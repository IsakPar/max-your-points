// Image management via Railway backend
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'

// GET /api/admin/images/[url] - Get image metadata by URL
export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Forward to Railway backend
    const imageUrl = decodeURIComponent(params.url)
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${BACKEND_URL}/api/admin/images/${encodeURIComponent(imageUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Get image metadata error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// PUT /api/admin/images/[url] - Update image metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Forward to Railway backend
    const imageUrl = decodeURIComponent(params.url)
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/admin/images/${encodeURIComponent(imageUrl)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Update image metadata error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// DELETE /api/admin/images/[url] - Delete image and metadata
export async function DELETE(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Forward to Railway backend
    const imageUrl = decodeURIComponent(params.url)
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${BACKEND_URL}/api/admin/images/${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 