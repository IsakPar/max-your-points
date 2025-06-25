import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')

  if (secret !== process.env.PREVIEW_SECRET || !slug || !type) {
    return new Response('Invalid request', { status: 401 })
  }

  (await draftMode()).enable()

  if (type === 'post') return redirect(`/blog/${slug}`)
  if (type === 'category') return redirect(`/blog/categories/${slug}`)

  return new Response('Unknown preview type', { status: 400 })
} 