export const dynamic = 'force-dynamic';
export const revalidate = 60;
export function GET() {
  // Return 204 to avoid favicon 404s during development until a real icon is added.
  return new Response(null, { status: 204 });
}
