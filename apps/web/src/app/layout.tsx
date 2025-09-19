import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: { default: 'Bonusmax', template: '%s – Bonusmax' },
  charset: 'utf-8',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'alternate icon', url: '/favicon.ico' }
  ]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}