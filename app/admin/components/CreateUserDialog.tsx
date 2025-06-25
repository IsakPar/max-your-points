'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, AlertCircle, Copy, Shield, Edit, Users } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'

interface CreateUserDialogProps {
  onUserCreated?: () => void | Promise<void>
}

export default function CreateUserDialog({ onUserCreated }: CreateUserDialogProps = {}) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'editor' | 'admin'>('editor')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdUser, setCreatedUser] = useState<{
    email: string
    password: string
    role: string
  } | null>(null)
  
  const router = useRouter()

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let newPassword = ''
    
    // Ensure at least one of each type
    newPassword += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    newPassword += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    newPassword += '0123456789'[Math.floor(Math.random() * 10)]
    newPassword += '!@#$%^&*'[Math.floor(Math.random() * 8)]
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      newPassword += chars[Math.floor(Math.random() * chars.length)]
    }
    
    // Shuffle the password
    setPassword(newPassword.split('').sort(() => Math.random() - 0.5).join(''))
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: Shield,
          color: 'text-red-600',
          description: 'Full access to all features and user management'
        }
      case 'editor':
        return {
          icon: Edit,
          color: 'text-blue-600',
          description: 'Can create, edit, and publish content'
        }
      case 'user':
        return {
          icon: Users,
          color: 'text-gray-600',
          description: 'Basic access to view content and personal settings'
        }
      default:
        return {
          icon: Users,
          color: 'text-gray-600',
          description: 'Basic access'
        }
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use API client which includes authentication
      await api.createUser({
        email,
        password,
        name: fullName || email.split('@')[0],
        fullName,
        role,
      })

      // Success - show credentials
      setCreatedUser({ email, password, role })
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully!`)
      router.refresh()
      
      if (onUserCreated) {
        await onUserCreated()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyCredentials = () => {
    if (createdUser) {
      const credentials = `Email: ${createdUser.email}\nPassword: ${createdUser.password}\nRole: ${createdUser.role}`
      navigator.clipboard.writeText(credentials)
      toast.success('Credentials copied to clipboard!')
    }
  }

  const resetForm = () => {
    setEmail('')
    setFullName('')
    setPassword('')
    setRole('editor')
    setError('')
    setCreatedUser(null)
    setOpen(false)
  }

  const roleInfo = getRoleInfo(role)
  const RoleIcon = roleInfo.icon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {createdUser ? 'User Created Successfully' : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {createdUser 
              ? 'Save these credentials securely. The password will not be shown again.'
              : 'Create a new user for the CMS. Choose the appropriate role and access level.'
            }
          </DialogDescription>
        </DialogHeader>

        {createdUser ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure to save these credentials before closing this dialog!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {createdUser.email}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Password</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono">
                  {createdUser.password}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Role</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-mono capitalize">
                  {createdUser.role}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={copyCredentials} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Credentials
              </Button>
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <Label htmlFor="role">User Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span>User - Basic Access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-blue-600" />
                      <span>Editor - Content Management</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span>Admin - Full Access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Role description */}
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />
                  <span className="text-sm font-medium capitalize">{role}</span>
                </div>
                <p className="text-xs text-gray-600">{roleInfo.description}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1"
                  placeholder="Auto-generated secure password"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Click "Generate" for a secure random password
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating {role}...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create {role.charAt(0).toUpperCase() + role.slice(1)}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 