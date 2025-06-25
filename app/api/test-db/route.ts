import { NextRequest, NextResponse } from 'next/server'
import { testDatabaseConnection, checkForPublishedArticles, getSimplePublishedArticles } from '@/lib/test-articles'

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    const connectionTest = await testDatabaseConnection()
    
    // Check for published articles
    const articlesCheck = await checkForPublishedArticles()
    
    // Get simple published articles if any exist
    let sampleArticles = []
    if (articlesCheck.hasArticles) {
      sampleArticles = await getSimplePublishedArticles()
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        connectionTest,
        articlesCheck,
        sampleArticles: sampleArticles.slice(0, 3) // Limit to 3 for testing
      }
    })
  } catch (error) {
    console.error('Database test API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 