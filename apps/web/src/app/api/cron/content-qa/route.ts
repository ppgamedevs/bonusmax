export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { runOfferQaBatch } from "@bonusmax/lib";

function ok(url: URL) {
  return !!process.env.CRON_KEY && url.searchParams.get("key") === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });
  const res = await runOfferQaBatch(100);
  return NextResponse.json({ ok: true, ...res });
}

