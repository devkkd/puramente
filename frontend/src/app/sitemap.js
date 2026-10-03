import { LOCALES } from '@/middleware';

// Get base URL from environment or default
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://puramentejewel.com';

// Static routes with priorities
const staticRoutes = [
  { path: '', changefreq: 'weekly', priority: 1.0 }, // Homepage
  { path: '/store/ring', changefreq: 'weekly', priority: 0.9 },
  { path: '/store/earring', changefreq: 'weekly', priority: 0.9 },
  { path: '/store/necklace', changefreq: 'weekly', priority: 0.9 },
  { path: '/store/bracelet', changefreq: 'weekly', priority: 0.9 },
  { path: '/new-in', changefreq: 'weekly', priority: 0.9 },
  { path: '/ourStory', changefreq: 'monthly', priority: 0.8 },
  { path: '/craftsmanship', changefreq: 'monthly', priority: 0.8 },
  { path: '/sustainability', changefreq: 'monthly', priority: 0.8 },
  { path: '/visit-studio', changefreq: 'monthly', priority: 0.7 },
  { path: '/custom', changefreq: 'monthly', priority: 0.9 },
  { path: '/exhibitions', changefreq: 'monthly', priority: 0.7 },
  { path: '/fair-trade', changefreq: 'monthly', priority: 0.8 },
  { path: '/blog', changefreq: 'weekly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
  { path: '/faqs', changefreq: 'monthly', priority: 0.6 },
  { path: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
];

export default async function sitemap() {
  try {
    // Fetch dynamic content from your backend APIs
    let products = [];
    let blogs = [];

    try {
      // Fetch all products
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'}/products`, {
        revalidate: 86400, // Cache for 24 hours
      });
      
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success && Array.isArray(productsData.data)) {
          products = productsData.data.map(product => ({
            url: `${BASE_URL}/product/${product._id}`,
            lastModified: new Date(product.updatedAt || product.createdAt).toISOString().split('T')[0],
            changeFrequency: 'weekly',
            priority: 0.8,
          }));
        }
      }
    } catch (err) {
      console.warn('Warning: Could not fetch products for sitemap', err.message);
    }

    try {
      // Fetch all blogs
      const blogsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api'}/blogs`, {
        revalidate: 86400, // Cache for 24 hours
      });
      
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        if (blogsData.success && Array.isArray(blogsData.data)) {
          blogs = blogsData.data.map(blog => ({
            url: `${BASE_URL}/blog/${blog.slug}`,
            lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString().split('T')[0],
            changeFrequency: 'weekly',
            priority: 0.7,
          }));
        }
      }
    } catch (err) {
      console.warn('Warning: Could not fetch blogs for sitemap', err.message);
    }

    // Generate locale-specific static routes
    const localeRoutes = [];
    LOCALES.forEach(locale => {
      staticRoutes.forEach(route => {
        localeRoutes.push({
          url: `${BASE_URL}/${locale}${route.path}`,
          lastModified: new Date().toISOString().split('T')[0],
          changeFrequency: route.changefreq,
          priority: route.priority,
        });
      });
    });

    // Combine all routes
    const allRoutes = [
      ...localeRoutes,
      ...products,
      ...blogs,
    ];

    return allRoutes;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to basic sitemap if API calls fail
    const fallbackRoutes = [];
    LOCALES.forEach(locale => {
      staticRoutes.forEach(route => {
        fallbackRoutes.push({
          url: `${BASE_URL}/${locale}${route.path}`,
          lastModified: new Date().toISOString().split('T')[0],
          changeFrequency: route.changefreq,
          priority: route.priority,
        });
      });
    });

    return fallbackRoutes;
  }
}
