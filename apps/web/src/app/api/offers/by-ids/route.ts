export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any;
  const ids = Array.isArray(body?.ids) ? (body.ids as string[]).slice(0, 4) : [];
  if (!ids.length) return NextResponse.json({ ok: false, error: "no_ids" }, { status: 400 });

  const rows = await (prisma as any).offer.findMany({ where: { id: { in: ids } }, take: 4 });
  const offers = rows.map((o: any) => ({
    id: o.id,
    brand: o.brand ?? o.name ?? "Brand",
    logoUrl: o.logoUrl ?? null,
    headline: o.headline ?? o.title ?? "",
    terms: o.terms ?? "",
    isLicensedRO: !!(o.isLicensedRO ?? o.isLicensed ?? true),
    isSponsored: !!(o.isSponsored ?? false),
    wr: o.wr || o.wageringRequirements || null,
    minDeposit: o.minDeposit ? `${o.minDeposit} RON` : o.min_deposit ? `${o.min_deposit} RON` : null,
    validity: o.validityDays ? `${o.validityDays} zile` : null,
    app: o.hasAppIos || o.hasAppAndroid ? ["iOS", o.hasAppAndroid && "Android"].filter(Boolean).join("/") : null,
    payments: Array.isArray(o.payments) ? o.payments : o.paymentsJson ? JSON.parse(o.paymentsJson) : [],
    pros: Array.isArray(o.pros) ? o.pros.slice(0, 2) : [],
  }));

  const byId = new Map(offers.map((x: any) => [x.id, x]));
  const ordered = ids.map((id: string) => byId.get(id)).filter(Boolean);

  return NextResponse.json({ ok: true, offers: ordered });
}
