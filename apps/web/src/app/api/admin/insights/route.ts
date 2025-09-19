export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { overview30, topPagesEpc, utmPerformance } from "@bonusmax/lib";

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!process.env.ADMIN_KEY || url.searchParams.get("key") !== process.env.ADMIN_KEY)
    return NextResponse.json({ ok: false }, { status: 401 });
  const o = await overview30();
  const pages = await topPagesEpc(30, 5, 50);
  const utm = await utmPerformance(30, 5, 50);
  return NextResponse.json({ ok: true, o, pages, utm });
}
