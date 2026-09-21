/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses
  compress: true,

  // Allow Next.js <Image> to optimize images from Cloudflare R2
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-aa4f04513c8b41c88c3782f548746765.r2.dev",
        pathname: "/**",
      },
    ],
    // Serve modern WebP/AVIF formats automatically
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days
    minimumCacheTTL: 604800,
    // Don't resize tiny images unnecessarily
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Reduce bundle size - remove unused locales
  i18n: undefined,

  // Experimental: faster builds
  experimental: {
    optimizeCss: false,
  },

  async redirects() {
    return [
      // ─────────────────────────────────────────────────────────────────────
      // 1. /blogs/* -> /blog/* (plural to singular)
      // ─────────────────────────────────────────────────────────────────────
      {
        source: "/blogs/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },

      // ─────────────────────────────────────────────────────────────────────
      // 2. /blog/store/:category -> /store/:category
      //    (wrong nesting — blog/store is not a real route)
      // ─────────────────────────────────────────────────────────────────────
      {
        source: "/blog/store/:category",
        destination: "/store/:category",
        permanent: true,
      },

      // ─────────────────────────────────────────────────────────────────────
      // 3. /category/:cat/withgemstone -> /store/:cat?tab=gemstone
      //    /category/:cat/withoutgemstone -> /store/:cat?tab=plain
      //    /category/:cat -> /store/:cat
      // ─────────────────────────────────────────────────────────────────────
      {
        source: "/category/:cat/withgemstone",
        destination: "/store/:cat?tab=gemstone",
        permanent: true,
      },
      {
        source: "/category/:cat/withoutgemstone",
        destination: "/store/:cat?tab=plain",
        permanent: true,
      },
      {
        source: "/category/:cat",
        destination: "/store/:cat",
        permanent: true,
      },

      // ─────────────────────────────────────────────────────────────────────
      // 4. Locale-prefixed routes (en-ae, en-ca, en-gb, en-fr, en-de, etc.)
      //    These locales either don't exist or the nested routes don't exist.
      //    Strip the locale prefix and redirect to the canonical route.
      // ─────────────────────────────────────────────────────────────────────

      // /[locale]/singleproduct/[id] -> /product/[id]
      {
        source: "/:locale(en-[a-z]{2})/singleproduct/:id",
        destination: "/product/:id",
        permanent: true,
      },

      // /[locale]/blogs/[slug] -> /blog/[slug]
      {
        source: "/:locale(en-[a-z]{2})/blogs/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },

      // /[locale]/blog/[slug] -> /blog/[slug]
      {
        source: "/:locale(en-[a-z]{2})/blog/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },

      // /[locale]/category/[cat]/[filter] -> /category/[cat]/[filter]  (then rule 3 handles it)
      {
        source: "/:locale(en-[a-z]{2})/category/:cat/:filter",
        destination: "/category/:cat/:filter",
        permanent: true,
      },
      {
        source: "/:locale(en-[a-z]{2})/category/:cat",
        destination: "/category/:cat",
        permanent: true,
      },

      // /[locale]/store/[category] -> /store/[category]
      {
        source: "/:locale(en-[a-z]{2})/store/:category*",
        destination: "/store/:category*",
        permanent: true,
      },

      // /[locale]/aboutus -> /ourStory
      {
        source: "/:locale(en-[a-z]{2})/aboutus",
        destination: "/ourStory",
        permanent: true,
      },

      // /[locale]/exhibitions -> /exhibitions
      {
        source: "/:locale(en-[a-z]{2})/exhibitions",
        destination: "/exhibitions",
        permanent: true,
      },

      // /[locale]/customize-order -> /custom
      {
        source: "/:locale(en-[a-z]{2})/customize-order",
        destination: "/custom",
        permanent: true,
      },

      // /[locale]/Wholesale -> / (home, closest equivalent)
      {
        source: "/:locale(en-[a-z]{2})/Wholesale",
        destination: "/",
        permanent: true,
      },

      // /[locale]/profile -> /account
      {
        source: "/:locale(en-[a-z]{2})/profile",
        destination: "/account",
        permanent: true,
      },

      // /[locale]/forgot-password -> /account
      {
        source: "/:locale(en-[a-z]{2})/forgot-password",
        destination: "/account",
        permanent: true,
      },

      // /[locale]/uk -> / (dead URL)
      {
        source: "/:locale(en-[a-z]{2})/uk",
        destination: "/",
        permanent: true,
      },

      // /[locale] (bare locale homepage, not en-in) -> /
      // This catches /en-ae, /en-ca, /en-gb etc. bare homepages
      {
        source: "/:locale(en-(?!in)[a-z]{2})",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;