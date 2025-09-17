import { NextResponse } from "next/server";
import { upsertProspect } from "@/src/lib/outreach";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as any;
  if (!Array.isArray(body?.items)) return NextResponse.json({ ok: false, error: "Invalid" }, { status: 400 });

  let created = 0,
    skipped = 0;
  for (const it of body.items) {
    try {
      const res = await upsertProspect(it);
      if ((res as any).skipped) skipped++;
      else created++;
    } catch {
      skipped++;
    }
  }
  return NextResponse.json({ ok: true, created, skipped });
}
