// src/app/sitemap.xml/route.js - Dynamic sitemap generation

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://puramente.com';

// Fetch all products and categories for sitemap
async function getEntities() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/categories`, { next: { revalidate: 3600 } })
    ]);

    let products = [];
    let categories = [];

    if (productsRes.ok) {
      const data = await productsRes.json();
      products = data.data || [];
    }

    if (categoriesRes.ok) {
      const data = await categoriesRes.json();
      categories = data.data || [];
    }

    return { products, categories };
  } catch (error) {
    console.error('Error fetching sitemap entities:', error);
    return { products: [], categories: [] };
  }
}

// Static pages with priorities
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/store/ring', priority: 0.9, changefreq: 'weekly' },
  { path: '/store/earrings', priority: 0.9, changefreq: 'weekly' },
  { path: '/store/necklace', priority: 0.9, changefreq: 'weekly' },
  { path: '/store/bracelet', priority: 0.9, changefreq: 'weekly' },
  { path: '/new-in', priority: 0.9, changefreq: 'weekly' },
  { path: '/ourStory', priority: 0.8, changefreq: 'monthly' },
  { path: '/craftsmanship', priority: 0.8, changefreq: 'monthly' },
  { path: '/sustainability', priority: 0.8, changefreq: 'monthly' },
  { path: '/custom', priority: 0.9, changefreq: 'monthly' },
  { path: '/exhibitions', priority: 0.7, changefreq: 'monthly' },
  { path: '/fair-trade', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/faqs', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' }
];

export async function GET() {
  try {
    const { products, categories } = await getEntities();

    // Build URLs
    const urls = [];

    // Add static pages
    staticPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority
      });
    });

    // Add dynamic product pages
    products.forEach((product) => {
      urls.push({
        url: `${baseUrl}/product/${product._id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: product.bestSeller ? 0.8 : 0.7
      });
    });

    // Add dynamic category pages
    categories.forEach((category) => {
      urls.push({
        url: `${baseUrl}/store/${category.name.toLowerCase()}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.85
      });
    });

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.url)}</loc>
    <lastmod>${url.lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}

// Helper function to escape XML special characters
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
