export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { prisma, checkAffiliateLink, recordLinkCheck } from "@bonusmax/lib";

function assertCronKey(url: URL) {
  if (!process.env.CRON_KEY) return false;
  return url.searchParams.get("key") === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!assertCronKey(url)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limit = Number(url.searchParams.get("limit") ?? 20);

  const offers = await prisma.offer.findMany({
    where: { isActive: true, country: "RO", operator: { isLicensedRO: true } },
    orderBy: [{ lastCheckedAt: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true, ctaBaseUrl: true },
  });

  const results: any[] = [];
  for (const o of offers) {
    const r = await checkAffiliateLink(o.ctaBaseUrl, 10000);
    await recordLinkCheck(o.id, r);
    results.push({ offerId: o.id, ...r });
  }

  return NextResponse.json({ ok: true, checked: results.length, results });
}
