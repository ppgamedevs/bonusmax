import prisma, { executeQuery, executeBatchQueries } from './simple-client';
import { OfferType, Prisma } from '@prisma/client';
// Temporarily disabled for build compatibility
// import { withCache, withBatchCache } from '../cache';

export async function getActiveOffers(country = 'RO', opts?: { offset?: number; limit?: number }) {
  // Return empty array during build time when DATABASE_URL is not available
  if (!process.env.DATABASE_URL) {
    return [];
  }
  
  try {
    // Temporarily removed caching for build compatibility
    const take = Math.max(1, Math.min(100, opts?.limit ?? 50));
    const skip = Math.max(0, opts?.offset ?? 0);
    return executeQuery(client => client.offer.findMany({
      where: {
        isActive: true,
        country,
        operator: { isLicensedRO: true },
        AND: [
          { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
          { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
        ],
      },
      select: {
        // Only select needed fields to reduce payload size
        id: true,
        title: true,
        termsShort: true,
        offerType: true,
        priority: true,
        minDeposit: true,
        wrMultiplier: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
        operator: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isLicensedRO: true,
          }
        }
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      // Pagination for performance
      skip,
      take,
    }));
  } catch (error) {
    console.warn('Database connection failed, returning empty array');
    return [];
  }
}

// Search: offers + operators
export async function searchOffersAndOperators(q: string) {
  const query = q.trim();
  if (!query) return { offers: [], operators: [] } as const;

  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      operator: { isLicensedRO: true },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { termsShort: { contains: query, mode: 'insensitive' } },
        { operator: { name: { contains: query, mode: 'insensitive' } } },
      ],
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
        { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
      ],
    },
    include: { operator: true },
    take: 10,
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  });

  const operators = await prisma.operator.findMany({
    where: {
      isLicensedRO: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 5,
    orderBy: { name: 'asc' },
  });

  return { offers, operators } as const;
}

export async function getOfferById(id: string) {
  return prisma.offer.findUnique({ where: { id }, include: { operator: true } });
}

export async function getOperatorBySlug(slug: string) {
  const op = await prisma.operator.findUnique({ where: { slug } });
  if (!op?.isLicensedRO) return null;
  return op;
}

export async function getOperators() {
  return prisma.operator.findMany({ orderBy: { name: 'asc' } });
}

export async function logClick(params: {
  offerId: string;
  operatorId: string;
  ipHash: string;
  userAgent?: string | null;
  referer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}) {
  return prisma.clickEvent.create({ data: params });
}

export async function getOffersByType(
  type: OfferType,
  country = 'RO',
  operatorSlug?: string,
  sort: 'priority' | 'recent' = 'priority',
  filters?: { minWr?: number; maxWr?: number; maxMinDep?: number }
) {
  // Return empty array during build time when DATABASE_URL is not available
  if (!process.env.DATABASE_URL) {
    return [];
  }
  
  try {
    // Temporarily removed caching for build compatibility
    const and: Prisma.OfferWhereInput[] = [
      { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
      { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
    ];
    if (typeof filters?.minWr === 'number') and.push({ wrMultiplier: { gte: filters.minWr } } as any);
    if (typeof filters?.maxWr === 'number') and.push({ wrMultiplier: { lte: filters.maxWr } } as any);
    if (typeof filters?.maxMinDep === 'number')
      and.push({ minDeposit: { lte: filters.maxMinDep } } as any);

    const where: Prisma.OfferWhereInput = {
      isActive: true,
      country,
      offerType: type,
      operator: { isLicensedRO: true, ...(operatorSlug ? { slug: operatorSlug } : {}) } as any,
      AND: and,
    };

    return prisma.offer.findMany({
      where,
      select: {
        // Only select needed fields to reduce payload size
        id: true,
        title: true,
        termsShort: true,
        offerType: true,
        priority: true,
        minDeposit: true,
        wrMultiplier: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
        operator: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            isLicensedRO: true,
          }
        }
      },
      orderBy:
        sort === 'recent' ? [{ createdAt: 'desc' }] : [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: 50, // Limit results for better performance
    });
  } catch (error) {
    console.warn('Database connection failed, returning empty array');
    return [];
  }
}

// Analytics helpers
export function rangeFromTo(from?: string | null, to?: string | null) {
  const end = to ? new Date(to) : new Date();
  const start = from ? new Date(from) : new Date(end.getTime() - 7 * 864e5);
  return { start, end };
}

export async function analyticsClicksByOffer(from?: string | null, to?: string | null) {
  const { start, end } = rangeFromTo(from, to);
  const grouped = await prisma.clickEvent.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: end } },
    _count: { offerId: true },
  });
  const ids = grouped.map((g) => g.offerId);
  const offers = await prisma.offer.findMany({
    where: { id: { in: ids } },
    include: { operator: true },
  });
  const map = new Map(offers.map((o) => [o.id, o] as const));
  return grouped.map((g) => ({ offer: map.get(g.offerId)!, clicks: g._count.offerId }));
}

export async function analyticsImpressionsByOffer(from?: string | null, to?: string | null) {
  const { start, end } = rangeFromTo(from, to);
  const grouped = await (prisma as any).offerImpression.groupBy({
    by: ['offerId'],
    where: { ts: { gte: start, lte: end } },
    _count: { offerId: true },
  });
  return new Map(grouped.map((g: any) => [g.offerId, g._count.offerId] as const));
}

export async function analyticsByOperator(from?: string | null, to?: string | null) {
  const { start, end } = rangeFromTo(from, to);
  const clicks = await prisma.clickEvent.groupBy({
    by: ['operatorId'],
    where: { ts: { gte: start, lte: end } },
    _count: { operatorId: true },
  });
  const imps: any[] = await (prisma as any).offerImpression.groupBy({
    by: ['operatorId'],
    where: { ts: { gte: start, lte: end } },
    _count: { operatorId: true },
  });
  const opIds = Array.from(
    new Set([...clicks.map((c) => c.operatorId), ...imps.map((i) => i.operatorId)])
  );
  const ops = await prisma.operator.findMany({ where: { id: { in: opIds } } });
  const impMap = new Map(imps.map((i: any) => [i.operatorId, i._count.operatorId] as const));
  const opMap = new Map(ops.map((o) => [o.id, o] as const));
  return clicks.map((c) => {
    const impressions = (impMap.get(c.operatorId) as number | undefined) ?? 0;
    const ctr = impressions ? (c._count.operatorId as number) / impressions : 0;
    return { operator: opMap.get(c.operatorId)!, clicks: c._count.operatorId, impressions, ctr };
  });
}

// ---- Promo placements ----
export async function getActivePromos(
  slot: 'HOME_TOP' | 'HUB_FARA_DEP' | 'HUB_ROTIRI' | 'OPERATOR_TOP',
  country = 'RO',
  limit = 3
) {
  // Return empty array during build time when DATABASE_URL is not available
  if (!process.env.DATABASE_URL) {
    return [];
  }
  
  try {
    // Temporarily removed caching for build compatibility
    const now = new Date();
    return (prisma as any).promoPlacement.findMany({
      where: {
        slot,
        country,
        isActive: true,
        offer: { isActive: true, country, operator: { isLicensedRO: true } },
        AND: [
          { OR: [{ startAt: null }, { startAt: { lte: now } }] },
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      include: { offer: { include: { operator: true } } },
      orderBy: [{ weight: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    });
  } catch (error) {
    console.warn('Database connection failed, returning empty array');
    return [];
  }
}

export async function getPromotedOrFallbackOffers(
  slot: 'HOME_TOP' | 'HUB_FARA_DEP' | 'HUB_ROTIRI',
  country = 'RO',
  fallbackLimit = 3
) {
  const promos = await getActivePromos(slot, country, fallbackLimit) as any[];
  if (promos.length > 0) return promos.map((p: any) => p.offer);
  const type = slot === 'HUB_ROTIRI' ? OfferType.ROTIRI : OfferType.FARA_DEPUNERE;
  return prisma.offer.findMany({
    where: {
      isActive: true,
      country,
      offerType: type,
      operator: { isLicensedRO: true },
    },
    include: { operator: true },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    take: fallbackLimit,
  });
}
