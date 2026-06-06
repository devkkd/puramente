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

  // Reduce bundle size — remove unused locales
  i18n: undefined,

  // Experimental: faster builds
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
