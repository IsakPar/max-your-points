import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Skip middleware for API routes to prevent slowdowns
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Check for admin routes
  if (isAdminRoute && !isLoginPage) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth_token')?.value

    if (!authToken) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    // Optional: Verify token with backend (add this if needed for extra security)
    // For now, we trust the token exists and let the admin layout handle validation
    return NextResponse.next()
  }

  // If user is already logged in and tries to access login page, redirect to admin
  if (isLoginPage) {
    const authToken = request.cookies.get('auth_token')?.value
    if (authToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',  // Protect all admin routes
    '/login',         // Handle login redirects
  ],
} 