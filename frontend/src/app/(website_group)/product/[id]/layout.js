// Server Component — generateMetadata runs on server for SSR meta tags
const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL || "https://puramentejewel.com/api";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    const product = data?.data;

    if (!product) {
      return {
        title: "Product | Puramente Jewel",
        description: "Explore our jewelry collection at Puramente Jewel.",
      };
    }

    const metaTitle =
      product.seo?.metaTitle ||
      `${product.productName} | ${product.category?.name || "Jewelry"} | Puramente Jewel`;

    const metaDescription =
      product.seo?.metaDescription ||
      (product.description ? product.description.slice(0, 160) : "Handcrafted jewelry from Puramente Jewel.");

    const keywords = product.seo?.metaKeywords?.join(", ") || "";
    const productUrl = `https://puramentejewel.com/product/${product.slug || id}`;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords || undefined,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.productName }] : [],
        url: productUrl,
        type: "website",
        siteName: "Puramente Jewel",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
      alternates: {
        canonical: productUrl,
      },
    };
  } catch (err) {
    return {
      title: "Product | Puramente Jewel",
      description: "Explore our jewelry collection at Puramente Jewel.",
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}