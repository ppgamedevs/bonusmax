import { prisma } from "../index";

type Range = { start: Date; end: Date };
function lastDays(days = 30): Range {
  const end = new Date();
  const start = new Date(end.getTime() - days * 864e5);
  return { start, end };
}

/** ReturneazÄƒ EPC per ofertÄƒ: { offerId, clicks, revenue, epc } (doar pentru offerIds cerute) */
export async function offerEpcByOffer(offerIds: string[], days = 30) {
  if (!offerIds?.length) return [] as { offerId: string; clicks: number; revenue: number; epc: number }[];
  const end = new Date();
  const start = new Date(end.getTime() - days * 864e5);

  // Clickuri Ã®n interval pentru offerIds cerute
  const clicks = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end }, offerId: { in: offerIds } },
    select: { id: true, offerId: true },
  });
  if (clicks.length === 0)
    return offerIds.map((id) => ({ offerId: id, clicks: 0, revenue: 0, epc: 0 }));

  const idsByOffer = new Map<string, string[]>();
  for (const c of clicks) {
    const k = (c as any).offerId as string;
    const arr = idsByOffer.get(k) || [];
    arr.push((c as any).id as string);
    idsByOffer.set(k, arr);
  }

  const clickIds = clicks.map((c: { id: string }) => c.id);
  const rev = await (prisma as any).revenueEvent.findMany({
    where: { ts: { gte: start, lte: end }, clickId: { in: clickIds } },
    select: { amount: true, clickId: true },
  });
  const revByClick = new Map<string, number>();
  for (const r of rev) {
    const cid = (r as any).clickId as string;
    revByClick.set(cid, (revByClick.get(cid) || 0) + ((r as any).amount as number));
  }

  const rows: { offerId: string; clicks: number; revenue: number; epc: number }[] = [];
  for (const id of offerIds) {
    const ids = idsByOffer.get(id) || [];
    let revenue = 0;
    for (const cid of ids) revenue += revByClick.get(cid) || 0;
    rows.push({ offerId: id, clicks: ids.length, revenue, epc: ids.length ? revenue / ids.length : 0 });
  }
  return rows;
}

export async function overview30() {
  const { start, end } = lastDays(30);
  const clicks = await (prisma as any).clickEvent.count({ where: { ts: { gte: start, lte: end } } });
  const convs = await (prisma as any).revenueEvent.count({ where: { ts: { gte: start, lte: end } } });
  const revAgg = await (prisma as any).revenueEvent.aggregate({ _sum: { amount: true }, where: { ts: { gte: start, lte: end } } });
  const revenue = revAgg._sum.amount ?? 0;
  const epc = clicks ? revenue / clicks : 0;
  const cvr = clicks ? convs / clicks : 0;
  return { clicks, convs, revenue, epc, cvr };
}

export async function topPagesEpc(days = 30, minClicks = 10, limit = 30) {
  const { start, end } = lastDays(days);
  const clicks = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end } },
    select: { id: true, landingPath: true },
  });
  if (clicks.length === 0) return [] as any[];
  const clickByPath = new Map<string, string[]>();
  for (const c of clicks) {
    const p = (c as any).landingPath || "(direct)";
    const arr = clickByPath.get(p) || [];
    arr.push((c as any).id);
    clickByPath.set(p, arr);
  }
  const rev = await (prisma as any).revenueEvent.findMany({
    where: { ts: { gte: start, lte: end }, clickId: { not: null } },
    select: { amount: true, clickId: true },
  });
  const revByClick = new Map<string, number>();
  for (const r of rev) revByClick.set((r as any).clickId!, (revByClick.get((r as any).clickId!) || 0) + (r as any).amount);

  const rows: { path: string; clicks: number; revenue: number; epc: number }[] = [];
  for (const [path, ids] of clickByPath.entries()) {
    const c = ids.length;
    if (c < minClicks) continue;
    let revenue = 0;
    for (const id of ids) revenue += revByClick.get(id) || 0;
    rows.push({ path, clicks: c, revenue, epc: c ? revenue / c : 0 });
  }
  return rows.sort((a, b) => b.epc - a.epc).slice(0, limit);
}

export async function utmPerformance(days = 30, minClicks = 10, limit = 50) {
  const { start, end } = lastDays(days);
  const clicks = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end } },
    select: { id: true, utmSource: true, utmMedium: true, utmCampaign: true },
  });
  const buckets = new Map<string, { clicks: number; ids: string[] }>();
  const keyOf = (x: any) => `${x.utmSource || "(direct)"}|${x.utmMedium || "-"}|${x.utmCampaign || "-"}`;
  for (const c of clicks) {
    const k = keyOf(c as any);
    const b = buckets.get(k) || { clicks: 0, ids: [] };
    b.clicks++;
    b.ids.push((c as any).id);
    buckets.set(k, b);
  }
  const rev = await (prisma as any).revenueEvent.findMany({
    where: { ts: { gte: start, lte: end }, clickId: { not: null } },
    select: { amount: true, clickId: true },
  });
  const revByClick = new Map<string, number>();
  for (const r of rev) revByClick.set((r as any).clickId!, (revByClick.get((r as any).clickId!) || 0) + (r as any).amount);

  const rows: { source: string; medium: string; campaign: string; clicks: number; revenue: number; epc: number }[] = [];
  for (const [k, b] of buckets.entries()) {
    if (b.clicks < minClicks) continue;
    let revenue = 0;
    for (const id of b.ids) revenue += revByClick.get(id) || 0;
    const [source, medium, campaign] = k.split("|");
    rows.push({ source, medium, campaign, clicks: b.clicks, revenue, epc: b.clicks ? revenue / b.clicks : 0 });
  }
  return rows.sort((a, b) => b.epc - a.epc).slice(0, limit);
}
