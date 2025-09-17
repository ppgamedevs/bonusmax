import { NextResponse } from "next/server";
export async function GET() {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bonusmax.ro";
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${SITE}/sitemap.xml`,
  ].join("\n");
  return new NextResponse(body, { headers: { "content-type": "text/plain" } });
}
