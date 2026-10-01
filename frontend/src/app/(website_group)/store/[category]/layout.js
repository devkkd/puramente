// Server Component — generateMetadata runs on server for SSR meta tags
// NOTE: Use hardcoded API URL — NEXT_PUBLIC_ env vars are unreliable in server components during SSR

const PROD_API = "https://puramentejewel.com/api";
const SITE_URL = "https://puramentejewel.com";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  try {
    const res = await fetch(`${PROD_API}/categories`, { cache: "no-store" });
    const data = await res.json();

    const category = data?.data?.find(
      (c) => c.name?.toLowerCase() === categorySlug?.toLowerCase()
    );

    if (!category) {
      return {
        title: `${categorySlug} | Puramente Jewel`,
        description: "Explore our jewelry collection at Puramente Jewel.",
      };
    }

    const metaTitle =
      category.seo?.metaTitle ||
      `${category.name} Jewelry Wholesale Manufacturer India | Puramente Jewel`;

    const metaDescription =
      category.seo?.metaDescription ||
      `Discover wholesale ${category.name.toLowerCase()} manufactured in India for retailers, fashion brands and international jewelry businesses.`;

    const keywords = category.seo?.metaKeywords?.join(", ") || "";
    const pageUrl = `${SITE_URL}/store/${categorySlug}`;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords || undefined,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: category.imageUrl ? [{ url: category.imageUrl, alt: metaTitle }] : [],
        url: pageUrl,
        type: "website",
        siteName: "Puramente Jewel",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: category.imageUrl ? [category.imageUrl] : [],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (err) {
    console.error("generateMetadata category error:", err.message);
    return {
      title: `${categorySlug} | Puramente Jewel`,
      description: "Explore our jewelry collection at Puramente Jewel.",
    };
  }
}

export default function CategoryLayout({ children }) {
  return children;
}