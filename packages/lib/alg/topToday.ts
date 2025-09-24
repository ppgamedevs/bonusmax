import { prisma } from '../index';

type RankInput = {
  offerId: string;
  operatorId: string;
  createdAt: Date;
  priority: number;
  clicks: number;
  impressions: number;
};

function bayesCtr(clicks: number, impressions: number, alpha = 3, beta = 50) {
  const c = Math.max(0, clicks);
  const i = Math.max(0, impressions);
  return (c + alpha) / (i + alpha + beta);
}

function hoursSince(d: Date) {
  return (Date.now() - d.getTime()) / 36e5;
}

export function scoreOffer(i: RankInput, opts?: { halfLifeH?: number }) {
  const halfLifeH = opts?.halfLifeH ?? 24;
  const ctr = bayesCtr(i.clicks, i.impressions);
  const clicksTerm = Math.log1p(i.clicks);
  const recencyTerm = Math.exp((-hoursSince(i.createdAt) * Math.log(2)) / halfLifeH);
  const priorityTerm = 1 - Math.min(1, i.priority / 1000);

  const wCtr = 0.55,
    wClicks = 0.15,
    wRecency = 0.2,
    wPriority = 0.1;
  const score =
    wCtr * ctr + wClicks * (clicksTerm / 5) + wRecency * recencyTerm + wPriority * priorityTerm;
  return { score, ctr, clicks: i.clicks, impressions: i.impressions, recency: recencyTerm };
}

export async function getTopTodayOffers(limit = 6, windowHours = 72) {
  const now = new Date();
  const start = new Date(now.getTime() - windowHours * 36e5);
  const start24 = new Date(now.getTime() - 24 * 36e5);

  const clicks = await prisma.clickEvent.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: now } },
    _count: { offerId: true },
  });
  const clicks24 = await prisma.clickEvent.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start24, lte: now } },
    _count: { offerId: true },
  });
  const imps = await (prisma as any).offerImpression.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: now } },
    _count: { offerId: true },
  });
  const impMap: Map<string, number> = new Map(
    imps.map((i: any) => [i.offerId as string, i._count.offerId as number])
  );
  const clkMap: Map<string, number> = new Map(
    clicks.map((c: any) => [c.offerId as string, c._count.offerId as number])
  );
  const clk24Map: Map<string, number> = new Map(
    clicks24.map((c: any) => [c.offerId as string, c._count.offerId as number])
  );

  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      country: 'RO',
      operator: { isLicensedRO: true },
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: now } }] },
        { OR: [{ endAt: null }, { endAt: { gte: now } }] },
      ],
    },
    include: { operator: true },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  });

  const scored: any[] = offers.map((o: any) => {
    const clicks = clkMap.get(o.id) ?? 0;
    const clicks24h = clk24Map.get(o.id) ?? 0;
    const impressions = impMap.get(o.id) ?? 0;
    const s = scoreOffer({
      offerId: o.id,
      operatorId: o.operatorId,
      createdAt: o.createdAt,
      priority: o.priority,
      clicks,
      impressions,
    });
    return { offer: o, clicks24h, ...s };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.offer.priority !== b.offer.priority) return a.offer.priority - b.offer.priority;
    return b.offer.createdAt.getTime() - a.offer.createdAt.getTime();
  });

  return scored.slice(0, limit);
}
