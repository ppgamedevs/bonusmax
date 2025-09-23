import prisma from '../db/client';

export async function revenueByOffer(from?: string, to?: string) {
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);
  const end = to ? new Date(to) : new Date();
  const rev = await prisma.revenueEvent.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: end } },
    _sum: { amount: true },
    _count: { offerId: true },
  });
  const clicks = await prisma.clickEvent.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: end } },
    _count: { offerId: true },
  });
  const offerIds = Array.from(
    new Set(rev.map((r) => r.offerId).concat(clicks.map((c) => c.offerId)))
  );
  const offers = await prisma.offer.findMany({
    where: { id: { in: offerIds } },
    include: { operator: true },
  });
  const cMap = new Map(clicks.map((c) => [c.offerId, (c._count.offerId as number) ?? 0] as const));
  const oMap = new Map(offers.map((o) => [o.id, o] as const));
  return rev
    .map((r) => {
      const offer = oMap.get(r.offerId)!;
      const clicks = (cMap.get(r.offerId) as number | undefined) ?? 0;
      const revenue = (r._sum.amount as number | null) ?? 0;
      const epc = clicks ? revenue / clicks : 0;
      return { offer, revenue, clicks, epc, events: (r._count.offerId as number) ?? 0 };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export async function revenueByOperator(from?: string, to?: string) {
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);
  const end = to ? new Date(to) : new Date();
  const rev = await prisma.revenueEvent.groupBy({
    by: ['operatorId'],
    where: { ts: { gte: start, lte: end } },
    _sum: { amount: true },
  });
  const clicks = await prisma.clickEvent.groupBy({
    by: ['operatorId'],
    where: { ts: { gte: start, lte: end } },
    _count: { operatorId: true },
  });
  const ops = await prisma.operator.findMany({
    where: { id: { in: rev.map((r) => r.operatorId) } },
  });
  const cMap = new Map(
    clicks.map((c) => [c.operatorId, (c._count.operatorId as number) ?? 0] as const)
  );
  const oMap = new Map(ops.map((o) => [o.id, o] as const));
  return rev
    .map((r) => {
      const operator = oMap.get(r.operatorId)!;
      const clicks = (cMap.get(r.operatorId) as number | undefined) ?? 0;
      const revenue = (r._sum.amount as number | null) ?? 0;
      const epc = clicks ? revenue / clicks : 0;
      return { operator, revenue, clicks, epc };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export async function spendBySource(from?: string, to?: string) {
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);
  const end = to ? new Date(to) : new Date();
  const spend = await (prisma as any).adSpend.groupBy({
    by: ['source'],
    where: { day: { gte: start, lte: end } },
    _sum: { amount: true },
  });
  return spend.map((s: any) => ({
    source: s.source,
    spend: (s._sum.amount as number | null) ?? 0,
  }));
}
