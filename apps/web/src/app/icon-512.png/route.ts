export const dynamic = "force-static";
export const revalidate = false;
export function GET() {
  // Placeholder: no dynamic generation during static export.
  // Add a real static icon at public/icon-512.png for production.
  return new Response(null, { status: 204 });
}
