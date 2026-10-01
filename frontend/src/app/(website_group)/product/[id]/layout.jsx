import { createMetadata, extractSeoData, getProductSchema } from "@/lib/seoMeta";

// Fetch product data for metadata
async function getProductMetadata(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      { 
        cache: 'revalidate',
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch product metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductMetadata(id);

  if (!product) {
    return {
      title: "Product Not Found | Puramente",
      description: "The product you're looking for could not be found."
    };
  }

  const seoData = extractSeoData(product, 'product', `/product/${id}`);

  return createMetadata({
    title: seoData.metaTitle || product.productName,
    description: seoData.metaDescription || product.description,
    image: product.imageUrl,
    url: seoData.canonicalUrl,
    keywords: seoData.metaKeywords
  });
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
