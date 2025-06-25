/**
 * Server-side security utilities for CMS operations
 * Use only in server components and API routes
 */

// Note: This module uses JSDOM and should only be imported in server-side code
// For client-side sanitization, use DOMPurify directly in the component

/**
 * Server-side HTML sanitization for CMS content
 * Only use this in API routes and server components
 */
export async function sanitizeHtmlServer(dirty: string): Promise<string> {
  // Dynamic import to avoid bundling issues on client side
  const { JSDOM } = await import('jsdom')
  const createDOMPurify = await import('dompurify')
  
  const { window } = new JSDOM('')
  const DOMPurify = createDOMPurify.default(window as any)
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel',
      'data-*', 'id'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  })
}

/**
 * Validate and sanitize text input
 */
export function sanitizeText(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize slug for URL safety
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (record.count >= maxAttempts) {
      return false
    }

    record.count++
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Input validation schemas
 */
export const ValidationSchemas = {
  article: {
    title: { minLength: 5, maxLength: 200 },
    summary: { minLength: 10, maxLength: 300 },
    content: { minLength: 50, maxLength: 50000 },
    slug: { minLength: 3, maxLength: 100 },
    metaDescription: { minLength: 50, maxLength: 160 }
  },
  user: {
    email: { maxLength: 254 },
    name: { minLength: 2, maxLength: 50 }
  }
}

/**
 * Validate input against schema
 */
export function validateInput(
  input: string, 
  schema: { minLength?: number; maxLength?: number }
): { isValid: boolean; error?: string } {
  if (schema.minLength && input.length < schema.minLength) {
    return { isValid: false, error: `Minimum length is ${schema.minLength}` }
  }
  
  if (schema.maxLength && input.length > schema.maxLength) {
    return { isValid: false, error: `Maximum length is ${schema.maxLength}` }
  }
  
  return { isValid: true }
} 