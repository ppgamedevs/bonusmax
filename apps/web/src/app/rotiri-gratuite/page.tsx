// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
import { OfferType } from '@prisma/client';
import { getOffersByType, getActivePromos } from '@bonusmax/lib';
import FilterBar from '@/components/FilterBar';
import DisclosureBar from '@/components/DisclosureBar';
import PromoStrip from '@/components/PromoStrip';
import OffersGrid from '@/components/offers/OffersGrid';
import BackHome from '@/components/BackHome';
import NextDynamic from 'next/dynamic';
const CompareUIDynamic = NextDynamic(() => import('@/components/compare/CompareUI'));

function parseNumber(v: string | string[] | undefined) {
  if (!v || Array.isArray(v)) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const sp = (await searchParams) || ({} as Record<string, string | string[]>);
  const operator = typeof sp.operator === 'string' ? sp.operator : undefined;
  const sort = typeof sp.sort === 'string' ? (sp.sort as 'priority' | 'recent') : 'priority';
  const minWr = parseNumber(sp.min_wr);
  const maxWr = parseNumber(sp.max_wr);
  const maxMinDep = parseNumber(sp.max_min_dep);
  const view = typeof sp.view === 'string' ? sp.view : undefined;

  // Provide fallback data during build time when DATABASE_URL is not available
  let offers: any[] = [];
  let promos: any[] = [];

  if (process.env.DATABASE_URL) {
    try {
      // Combine queries (caching temporarily removed for build compatibility)
      const results = await Promise.all([
        getOffersByType(OfferType.ROTIRI, 'RO', operator, sort, {
          minWr,
          maxWr,
          maxMinDep,
        }),
        getActivePromos('HUB_ROTIRI', 'RO', 3)
      ]) as [any[], any[]];
      offers = results[0] || [];
      promos = results[1] || [];
    } catch (error) {
      console.warn('Database connection failed during build, using fallback data');
      offers = [];
      promos = [];
    }
  }
  const pinCap = 2; // cap number of pinned sponsored items
  const promoOffers = promos.slice(0, pinCap).map((p: any) => ({ ...p.offer, isSponsored: true }));
  const merged = [
    ...promoOffers,
    ...offers.filter((o: any) => !promoOffers.some((p: any) => p.id === o.id)),
  ];

  return (
    <main className="container mx-auto px-4 py-8" id="main">
      <h1 className="text-2xl font-bold mb-4">Rotiri gratuite</h1>
      <BackHome />
      <DisclosureBar />
      {/* Sponsored strip (kept for visibility); the list below is also pinned */}
      <PromoStrip slot="HUB_ROTIRI" title="Sponsored — Rotiri gratuite" />
      <FilterBar
        basePath="/rotiri-gratuite"
        currentOperator={operator ?? null}
        currentSort={sort}
        currentMinWr={minWr ?? null}
        currentMaxWr={maxWr ?? null}
        currentMaxMinDep={maxMinDep ?? null}
      />

      {view === 'table' ? (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Operator</th>
              <th className="text-left p-2">Ofertă</th>
              <th className="p-2">WR</th>
              <th className="p-2">Min Dep</th>
              <th className="text-left p-2">T&C</th>
              <th className="p-2">CTA</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.operator.name}</td>
                <td className="p-2">
                  <a href={`/bonus/${o.id}`} className="underline">
                    {o.title}
                  </a>
                </td>
                <td className="p-2 text-center">{o.wrMultiplier ?? '-'}</td>
                <td className="p-2 text-center">{o.minDeposit ?? '-'}</td>
                <td className="p-2">{o.termsShort}</td>
                <td className="p-2">
                  <a
                    href={`/go/${o.id}`}
                    rel="nofollow sponsored"
                    className="rounded border px-3 py-1"
                  >
                    Revendică
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <OffersGrid offers={merged} />
          <p className="mt-4 text-[12px] opacity-70">
            Unele oferte sunt sponsorizate. Marcăm clar toate plasările. 18+
          </p>
        </>
      )}
      
      {/* Compare UI */}
      <CompareUIDynamic />
    </main>
  );
}
