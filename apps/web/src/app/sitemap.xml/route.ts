export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import { getAllGuidesMeta } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bonusmax.ro";

function urlXml(loc: string, lastmod?: string) {
  return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <xhtml:link rel="alternate" hreflang="ro-ro" href="${loc}"/>
  </url>`;
}

export async function GET() {
  const staticUrls = ["/", "/ghiduri", "/noutati", "/promoveaza-te", "/unelte/calculator-wr", "/onjn/operatori-licentiati"].map((p) =>
    urlXml(`${SITE}${p}`)
  );

  let guidesXml = "";
  try {
    const guides = getAllGuidesMeta();
    guidesXml = guides.map((g: any) => urlXml(`${SITE}/ghiduri/${g.slug}`, g.updatedAt || undefined)).join("");
  } catch {}

  const news = await (prisma as any).feedItem.findMany({
    where: { status: "APPROVED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });
  const newsXml = (news as any[])
    .map((n: any) => urlXml(`${SITE}/noutati/${n.slug}`, (n.publishedAt || n.updatedAt).toISOString()))
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${staticUrls.join("")}
    ${guidesXml}
    ${newsXml}
  </urlset>`;

  return new NextResponse(xml, { headers: { "content-type": "application/xml" } });
}
