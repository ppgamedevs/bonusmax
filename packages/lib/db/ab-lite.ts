import { prisma } from "../index";

function range30() {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 864e5);
  return { start, end };
}

export async function uiCtrReport(component: "sticky_bar" | "exit_modal") {
  const end = new Date();
  const start = new Date(end.getTime() - 30 * 864e5);
  const [impA, impB] = await Promise.all([
    (prisma as any).uiImpression.count({ where: { component, ts: { gte: start, lte: end }, variant: "A" } }),
    (prisma as any).uiImpression.count({ where: { component, ts: { gte: start, lte: end }, variant: "B" } }),
  ]);
  const keyA = `${component}_A`;
  const keyB = `${component}_B`;
  const [clkA, clkB] = await Promise.all([
    (prisma as any).clickEvent.count({ where: { ts: { gte: start, lte: end }, utmContent: keyA } }),
    (prisma as any).clickEvent.count({ where: { ts: { gte: start, lte: end }, utmContent: keyB } }),
  ]);
  const impRows = await (prisma as any).uiImpression.findMany({
    where: { component, ts: { gte: start, lte: end } },
    select: { path: true, variant: true },
    take: 5000,
  });
  const perPath = new Map<string, { A: number; B: number }>();
  for (const r of impRows) {
    const row = perPath.get((r as any).path) || { A: 0, B: 0 };
    ((r as any).variant === "B" ? row.B++ : row.A++);
    perPath.set((r as any).path, row);
  }
  const clickRows = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end }, utmContent: { in: [keyA, keyB] } },
    select: { utmContent: true, landingPath: true },
    take: 5000,
  });
  const perPathClk = new Map<string, { A: number; B: number }>();
  for (const c of clickRows) {
    const path = (c as any).landingPath || "(direct)";
    const row = perPathClk.get(path) || { A: 0, B: 0 };
    ((c as any).utmContent === keyB ? row.B++ : row.A++);
    perPathClk.set(path, row);
  }
  const pathTable = Array.from(perPath.entries())
    .map(([path, imp]) => {
      const clk = perPathClk.get(path) || { A: 0, B: 0 };
      return [
        { path, variant: "A", impressions: imp.A, clicks: clk.A, ctr: imp.A ? clk.A / imp.A : 0 },
        { path, variant: "B", impressions: imp.B, clicks: clk.B, ctr: imp.B ? clk.B / imp.B : 0 },
      ];
    })
    .flat()
    .filter((r) => r.impressions >= 10)
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 30);

  return {
    total: [
      { variant: "A", impressions: impA, clicks: clkA, ctr: impA ? clkA / impA : 0 },
      { variant: "B", impressions: impB, clicks: clkB, ctr: impB ? clkB / impB : 0 },
    ],
    perPath: pathTable,
  };
}

export async function abReportCta() {
  const { start, end } = range30();
  const clicks = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end }, expCtaCopy: { not: null } },
    select: { id: true, expCtaCopy: true, landingPath: true },
  });
  const byVar = new Map<string, { clicks: number; ids: string[]; byPath: Map<string, { clicks: number; ids: string[] }> }>();
  for (const c of clicks) {
    const v = (c as any).expCtaCopy || "A";
    const b = byVar.get(v) || { clicks: 0, ids: [], byPath: new Map() };
    b.clicks++;
    b.ids.push((c as any).id);
    const p = (c as any).landingPath || "(direct)";
    const bp = b.byPath.get(p) || { clicks: 0, ids: [] };
    bp.clicks++;
    bp.ids.push((c as any).id);
    b.byPath.set(p, bp);
    byVar.set(v, b);
  }
  const rev = await (prisma as any).revenueEvent.findMany({
    where: { ts: { gte: start, lte: end }, clickId: { not: null } },
    select: { clickId: true, amount: true },
  });
  const revByClick = new Map<string, number>();
  for (const r of rev) revByClick.set((r as any).clickId!, (revByClick.get((r as any).clickId!) || 0) + (r as any).amount);
  const sum = (ids: string[]) => ids.reduce((s, id) => s + (revByClick.get(id) || 0), 0);

  const total = Array.from(byVar.entries())
    .map(([v, b]) => ({ variant: v, clicks: b.clicks, revenue: sum(b.ids), epc: b.clicks ? sum(b.ids) / b.clicks : 0 }))
    .sort((a, b) => b.epc - a.epc);

  const perPath = Array.from(byVar.entries())
    .flatMap(([v, b]) => Array.from(b.byPath.entries()).map(([path, bp]) => ({ variant: v, path, clicks: bp.clicks, revenue: sum(bp.ids), epc: bp.clicks ? sum(bp.ids) / bp.clicks : 0 })))
    .filter((r) => r.clicks >= 10)
    .sort((a, b) => b.epc - a.epc)
    .slice(0, 50);

  return { total, perPath };
}

export async function abReportOrder() {
  const { start, end } = range30();
  const clicks = await (prisma as any).clickEvent.findMany({
    where: { ts: { gte: start, lte: end }, expOffersOrder: { not: null } },
    select: { id: true, expOffersOrder: true },
  });
  const byVar = new Map<string, { clicks: number; ids: string[] }>();
  for (const c of clicks) {
    const v = (c as any).expOffersOrder || "A";
    const b = byVar.get(v) || { clicks: 0, ids: [] };
    b.clicks++;
    b.ids.push((c as any).id);
    byVar.set(v, b);
  }
  const rev = await (prisma as any).revenueEvent.findMany({
    where: { ts: { gte: start, lte: end }, clickId: { not: null } },
    select: { clickId: true, amount: true },
  });
  const revByClick = new Map<string, number>();
  for (const r of rev) revByClick.set((r as any).clickId!, (revByClick.get((r as any).clickId!) || 0) + (r as any).amount);
  const sum = (ids: string[]) => ids.reduce((s, id) => s + (revByClick.get(id) || 0), 0);

  const total = Array.from(byVar.entries())
    .map(([v, b]) => ({ variant: v, clicks: b.clicks, revenue: sum(b.ids), epc: b.clicks ? sum(b.ids) / b.clicks : 0 }))
    .sort((a, b) => b.epc - a.epc);

  return { total };
}
