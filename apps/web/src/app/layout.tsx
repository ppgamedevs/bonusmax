import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { defaultMetadata, jsonLdOrganization, jsonLdWebsite } from '@bonusmax/lib/seo';
import { prisma } from '@bonusmax/lib';
import JsonLd from '@/components/JsonLd';
import { siteConfig } from '../config/site';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
// CompareTray requires client; wrap it in a small client component
import RumInit from '@/components/RumInit';
import Preconnect from '@/components/Preconnect';
import Footer from '@/components/layout/Footer';
import CompareTrayClient from '@/components/CompareTrayClient';
import BackButton from '@/components/BackButton';
import ThemeToggle from '@/components/ThemeToggle';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap' });

const baseMeta = defaultMetadata();
export const metadata = {
  ...baseMeta,
  title: 'Bonusmax',
  openGraph: {
    ...(baseMeta as any).openGraph,
    locale: 'ro_RO',
  },
  twitter: {
    card: 'summary_large_image',
  },
} as any;

async function getCtaOrigins() {
  const rows = await (prisma as any).offer.findMany({
    where: { isActive: true },
    select: { ctaBaseUrl: true },
    take: 12,
  });
  const origins = Array.from(
    new Set(
      (rows as any[])
        .map((r) => {
          try {
            return new URL(r.ctaBaseUrl).origin;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[]
    )
  );
  return origins;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const origins = await getCtaOrigins();
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Preconnect & dns-prefetch for CTA destinations */}
        {origins.map((o: string) => (
          <link key={o} rel="preconnect" href={o} crossOrigin="" />
        ))}
        {/* Preload critical Gilroy font weights */}
        <link rel="preload" href="/fonts/gilroy/Gilroy-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/gilroy/Gilroy-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Critical minimal CSS for H1 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--bm-max:1100px}.container{max-width:var(--bm-max)}h1,.prose h1{font-size:clamp(28px,3.2vw,40px);line-height:1.15;letter-spacing:-0.01em}`,
          }}
        />
      </head>
      <body className={plusJakarta.className + ' theme-smooth'} suppressHydrationWarning>
        {/* Global animated background */}
        <div className="background-fx" aria-hidden="true" />
        {/* Initialize theme without flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { var ls = localStorage.getItem('theme'); var m = window.matchMedia('(prefers-color-scheme: dark)'); var t = ls || (m.matches ? 'dark' : 'light'); if (t==='dark') document.documentElement.classList.add('dark'); } catch(e){} })();`,
          }}
        />
        <Preconnect />
        <JsonLd data={{ ...jsonLdOrganization(), inLanguage: 'ro-RO' }} />
        <JsonLd data={{ ...jsonLdWebsite(), inLanguage: 'ro-RO' }} />
        {/* Skip to content */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 rounded bg-black px-3 py-2 text-white"
        >
          Sari la conÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºinut
        </Link>
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-neutral-900/55">
          <div className="container flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="font-semibold text-lg">Bonusmax</Link>
            </div>
            <SearchBar className="hidden w-full max-w-md md:block" />
            <div className="flex items-center gap-3">
              <a
                href="#topul-de-azi"
                className="md:hidden btn-accent h-10 focus-accent"
              >
                Vezi topul de azi
              </Link>
              <nav className="hidden items-center gap-4 text-sm md:flex">
                <Link className="underline-offset-2 hover:underline focus-accent" href="/ghiduri">Ghiduri</Link>
                <Link className="underline-offset-2 hover:underline focus-accent" href="/alerte-bonusuri">Alerte bonusuri</Link>
              </nav>
              <BackButton />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container py-8">
          {children}
        </main>
        <Footer />
        <CompareTrayClient />
        <RumInit />
      </body>
    </html>
  );
}
