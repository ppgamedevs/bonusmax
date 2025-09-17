import { defaultMetadata, absoluteUrl } from '@bonusmax/lib/seo';
import { getActiveOffers, prisma } from '@bonusmax/lib';
import OffersGrid from '../components/offers/OffersGrid';
import DisclosureBar from '../components/DisclosureBar';
import Hero from '../components/home/Hero';
import TopTodayHeader from '../components/home/TopTodayHeader';
import HeroOfferMockup from '../components/home/HeroOfferMockup';
import TrustBarMobile from '../components/TrustBarMobile';
import StickyCtaMobile from '../components/StickyCtaMobile';
import StickyHeader from '../components/layout/StickyHeader';
import CompareUI from '../components/compare/CompareUI';
import TrustSafety from '../components/home/TrustSafety';
import GuidesTeaser from '../components/home/GuidesTeaser';
import FaqAccordion from '../components/home/FaqAccordion';
import SocialProof from '../components/SocialProof';
import TopToday from '../components/TopToday';
import PromoStrip from '../components/PromoStrip';
import { Suspense } from 'react';
import { SkeletonCards, SkeletonStats } from '../components/Skeletons';

export const metadata = defaultMetadata({
  title: 'Top bonusuri',
  alternates: { canonical: absoluteUrl('/') }
});

export const dynamic = 'force-static';
export const revalidate = 60;

export default async function HomePage() {
  const offers = await getActiveOffers('RO');
  // Try to fetch a live Betano offer for the hero mockup
  const betano = await (prisma as any).offer.findFirst({
    where: {
      isActive: true,
      operator: {
        name: { contains: 'Betano', mode: 'insensitive' },
      },
    },
    include: { operator: true },
    orderBy: { updatedAt: 'desc' },
  });
  const heroProps = betano ? {
    brand: betano.operator?.name || betano.brand || 'Betano',
    logoUrl: betano.operator?.logoUrl || betano.logoUrl || '/logos/betano.png',
    headline: betano.title || betano.headline || '600 RON Bonus + 50 Rotiri',
    wr: (betano as any).wrMultiplier || (betano as any).wr || 'x30',
    days: (betano as any).validDays || (betano as any).validityDays || 7,
    minDeposit: typeof (betano as any).minDeposit === 'number' ? (betano as any).minDeposit : (betano as any).min_deposit || 20,
    ctaHref: `/go/${betano.id}` as any,
  } : undefined;
  return (
    <main id="main" className="mx-auto max-w-screen-xl">
      <StickyHeader />
      {/* Chapter 1: Hero + Dynamic Hero Offer */}
      <Hero />
      <HeroOfferMockup {...(heroProps || {})} />
      {/* Moved full Trust & Safety section here instead of small signals strip */}
      <TrustSafety />
      <Suspense fallback={<SkeletonStats />}>
        <SocialProof />
      </Suspense>
      {/* Chapter 2: Top bonuses carousel */}
      <PromoStrip slot="HOME_TOP" title="Sponsored pe homepage" />
      <TopTodayHeader />
      <Suspense fallback={<SkeletonCards n={6} />}>
        <TopToday />
      </Suspense>
      {/* Chapter 3: Comparison grid */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-xl font-bold u-underline-hover">Toate ofertele recomandate</h2>
        <DisclosureBar />
        <div className="mt-4">
          <OffersGrid offers={offers} />
        </div>
        <p className="mt-4 text-[12px] opacity-70">Unele oferte sunt sponsorizate. MarcÃ„Æ’m clar toate plasÃ„Æ’rile. 18+</p>
      </section>
      {/* Chapter 4: Recommended offers (promo placements) */}
      <PromoStrip slot="OPERATOR_TOP" title="RecomandÃ„Æ’rile noastre" />
      {/* Chapter 5: Trust & Safety (moved above, removed here) */}
      {/* Chapter 6: Guides */}
      <GuidesTeaser />
      <FaqAccordion />
      <CompareUI />
      <TrustBarMobile />
      <StickyCtaMobile />
    </main>
  );
}
