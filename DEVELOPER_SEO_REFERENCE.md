# Developer SEO Reference Guide

## Backend Implementation Details

### 1. Database Schema (Models)

#### Product Model
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  // ... existing fields ...
  seo: {
    metaTitle: {
      type: String,
      default: null,
      trim: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      default: null,
      trim: true,
      maxlength: 160
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    schema: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  }
});
```

#### Category Model
```javascript
// models/Category.js
const categorySchema = new mongoose.Schema({
  // ... existing fields ...
  seo: {
    metaTitle: {
      type: String,
      default: null,
      trim: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      default: null,
      trim: true,
      maxlength: 160
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    schema: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  }
});
```

### 2. API Endpoints

#### Update Product SEO
```
PUT /api/products/:id/seo

Request Body:
{
  "metaTitle": "Premium Gold Necklace with Gemstones | Puramente",
  "metaDescription": "Handcrafted gold-plated necklace featuring premium gemstones...",
  "metaKeywords": ["gold necklace", "luxury jewelry", "gemstone necklace"]
}

Response:
{
  "success": true,
  "message": "Product SEO updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "productName": "Myra Necklace",
    "seo": {
      "metaTitle": "Premium Gold Necklace with Gemstones | Puramente",
      "metaDescription": "Handcrafted gold-plated necklace featuring premium gemstones...",
      "metaKeywords": ["gold necklace", "luxury jewelry", "gemstone necklace"],
      "schema": {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Myra Necklace",
        // ... full schema object
      }
    }
  }
}
```

#### Update Category SEO
```
PUT /api/categories/:id/seo

Request Body:
{
  "metaTitle": "Gold Necklaces Collection - Luxury Jewelry | Puramente",
  "metaDescription": "Explore our exclusive collection of designer necklaces...",
  "metaKeywords": ["necklace collection", "gold jewelry", "luxury necklaces"]
}

Response:
{
  "success": true,
  "message": "Category SEO updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Necklaces",
    "seo": {
      "metaTitle": "Gold Necklaces Collection - Luxury Jewelry | Puramente",
      "metaDescription": "Explore our exclusive collection of designer necklaces...",
      "metaKeywords": ["necklace collection", "gold jewelry", "luxury necklaces"],
      "schema": {
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        // ... full schema object
      }
    }
  }
}
```

### 3. Controller Implementation

#### updateProductSeo Controller
```javascript
// controllers/productController.js
exports.updateProductSeo = async (req, res) => {
  try {
    const { metaTitle, metaDescription, metaKeywords } = req.body;
    
    let product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Sanitize and validate SEO fields
    const seoData = sanitizeSeoFields(metaTitle, metaDescription, metaKeywords);
    
    // Generate schema if SEO data provided
    if (seoData.metaTitle || seoData.metaDescription) {
      seoData.schema = generateProductSchema(product);
    }

    product.seo = { ...product.seo, ...seoData };
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product SEO updated successfully",
      data: product
    });

  } catch (error) {
    console.error("Error updating product SEO:", error);
    res.status(500).json({ error: "Server error while updating product SEO" });
  }
};
```

#### updateCategorySeo Controller
```javascript
// controllers/categoryController.js
exports.updateCategorySeo = async (req, res) => {
  try {
    const { metaTitle, metaDescription, metaKeywords } = req.body;
    
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Sanitize and validate SEO fields
    const seoData = sanitizeSeoFields(metaTitle, metaDescription, metaKeywords);
    
    // Generate schema if SEO data provided
    if (seoData.metaTitle || seoData.metaDescription) {
      seoData.schema = generateCategorySchema(category);
    }

    category.seo = { ...category.seo, ...seoData };
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category SEO updated successfully",
      data: category
    });

  } catch (error) {
    console.error("Error updating category SEO:", error);
    res.status(500).json({ error: "Server error while updating category SEO" });
  }
};
```

### 4. SEO Helper Utilities

#### sanitizeSeoFields
```javascript
// utils/seoHelper.js
exports.sanitizeSeoFields = (title, description, keywords = []) => {
  return {
    metaTitle: title ? title.trim().slice(0, 60) : null,
    metaDescription: description ? description.trim().slice(0, 160) : null,
    metaKeywords: Array.isArray(keywords) 
      ? keywords.map(k => k.trim()).filter(k => k.length > 0).slice(0, 10)
      : []
  };
};
```

#### generateProductSchema
```javascript
exports.generateProductSchema = (product, baseUrl = process.env.FRONTEND_URL || 'https://puramente.com') => {
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
```

---

## Frontend Implementation Details

### 1. API Integration

#### API Methods
```javascript
// lib/api.js
import axios from 'axios';

const api = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
});

// Request interceptor to attach auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Product SEO
export const updateProductSeo = (id, seoData) => 
  api.put(`/products/${id}/seo`, seoData);

// Category SEO
export const updateCategorySeo = (id, seoData) => 
  api.put(`/categories/${id}/seo`, seoData);
```

### 2. SEO Meta Utilities

#### extractSeoData Function
```javascript
// lib/seoMeta.js
export const extractSeoData = (entity, type = 'product', path = '') => {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://puramente.com';
  const canonicalUrl = `${baseUrl}${path}`;

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
```

### 3. React Components

#### StructuredData Component
```jsx
// components/StructuredData.jsx
export default function StructuredData({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Usage:
<StructuredData schema={productSchema} />
```

#### SeoEditor Component Architecture
```jsx
// components/admin/SeoEditor.jsx
export default function SeoEditor({ 
  type = "product", 
  entityId, 
  initialData = {}, 
  onUpdate,
  isLoading = false 
}) {
  const [seoData, setSeoData] = useState({
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
    metaKeywords: initialData?.seo?.metaKeywords || []
  });
  
  const validateSeo = () => {
    // Validation logic for title, description, keywords
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSeo()) return;
    if (onUpdate) {
      await onUpdate(seoData);
    }
  };

  return (
    // Form with title input, description textarea, keywords management
  );
}
```

### 4. Page Integration

#### Product Page Implementation
```jsx
// app/(website_group)/product/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/api';
import { getProductSchema, extractSeoData } from '@/lib/seoMeta';
import StructuredData from '@/components/StructuredData';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [productSchema, setProductSchema] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          const productData = response.data;
          setProduct(productData);
          
          // Generate schema
          const schema = getProductSchema(productData);
          setProductSchema(schema);

          // Update document meta tags
          const seoData = extractSeoData(productData, 'product', `/product/${id}`);
          
          // Update title
          document.title = seoData.metaTitle;
          
          // Update or create meta description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', seoData.metaDescription);

          // Update Open Graph tags
          const createOrUpdateMetaTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
              tag = document.createElement('meta');
              tag.setAttribute('property', property);
              document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
          };

          createOrUpdateMetaTag('og:title', seoData.metaTitle);
          createOrUpdateMetaTag('og:description', seoData.metaDescription);
          createOrUpdateMetaTag('og:image', seoData.metaImage);
          createOrUpdateMetaTag('og:url', seoData.canonicalUrl);
          createOrUpdateMetaTag('og:type', 'product');

          // Update canonical URL
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', seoData.canonicalUrl);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <main>
      {productSchema && <StructuredData schema={productSchema} />}
      {/* Product content */}
    </main>
  );
}
```

#### Category Page Implementation
```jsx
// app/(website_group)/store/[category]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCategories } from '@/lib/api';
import { getCategorySchema, extractSeoData } from '@/lib/seoMeta';
import StructuredData from '@/components/StructuredData';

function StoreContent() {
  const params = useParams();
  const categorySlug = params.category;
  
  const [categoryData, setCategoryData] = useState(null);
  const [categorySchema, setCategorySchema] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategories();
        if (res?.success) {
          const found = res.data.find(
            (c) => c.name.toLowerCase() === categorySlug.toLowerCase()
          );
          if (found) {
            setCategoryData(found);
            
            // Generate schema
            const schema = getCategorySchema(found);
            setCategorySchema(schema);

            // Update meta tags
            const canonicalUrl = `https://puramente.com/store/${categorySlug}`;
            document.title = found.seo?.metaTitle || found.name;
            
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', found.seo?.metaDescription || found.name);

            // ... update OG tags, canonical URL, etc.
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    if (categorySlug) fetchCategory();
  }, [categorySlug]);

  return (
    <main>
      {categorySchema && <StructuredData schema={categorySchema} />}
      {/* Category content */}
    </main>
  );
}
```

---

## Testing & Validation

### Unit Tests Example

```javascript
// tests/seoHelper.test.js
const { generateProductSchema, sanitizeSeoFields } = require('../utils/seoHelper');

describe('SEO Helper', () => {
  describe('sanitizeSeoFields', () => {
    it('should trim and truncate title to 60 characters', () => {
      const input = '  This is a very long title that exceeds the 60 character limit  ';
      const result = sanitizeSeoFields(input, null, null);
      expect(result.metaTitle.length).toBeLessThanOrEqual(60);
    });

    it('should trim and truncate description to 160 characters', () => {
      const input = 'x'.repeat(200);
      const result = sanitizeSeoFields(null, input, null);
      expect(result.metaDescription.length).toBeLessThanOrEqual(160);
    });

    it('should limit keywords to 10', () => {
      const keywords = Array(20).fill('keyword');
      const result = sanitizeSeoFields(null, null, keywords);
      expect(result.metaKeywords.length).toBeLessThanOrEqual(10);
    });
  });

  describe('generateProductSchema', () => {
    it('should generate valid Product schema', () => {
      const mockProduct = {
        _id: '123',
        slug: 'test-product',
        productName: 'Test Product',
        description: 'Test description',
        imageUrl: 'https://example.com/image.jpg',
        designCode: 'TP001',
        category: { name: 'Test Category' }
      };

      const schema = generateProductSchema(mockProduct);
      
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Test Product');
      expect(schema.url).toContain('test-product');
    });
  });
});
```

### Integration Tests

```javascript
// tests/seoRoutes.test.js
const request = require('supertest');
const app = require('../server');

describe('SEO Routes', () => {
  describe('PUT /products/:id/seo', () => {
    it('should update product SEO', async () => {
      const response = await request(app)
        .put('/api/products/507f1f77bcf86cd799439011/seo')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          metaTitle: 'New Title',
          metaDescription: 'New description',
          metaKeywords: ['keyword1', 'keyword2']
        });

      expect(response.status).toBe(200);
      expect(response.body.data.seo.metaTitle).toBe('New Title');
    });
  });
});
```

---

## Performance Optimization

### Caching Strategy

```javascript
// Implement Redis caching for product SEO
const redis = require('redis');
const client = redis.createClient();

exports.getProductById = async (req, res) => {
  const cacheKey = `product:${req.params.id}`;
  
  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from DB
  const product = await Product.findById(req.params.id);
  
  // Cache for 1 hour
  await client.setex(cacheKey, 3600, JSON.stringify(product));
  
  res.json(product);
};
```

### Lazy Loading Schema

```jsx
// Only render schema when needed
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

return (
  <>
    {isClient && productSchema && (
      <StructuredData schema={productSchema} />
    )}
  </>
);
```

---

## Common Pitfalls

### ❌ Don't
```javascript
// Bad: Hardcoding URLs without considering environment
const url = "https://example.com/product/" + id;

// Bad: Not validating user input
product.seo.metaTitle = req.body.metaTitle;

// Bad: Forgetting to sanitize keywords
product.seo.metaKeywords = req.body.keywords;

// Bad: Not generating schema
product.seo.metaTitle = title; // Schema missing
```

### ✅ Do
```javascript
// Good: Using environment variables
const baseUrl = process.env.FRONTEND_URL || 'https://puramente.com';
const url = `${baseUrl}/product/${id}`;

// Good: Validating input
const seoData = sanitizeSeoFields(title, description, keywords);

// Good: Sanitizing keywords
const keywords = Array.isArray(input) 
  ? input.map(k => k.trim()).filter(k => k.length > 0)
  : [];

// Good: Always generating schema
const schema = generateProductSchema(product);
product.seo = { ...product.seo, schema };
```

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Click-Through Rate (CTR)**: % of search results that get clicked
2. **Impressions**: # of times your page appears in search results
3. **Average Position**: Where your page ranks for keywords
4. **Bounce Rate**: % of users who leave without action
5. **Time on Page**: How long users spend on product/category pages

### Google Search Console Integration

```javascript
// Add tracking for Search Console
// lib/searchConsole.js

export const trackSearchPerformance = async (page, query, ctr, impressions) => {
  // Send data to analytics
  analytics.track('search_performance', {
    page,
    query,
    ctr,
    impressions,
    timestamp: new Date()
  });
};
```

---

## SEO Checklist for Developers

### Frontend
- [ ] StructuredData component renders JSON-LD
- [ ] Meta tags update dynamically on page load
- [ ] Canonical URL set correctly
- [ ] Open Graph tags populated
- [ ] Twitter Card tags included
- [ ] Page title updates in browser tab
- [ ] Meta description visible in page source
- [ ] No duplicate content warnings
- [ ] Mobile viewport meta tag present
- [ ] Robots meta tag set correctly

### Backend
- [ ] SEO fields in Product/Category models
- [ ] Validation for meta title (max 60)
- [ ] Validation for meta description (max 160)
- [ ] Validation for keywords (max 10)
- [ ] Schema generation working
- [ ] API endpoints accepting SEO data
- [ ] Sanitization preventing XSS
- [ ] Response includes full SEO object
- [ ] Error handling for invalid input
- [ ] Tests covering SEO endpoints

### Deployment
- [ ] sitemap.xml generated and submitted
- [ ] robots.txt configured properly
- [ ] HTTPS enabled (required for SEO)
- [ ] Performance optimized (Lighthouse score)
- [ ] Mobile-friendly verified
- [ ] Search Console connected
- [ ] Analytics tracking implemented
- [ ] Redirects from old URLs handled
- [ ] 404 errors tracked
- [ ] Canonical URLs preventing duplicates

---

**Last Updated**: 2024
**Version**: 1.0
