// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';
import { defaultMetadata, absoluteUrl } from '@bonusmax/lib/seo';
import { getActiveOffers, prisma } from '@bonusmax/lib';
import OffersGrid from '@/components/offers/OffersGrid';
import LoadMoreOffers from '@/components/offers/LoadMoreOffers';
import DisclosureBar from '@/components/DisclosureBar';
import Hero from '@/components/home/Hero';
import TopTodayHeader from '@/components/home/TopTodayHeader';
import HeroOfferMockupServer from '@/components/home/HeroOfferMockupServer';
import NextDynamic from 'next/dynamic';
const CompareUIDynamic = NextDynamic(() => import('@/components/compare/CompareUI'));
const TrustBarMobileDynamic = NextDynamic(() => import('@/components/TrustBarMobile'));
const StickyCtaMobileDynamic = NextDynamic(() => import('@/components/StickyCtaMobile'));
import TrustSafety from '@/components/home/TrustSafety';
import GuidesTeaser from '@/components/home/GuidesTeaser';
import FaqAccordion from '@/components/home/FaqAccordion';
import SocialProof from '@/components/SocialProof';
import TopToday from '@/components/TopToday';
import PromoStrip from '@/components/PromoStrip';
import { Suspense } from 'react';
import { SkeletonCards, SkeletonStats } from '@/components/Skeletons';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import DeferOnIdle from '@/components/DeferOnIdle';

export const metadata = defaultMetadata({
  title: 'Top bonusuri',
  alternates: { canonical: absoluteUrl('/') },
});

export default async function HomePage() {
  // Provide fallback data during build time when DATABASE_URL is not available
  let offers: any[] = [];
  let betano: any = null;

  if (process.env.DATABASE_URL && prisma) {
    try {
      // Database queries with optimized selects (limit initial payload)
      const results = await Promise.all([
        getActiveOffers('RO', { limit: 12 }),
        prisma.offer.findFirst({
          where: {
            isActive: true,
            operator: {
              name: { contains: 'Betano', mode: 'insensitive' },
            },
          },
          include: { operator: true },
          orderBy: { updatedAt: 'desc' },
        }) as Promise<any>
      ]);
      offers = Array.isArray(results[0]) ? results[0] : [];
      betano = results[1] || null;
    } catch (error) {
      console.warn('Database connection failed during build, using fallback data');
      offers = [];
      betano = null;
    }
  }
  const heroProps = betano
    ? {
        brand: betano.operator?.name || betano.brand || 'Betano',
        logoUrl: betano.operator?.logoUrl || betano.logoUrl || '/logos/betano.png',
        headline: betano.title || betano.headline || '600 RON Bonus + 50 Rotiri',
        wr: (betano as any).wrMultiplier || (betano as any).wr || 'x30',
        days: (betano as any).validDays || (betano as any).validityDays || 7,
        minDeposit:
          typeof (betano as any).minDeposit === 'number'
            ? (betano as any).minDeposit
            : (betano as any).min_deposit || 20,
        ctaHref: `/go/${betano.id}` as any,
      }
    : undefined;
  return (
    <main id="main" className="mx-auto max-w-screen-xl">
      {/* Chapter 1: Hero + Dynamic Hero Offer */}
      <Hero />
      <HeroOfferMockupServer {...(heroProps || {})} />
      {/* Moved full Trust & Safety section here instead of small signals strip */}
      <div className="cv-auto ci-360">
        <TrustSafety />
      </div>
      <div className="cv-auto ci-280">
        <Suspense fallback={<SkeletonStats />}>
          <SocialProof />
        </Suspense>
      </div>
      {/* Chapter 2: Top bonuses carousel */}
      <div className="cv-auto ci-120">
        <PromoStrip slot="HOME_TOP" title="Sponsored pe homepage" />
      </div>
      <div className="cv-auto ci-80">
        <TopTodayHeader />
      </div>
      <div className="cv-auto ci-360">
      {/* Chapter 3: Comparison grid */}
      <section className="mx-auto mt-10 max-w-6xl px-4 cv-auto ci-1200">
        <h2 className="text-xl font-bold u-underline-hover">Toate ofertele recomandate</h2>
        <DisclosureBar />
        <div className="mt-4">
          {offers.length > 0 ? (
            <OffersGrid offers={offers} />
          ) : (
            <div className="mt-4 text-center text-sm opacity-80">Nu sunt oferte active momentan.</div>
          )}
          {/* Lazy-load the rest of the offers after FCP. If SSR returned 0, fetch from offset 0. */}
          <LoadMoreOffers initialCount={offers.length} limit={36} />
        </div>
        <p className="mt-4 text-[12px] opacity-70">
          Unele oferte sunt sponsorizate. Marcăm clar toate plasările. 18+
        </p>
      </section>
      </div>
      {/* Chapter 4: Recommended offers (promo placements) */}
      <div className="cv-auto ci-120">
        <PromoStrip slot="OPERATOR_TOP" title="Recomandările noastre" />
      </div>
      {/* Chapter 5: Trust & Safety (moved above, removed here) */}
      {/* Chapter 6: Guides */}
      <div className="cv-auto ci-520">
        <GuidesTeaser />
      </div>
      <div className="cv-auto ci-520">
        <FaqAccordion />
      </div>
      {/* Newsletter & spacing before footer */}
      <div className="cv-auto ci-420">
        <NewsletterSignup />
      </div>
      {/* Leave a bit of space before CompareUI */}
      <div className="mt-6 cv-auto ci-200">
        <DeferOnIdle>
          <CompareUIDynamic />
        </DeferOnIdle>
      </div>
      <div className="cv-auto ci-120">
        <DeferOnIdle>
          <TrustBarMobileDynamic />
        </DeferOnIdle>
      </div>
      <div className="cv-auto ci-80">
        <DeferOnIdle>
          <StickyCtaMobileDynamic />
        </DeferOnIdle>
      </div>
    </main>
  );
}
