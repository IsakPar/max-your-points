import { NextResponse } from 'next/server';

export async function GET() {
  // Static pages to include in sitemap
  const staticPages = [
    '/',
    '/about',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
    '/blog',
    '/contact',
  ];

  try {
    // TODO: Implement custom CMS integration for blog posts
    // For now, using static pages only
    const urls = staticPages;

    // Generate XML content
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    // Return XML response with correct content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only if there's an error
    const urls = staticPages;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
} 