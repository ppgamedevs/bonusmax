import type { NextConfig } from 'next';

// If you ever need to publish under a subpath, set NEXT_PUBLIC_BASE_PATH (e.g. "/bonusmax").
// For custom domain at root (bonusmax.ro), leave it unset -> ''.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
  // Uncomment if you prefer folder-style URLs (…/page/index.html) for static hosting
  // trailingSlash: true,
};

export default nextConfig;
