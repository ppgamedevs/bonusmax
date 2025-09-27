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

  // Enhanced experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Enhanced image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enhanced webpack optimizations
  webpack: (config, { isServer, webpack, dev }) => {
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

    // Enhanced performance optimizations for production
    if (!dev && !isServer) {
      // Advanced chunk splitting for optimal caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // React and React DOM in separate chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              reuseExistingChunk: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react)[\\/]/,
              name: 'ui',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
              maxSize: 200000,
            },
            // Common code
            common: {
              name: 'common',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 100000,
            },
          },
        },
        // Enable module concatenation
        concatenateModules: true,
        // Minimize bundle size
        usedExports: true,
        sideEffects: false,
      };

      // Tree shaking optimizations
      config.resolve.alias = {
        ...config.resolve.alias,
        // Replace heavy libraries with lighter alternatives
        'lodash': 'lodash-es',
      };
    }

    return config;
  },

  // Enhanced headers for maximum performance
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ]
      },
    ];
  },
};

export default nextConfig;
