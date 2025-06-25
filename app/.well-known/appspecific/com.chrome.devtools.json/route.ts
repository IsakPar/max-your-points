import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    schemaVersion: 1,
    applications: []
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  })
} 