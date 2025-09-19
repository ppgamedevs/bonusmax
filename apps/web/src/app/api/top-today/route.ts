export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { getTopTodayOffers } from "@bonusmax/lib";

export async function GET() {
  const data = await getTopTodayOffers(6, 72);
  return NextResponse.json({ ok: true, data });
}
