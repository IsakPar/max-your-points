import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { api } from '@/lib/api'
import AdminNavbar from './components/AdminNavbar'
import { ToastProvider } from '@/components/ui/toast-provider'
import { Toaster } from 'sonner'

async function checkAuth() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return null
    }

    // Server-side: manually check token with API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005'}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user

  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication
  const user = await checkAuth()

  // If no user or not admin/super_admin, redirect to login
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login?error=unauthorized')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar user={user} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
        />
      </div>
    </ToastProvider>
  )
} 