export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });
  const now = new Date();
  const start = new Date(now.getTime() - 30 * 864e5);
  const clicks = await prisma.clickEvent.count({ where: { ts: { gte: start, lte: now } } });
  const impressions = await (prisma as any).offerImpression.count({ where: { ts: { gte: start, lte: now } } });
  const ctr = impressions ? clicks / impressions : 0;
  return NextResponse.json({ ok: true, clicks, impressions, ctr });
}
