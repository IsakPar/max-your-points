/**
 * Client-side security utilities that work in the browser
 */

/**
 * Sanitize text input (client-side safe)
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
 * Basic HTML sanitization for client-side (simple approach)
 * For production, use DOMPurify directly in the component
 */
export function sanitizeHtmlBasic(dirty: string): string {
  // Simple client-side sanitization
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
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
 * Generate secure random token (client-side)
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