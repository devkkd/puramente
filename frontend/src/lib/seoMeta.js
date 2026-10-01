// lib/seoMeta.js - Utility for rendering SEO meta tags and structured data

/**
 * Generate canonical URL for a page
 */
export const getCanonicalUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://puramente.com';
  return `${baseUrl}${path}`;
};

/**
 * Generate Open Graph meta tags
 */
export const getOgTags = (options = {}) => {
  const {
    title = 'Puramente - Luxury Jewelry & Bespoke Collections',
    description = 'Discover premium jewelry collections and bespoke designs at Puramente',
    image = '',
    url = '',
    type = 'website'
  } = options;

  return {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': 'Puramente'
  };
};

/**
 * Generate Twitter Card meta tags
 */
export const getTwitterTags = (options = {}) => {
  const {
    title = 'Puramente - Luxury Jewelry & Bespoke Collections',
    description = 'Discover premium jewelry collections and bespoke designs at Puramente',
    image = '',
    card = 'summary_large_image'
  } = options;

  return {
    'twitter:card': card,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': '@puramente'
  };
};

/**
 * Generate structured data for Product schema
 */
export const getProductSchema = (product, baseUrl = 'https://puramente.com') => {
  const productSlug = product.slug || product._id;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.productName,
    "description": product.description || "Luxury jewelry piece from Puramente",
    "image": product.imageUrl,
    "url": `${baseUrl}/product/${productSlug}`,
    "brand": {
      "@type": "Brand",
      "name": "Puramente"
    },
    "category": product.category?.name || "Jewelry",
    "sku": product.designCode,
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${productSlug}`,
      "availability": "https://schema.org/InStock",
      "priceCurrency": "INR"
    }
  };
};

/**
 * Generate structured data for Category schema
 */
export const getCategorySchema = (category, baseUrl = 'https://puramente.com') => {
  const categoryUrl = `${baseUrl}/store/${category.name?.toLowerCase().replace(/\s+/g, '-') || category._id}`;
  return {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.seo?.metaDescription || category.name,
    "url": categoryUrl,
    "image": category.imageUrl,
    "mainEntity": {
      "@type": "Collection",
      "name": category.name,
      "url": categoryUrl
    }
  };
};

/**
 * Generate structured data for Organization
 */
export const getOrganizationSchema = (baseUrl = 'https://puramente.com') => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Puramente",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo/puramente-logo.png`,
    "description": "Luxury jewelry and bespoke collections",
    "sameAs": [
      "https://www.instagram.com/puramente",
      "https://www.facebook.com/puramente"
    ],
    "contact": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "info@puramente.com"
    }
  };
};

/**
 * Generate breadcrumb schema
 */
export const getBreadcrumbSchema = (items = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Parse metadata from product or category object
 */
export const extractSeoData = (entity, type = 'product', path = '') => {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://puramente.com';
  const canonicalUrl = getCanonicalUrl(path);

  const metaTitle = entity?.seo?.metaTitle || 
    (type === 'product' ? entity?.productName : entity?.name);
  
  const metaDescription = entity?.seo?.metaDescription || 
    (type === 'product' ? entity?.description?.slice(0, 160) : entity?.name);

  const metaKeywords = entity?.seo?.metaKeywords || [];
  const metaImage = entity?.imageUrl || '';

  return {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaImage,
    canonicalUrl,
    baseUrl
  };
};

/**
 * Create Next.js metadata object for pages
 */
export const createMetadata = (options = {}) => {
  const {
    title = 'Puramente - Luxury Jewelry & Bespoke Collections',
    description = 'Discover premium jewelry collections and bespoke designs at Puramente',
    image = '/images/og-default.jpg',
    url = 'https://puramente.com',
    type = 'website',
    keywords = ['jewelry', 'luxury', 'bespoke', 'puramente']
  } = options;

  return {
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    canonical: url,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      url,
      type,
      siteName: 'Puramente'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@puramente'
    }
  };
};
