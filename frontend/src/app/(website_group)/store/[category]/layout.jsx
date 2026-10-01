import { createMetadata, extractSeoData } from "@/lib/seoMeta";

// Fetch category data for metadata
async function getCategoryMetadata(categorySlug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { 
        cache: 'revalidate',
        next: { revalidate: 60 }
      }
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.find(
        (c) => c.name.toLowerCase() === categorySlug.toLowerCase()
      );
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch category metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryData = await getCategoryMetadata(category);

  // Fallback metadata map for common categories
  const metaMap = {
    necklace: {
      title: "Wholesale Necklaces Manufacturer India | Puramente Jewel",
      description: "Discover wholesale necklaces manufactured in India for retailers, fashion brands, online stores and international jewellery businesses.",
      keywords: ["necklaces", "wholesale", "jewelry", "manufacturer", "india"]
    },
    ring: {
      title: "Wholesale Rings Supplier for Retailers | Puramente Jewel",
      description: "Source wholesale rings from Puramente Jewel, a Jaipur jewelry manufacturer serving retailers, online stores and international jewelry brands.",
      keywords: ["rings", "wholesale", "jewelry", "supplier", "retailer"]
    },
    earrings: {
      title: "Wholesale Earrings Manufacturer India | Puramente Jewel",
      description: "Buy wholesale earrings from an Indian jewelry manufacturer. Explore gemstone, sterling silver and fashion earrings for retailers and brands.",
      keywords: ["earrings", "wholesale", "jewelry", "gemstone", "manufacturer"]
    },
    bracelets: {
      title: "Bracelet Manufacturers Jaipur India | Puramente Jewel",
      description: "Source bracelets from jewelry manufacturers in Jaipur. Puramente offers wholesale and custom jewelry solutions for global retailers and brands.",
      keywords: ["bracelets", "manufacturer", "jewelry", "jaipur", "wholesale"]
    }
  };

  if (categoryData) {
    const seoData = extractSeoData(categoryData, 'category', `/store/${category}`);
    return createMetadata({
      title: seoData.metaTitle || categoryData.name,
      description: seoData.metaDescription || categoryData.name,
      image: categoryData.imageUrl,
      url: seoData.canonicalUrl,
      keywords: seoData.metaKeywords
    });
  }

  // Use fallback metadata
  const fallbackMeta = metaMap[category?.toLowerCase()] || {
    title: `${category} | Puramente Jewel`,
    description: "Explore our exclusive jewelry collection from Puramente Jewel.",
    keywords: ["jewelry", "wholesale", category]
  };

  return createMetadata({
    title: fallbackMeta.title,
    description: fallbackMeta.description,
    keywords: fallbackMeta.keywords,
    url: `https://puramente.com/store/${category}`
  });
}

export default function CategoryLayout({ children }) {
  return <>{children}</>;
}
