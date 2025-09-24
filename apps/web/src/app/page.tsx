export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { defaultMetadata, absoluteUrl } from '@bonusmax/lib/seo';
import { getActiveOffers, prisma } from '@bonusmax/lib';
import OffersGrid from '@/components/offers/OffersGrid';
import DisclosureBar from '@/components/DisclosureBar';
import Hero from '@/components/home/Hero';
import TopTodayHeader from '@/components/home/TopTodayHeader';
import HeroOfferMockup from '@/components/home/HeroOfferMockup';
import TrustBarMobile from '@/components/TrustBarMobile';
import StickyCtaMobile from '@/components/StickyCtaMobile';
import StickyHeader from '@/components/layout/StickyHeader';
import CompareUI from '@/components/compare/CompareUI';
import TrustSafety from '@/components/home/TrustSafety';
import GuidesTeaser from '@/components/home/GuidesTeaser';
import FaqAccordion from '@/components/home/FaqAccordion';
import SocialProof from '@/components/SocialProof';
import TopToday from '@/components/TopToday';
import PromoStrip from '@/components/PromoStrip';
import { Suspense } from 'react';
import { SkeletonCards, SkeletonStats } from '@/components/Skeletons';
import NewsletterSignup from '@/components/home/NewsletterSignup';

export const metadata = defaultMetadata({
  title: 'Top bonusuri',
  alternates: { canonical: absoluteUrl('/') },
});

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
      <StickyHeader />
      {/* Chapter 1: Hero + Dynamic Hero Offer */}
      <Hero />
      <HeroOfferMockup {...(heroProps || {})} />
      {/* Moved full Trust & Safety section here instead of small signals strip */}
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '360px' }}>
        <TrustSafety />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '280px' }}>
        <Suspense fallback={<SkeletonStats />}>
          <SocialProof />
        </Suspense>
      </div>
      {/* Chapter 2: Top bonuses carousel */}
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '120px' }}>
        <PromoStrip slot="HOME_TOP" title="Sponsored pe homepage" />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '80px' }}>
        <TopTodayHeader />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '360px' }}>
        <Suspense fallback={<SkeletonCards n={6} />}>
          <TopToday />
        </Suspense>
      </div>
      {/* Chapter 3: Comparison grid */}
      <section className="mx-auto mt-10 max-w-6xl px-4" style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '1200px' }}>
        <h2 className="text-xl font-bold u-underline-hover">Toate ofertele recomandate</h2>
        <DisclosureBar />
        <div className="mt-4">
          <OffersGrid offers={offers} />
        </div>
        <p className="mt-4 text-[12px] opacity-70">
          Unele oferte sunt sponsorizate. Marcăm clar toate plasările. 18+
        </p>
      </section>
      {/* Chapter 4: Recommended offers (promo placements) */}
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '120px' }}>
        <PromoStrip slot="OPERATOR_TOP" title="Recomandările noastre" />
      </div>
      {/* Chapter 5: Trust & Safety (moved above, removed here) */}
      {/* Chapter 6: Guides */}
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '520px' }}>
        <GuidesTeaser />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '520px' }}>
        <FaqAccordion />
      </div>
      {/* Newsletter & spacing before footer */}
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '420px' }}>
        <NewsletterSignup />
      </div>
      {/* Leave a bit of space before CompareUI */}
      <div className="mt-6" style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '200px' }}>
        <CompareUI />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '120px' }}>
        <TrustBarMobile />
      </div>
      <div style={{ contentVisibility: 'auto' as any, containIntrinsicSize: '80px' }}>
        <StickyCtaMobile />
      </div>
    </main>
  );
}
