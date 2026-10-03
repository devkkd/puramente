// Dynamic robots.js for Next.js 13+ App Router
// This ensures consistent robots rules across environments

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://puramentejewel.com';

  return {
    rules: [
      {
        // Default rules for all bots
        userAgent: '*',
        allow: [
          '/',
          '/en-in/',
          '/en-ae/',
          '/en-gb/',
          '/en-ca/',
          '/en-fr/',
          '/en-de/',
          '/en-es/',
          '/en-it/',
          '/en-pt/',
          '/en-se/',
          '/en-dk/',
          '/en-no/',
          '/en-fi/',
          '/en-nl/',
        ],
        disallow: [
          '/admin/',
          '/(Admin_group)/',
          '/account/',
          '/cart/',
          '/api/',
          '/_next/',
          '/.next/',
          '/private/',
        ],
        crawlDelay: 1,
      },
      {
        // Google gets faster crawl rate
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.5,
      },
      {
        // Bing gets standard crawl rate
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        // Block aggressive bots
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `https://www.${baseUrl.replace('https://', '')}/sitemap.xml`,
    ],
    host: baseUrl,
  };
}
