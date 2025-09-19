import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: { default: 'Bonusmax', template: '%s – Bonusmax' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}