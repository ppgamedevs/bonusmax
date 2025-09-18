export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ items: [] });

  const rows = await (prisma as any).offer.findMany({
    where: { id: { in: ids } },
    include: { operator: true },
  });

  const items = rows.map((o: any) => ({
    id: o.id,
    brand: o?.operator?.name || "",
    logo: o?.operator?.logoUrl || null,
    headline: o?.title || null,
  }));

  return NextResponse.json({ items });
}
