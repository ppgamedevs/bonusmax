import type { ReactNode } from 'react';

export const metadata = {
  title: { default: 'Bonusmax', template: '%s – Bonusmax' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}