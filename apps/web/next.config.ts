import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.imgur.com' },
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  },
  transpilePackages: ['@bonusmax/ui', '@bonusmax/lib']
};

export default withMDX(nextConfig);
