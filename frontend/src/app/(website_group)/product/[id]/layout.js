// Server Component — generateMetadata runs on server for SSR meta tags

const PROD_API = "https://puramentejewel.com/api";
const SITE_URL = "https://puramentejewel.com";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${PROD_API}/products/${id}`, { cache: "no-store" });
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
    const pageUrl = `${SITE_URL}/product/${product.slug || id}`;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords || undefined,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: product.imageUrl ? [{ url: product.imageUrl, alt: product.productName }] : [],
        url: pageUrl,
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
        canonical: pageUrl,
      },
    };
  } catch (err) {
    console.error("generateMetadata product error:", err.message);
    return {
      title: "Product | Puramente Jewel",
      description: "Explore our jewelry collection at Puramente Jewel.",
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}