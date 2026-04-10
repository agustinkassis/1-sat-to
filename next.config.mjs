/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // General
    BASE_ENVIRONMENT: process.env.BASE_ENVIRONMENT,
    // Analytics
    UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  },
};

export default nextConfig;
