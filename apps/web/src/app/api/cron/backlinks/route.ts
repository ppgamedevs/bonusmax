export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";

function ok(url: URL) {
  return !!process.env.CRON_KEY && url.searchParams.get("key") === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });

  const limit = Number(url.searchParams.get("limit") || 50);
  const list = await (prisma as any).backlink.findMany({ orderBy: { lastSeen: "asc" }, take: limit, include: { domain: true } });

  let okCount = 0,
    fail = 0;
  for (const b of list) {
    try {
      const r = await fetch(b.url, { redirect: "follow", headers: { "user-agent": "BonusmaxBot/1.0" } });
      const html = await r.text();
      const has = html.includes("bonusmax.ro") || html.includes(process.env.NEXT_PUBLIC_SITE_URL || "");
      const now = new Date();
      await (prisma as any).backlink.update({ where: { id: b.id }, data: { ok: has, lastSeen: now, firstSeen: b.firstSeen ?? (has ? now : null) } });
      if (has) okCount++;
      else fail++;
    } catch {
      await (prisma as any).backlink.update({ where: { id: b.id }, data: { ok: false, lastSeen: new Date() } });
      fail++;
    }
  }
  return NextResponse.json({ ok: true, checked: list.length, okCount, fail });
}
