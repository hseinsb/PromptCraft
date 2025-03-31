/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Warning: This allows production builds to successfully complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
