import type { NextConfig } from 'next';

// Polyfill for server-side rendering
if (typeof globalThis.self === 'undefined') {
  (globalThis as any).self = globalThis;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,

  // Basic image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Basic webpack optimizations
  webpack: (config, { isServer, webpack }) => {
    // Fix for "self is not defined" error
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Add polyfills for browser globals
    config.plugins.push(
      new webpack.DefinePlugin({
        'typeof self': JSON.stringify('undefined'),
        'typeof window': isServer ? JSON.stringify('undefined') : 'typeof window',
        'typeof document': isServer ? JSON.stringify('undefined') : 'typeof document',
      })
    );

    return config;
  },

  // Basic headers for performance
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
