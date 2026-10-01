// Server Component — generateMetadata runs on server for SSR meta tags
const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL || "https://puramentejewel.com/api";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });
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

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords || undefined,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: category.imageUrl ? [{ url: category.imageUrl }] : [],
        url: `https://puramentejewel.com/store/${categorySlug}`,
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
        canonical: `https://puramentejewel.com/store/${categorySlug}`,
      },
    };
  } catch (err) {
    return {
      title: `${categorySlug} | Puramente Jewel`,
      description: "Explore our jewelry collection at Puramente Jewel.",
    };
  }
}

export default function CategoryLayout({ children }) {
  return children;
}