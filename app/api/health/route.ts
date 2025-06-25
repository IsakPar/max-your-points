import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check backend API connectivity
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3005'
    
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    let backendHealthy = false
    let backendData: any = null

    if (response.ok) {
      backendData = await response.json()
      backendHealthy = backendData?.status === 'healthy'
    }
    
    const health = {
      status: backendHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        backend: backendHealthy ? 'healthy' : 'unhealthy',
        frontend: 'healthy'
      },
      backend: backendData || null
    }

    // If backend is down, return 503
    if (!backendHealthy) {
      return NextResponse.json({
        ...health,
        error: 'Backend API connection failed'
      }, { status: 503 })
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {
        backend: 'unknown',
        frontend: 'unhealthy'
      }
    }, { status: 503 })
  }
} 