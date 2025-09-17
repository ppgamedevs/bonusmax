import { NextResponse } from "next/server";
import { prisma, toBaseCurrency } from "@bonusmax/lib";

function ok(u: URL) {
  return !!process.env.AFF_POSTBACK_KEY && u.searchParams.get("key") === process.env.AFF_POSTBACK_KEY;
}

function pick(u: URL) {
  const sp = u.searchParams;
  const get = (arr: string[]) => arr.map((k) => sp.get(k)).find(Boolean) || undefined;
  return {
    subid: get(["subid", "s2", "aff_sub", "click_id", "clickid", "aff_click_id", "sid"]),
    amount: Number(get(["amount", "payout", "commission", "value"]) || "0"),
    currency: get(["currency", "curr"]) || "RON",
    txid: get(["txid", "transaction_id", "conversion_id", "cid"]) || undefined,
    event: get(["event", "type", "goal"]) || "OTHER",
    status: get(["status", "state"]) || "approved",
  } as const;
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const network = await (prisma as any).affiliateNetwork.findUnique({ where: { slug: params.slug } });
  if (!network) return NextResponse.json({ ok: false, error: "network" }, { status: 404 });

  const p = pick(url);

  const click = p.subid ? await (prisma as any).clickEvent.findUnique({ where: { id: p.subid } }) : null;
  if (!click) return NextResponse.json({ ok: false, error: "click_not_found" }, { status: 400 });

  const offer = await (prisma as any).offer.findUnique({ where: { id: click.offerId } });
  if (!offer) return NextResponse.json({ ok: false, error: "offer" }, { status: 404 });

  if (p.txid) {
    const exists = await (prisma as any).revenueEvent.findFirst({ where: { networkId: network.id, txId: p.txid } });
    if (exists) return NextResponse.json({ ok: true, duplicated: true });
  }

  const typeMap: Record<string, any> = {
    reg: "REG",
    registration: "REG",
    ftd: "FTD",
    deposit: "FTD",
    cpa: "CPA",
    rev: "REVSHARE",
    revshare: "REVSHARE",
    bonus: "BONUS",
  };
  const key = (p.event || "OTHER").toLowerCase();
  const type = (typeMap[key] ?? "OTHER") as any;

  const amountBase = toBaseCurrency(p.amount || 0, (p.currency || network.currency));

  await (prisma as any).revenueEvent.create({
    data: {
      networkId: network.id,
      offerId: click.offerId,
      operatorId: click.operatorId,
      clickId: click.id,
      subid: p.subid,
      txId: p.txid,
      type,
      status: p.status,
      amount: amountBase,
      currency: process.env.BASE_CURRENCY || "RON",
      meta: JSON.stringify({ rawCurrency: p.currency, rawAmount: p.amount }),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: any) {
  const url = new URL(req.url);
  const body = await req.text();
  const q = new URLSearchParams(body);
  q.forEach((v, k) => url.searchParams.set(k, v));
  return GET(new Request(url.toString()), ctx);
}
