import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { buildSeo } from '@bonusmax/lib';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bonusmax.ro'),
  title: {
    default: 'Bonusmax – Top bonusuri',
    template: '%s – Bonusmax'
  },
  description: buildSeo({}).ogDescription,
  openGraph: {
    title: buildSeo({}).ogTitle,
    description: buildSeo({}).ogDescription,
    type: 'website',
    url: buildSeo({}).canonical
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className="dark">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container flex h-14 items-center justify-between">
            <div className="font-semibold text-lg">Bonusmax</div>
          </div>
        </header>
        <main className="container py-8">
          {children}
        </main>
        <footer className="border-t py-6 text-sm">
          <div className="container text-center text-muted-foreground">
            © Bonusmax 2025 – 18+ Joacă responsabil | Publicitate
          </div>
        </footer>
      </body>
    </html>
  );
}
