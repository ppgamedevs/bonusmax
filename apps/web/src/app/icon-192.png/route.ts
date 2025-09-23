export const dynamic = 'force-dynamic';
export function GET() {
  // Placeholder to avoid dynamic icon generation during static export.
  // Add a real static icon at public/icon-192.png for production.
  return new Response(null, { status: 204 });
}
