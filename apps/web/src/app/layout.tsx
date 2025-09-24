import type { ReactNode } from 'react';
import './globals.css';
import StickyHeader from '@/components/layout/StickyHeader';
import Footer from '@/components/layout/Footer';
import { configureSeo, jsonLdOrganization, jsonLdWebsite } from '@bonusmax/lib';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from 'next-themes';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

// Fonts must be instantiated at module scope
const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', weight: ['400', '600', '800'] });

export const metadata = {
  title: { default: 'Bonusmax', template: '%s – Bonusmax' },
  // Next.js sets UTF-8 by default; keeping icons here.
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'alternate icon', url: '/favicon.ico' },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Configure SEO defaults from app site config
  configureSeo({
    name: siteConfig.name,
    description: siteConfig.description,
    baseUrl: siteConfig.baseUrl,
    locale: siteConfig.locale,
    twitter: siteConfig.twitter,
    email: siteConfig.email,
  });
  const orgLd = jsonLdOrganization();
  const siteLd = jsonLdWebsite();
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Preconnect image CDNs used across the site to speed up LCP image fetches */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
          <StickyHeader />
          <main>{children}</main>
          <Footer />
          <CookieConsentBanner />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
