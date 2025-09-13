import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@bonusmax/ui', '@bonusmax/lib']
};

export default nextConfig;
