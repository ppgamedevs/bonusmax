import { NextResponse, NextRequest } from 'next/server';

// Security headers middleware
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Basic security headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-DNS-Prefetch-Control', 'off');

  // Minimal Permissions-Policy (adjust as needed)
  res.headers.set(
    'Permissions-Policy',
    [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()'
    ].join(', ')
  );

  // CSP (report-only to start). Update domains as needed.
  const self = "'self'";
  const unsafeInline = "'unsafe-inline'"; // Next/Image/Inline styles often need this; tighten later.
  const imgSrc = [self, 'data:', 'https://images.unsplash.com', 'https://*'].join(' ');
  const scriptSrc = [self, unsafeInline].join(' ');
  const styleSrc = [self, unsafeInline].join(' ');
  const connectSrc = [self, 'https://*'].join(' ');
  const fontSrc = [self, 'data:'].join(' ');

  const csp = [
    `default-src ${self}`,
    `img-src ${imgSrc}`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `connect-src ${connectSrc}`,
    `font-src ${fontSrc}`,
    `frame-ancestors 'none'`
  ].join('; ');

  res.headers.set('Content-Security-Policy-Report-Only', csp);

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
