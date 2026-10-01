// utils/seoHelper.js

/**
 * Generate Product Schema (JSON-LD) for SEO
 * @param {Object} product - Product document with populated category
 * @param {string} baseUrl - Base URL of the website
 * @returns {Object} Structured schema object
 */
exports.generateProductSchema = (product, baseUrl = process.env.FRONTEND_URL || 'https://puramentejewel.com') => {
  // Use slug if available, otherwise use product ID
  const productSlug = product.slug || product._id;
  const productUrl = `${baseUrl}/product/${productSlug}`;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.productName,
    "description": product.description,
    "image": product.imageUrl,
    "url": productUrl,
    "brand": {
      "@type": "Brand",
      "name": "Puramente"
    },
    "category": product.category?.name || "Jewelry",
    "sku": product.designCode,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "availability": "https://schema.org/InStock",
      "priceCurrency": "INR"
    }
  };
};

/**
 * Generate Category Schema (JSON-LD) for SEO
 * @param {Object} category - Category document
 * @param {string} baseUrl - Base URL of the website
 * @returns {Object} Structured schema object
 */
exports.generateCategorySchema = (category, baseUrl = process.env.FRONTEND_URL || 'https://puramentejewel.com') => {
  const categoryUrl = `${baseUrl}/store/${category.name.toLowerCase().replace(/\s+/g, '-')}`;
  
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
 * Generate Organization Schema (JSON-LD) for SEO
 * @param {string} baseUrl - Base URL of the website
 * @returns {Object} Structured schema object
 */
exports.generateOrganizationSchema = (baseUrl = process.env.FRONTEND_URL || 'https://puramentejewel.com') => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Puramente",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
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
 * Generate Breadcrumb Schema (JSON-LD) for SEO
 * @param {Array} items - Breadcrumb items with name and url
 * @returns {Object} Structured schema object
 */
exports.generateBreadcrumbSchema = (items = []) => {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
};

/**
 * Generate SEO Meta Tags Object
 * @param {Object} options - Options for meta tags
 * @returns {Object} Meta tags object
 */
exports.generateMetaTags = (options = {}) => {
  const {
    title = 'Puramente - Luxury Jewelry & Bespoke Collections',
    description = 'Discover premium jewelry collections and bespoke designs at Puramente',
    keywords = ['jewelry', 'luxury', 'bespoke', 'puramente'],
    image = '',
    url = '',
    type = 'website',
    author = 'Puramente'
  } = options;

  return {
    // Basic Meta Tags
    title: title.slice(0, 60),
    description: description.slice(0, 160),
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    
    // Open Graph Tags
    og: {
      title: title,
      description: description,
      image: image,
      url: url,
      type: type,
      siteName: 'Puramente'
    },
    
    // Twitter Card Tags
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      image: image
    },
    
    // Additional SEO Tags
    canonical: url,
    author: author,
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    robots: 'index, follow'
  };
};

/**
 * Sanitize SEO field values
 * @param {string} title - Meta title
 * @param {string} description - Meta description
 * @param {Array} keywords - Meta keywords array
 * @returns {Object} Sanitized SEO object
 */
exports.sanitizeSeoFields = (title, description, keywords = []) => {
  return {
    metaTitle: title ? title.trim().slice(0, 60) : null,
    metaDescription: description ? description.trim().slice(0, 160) : null,
    metaKeywords: Array.isArray(keywords) 
      ? keywords.map(k => k.trim()).filter(k => k.length > 0).slice(0, 10)
      : []
  };
};
