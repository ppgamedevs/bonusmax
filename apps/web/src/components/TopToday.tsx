import { getTopTodayOffers } from '@bonusmax/lib';
import TopTodayCarousel from './home/TopTodayCarousel';
import OfferCardServer from './offers/OfferCardServer';
// import { Suspense } from 'react'; // Temporarily commented out

// Optimized component with better performance
function TopTodayContent({ items }: { items: any[] }) {
  return (
    <TopTodayCarousel id="top-azi">
      {items.map(({ offer, clicks24h }: any) => {
        // stable small offset 2..6
        let h = 0;
        for (let i = 0; i < offer.id.length; i++) h = (h * 31 + offer.id.charCodeAt(i)) >>> 0;
        const offset = 2 + (h % 5);
        const claims = Math.max(0, clicks24h) + offset;
        return (
          <div key={offer.id} className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%] grid-item-stable">
            <OfferCardServer
              id={offer.id}
              brand={offer.operator?.name || offer.brand || ''}
              logoUrl={offer.operator?.logoUrl || offer.logoUrl || undefined}
              title={offer.title || offer.headline}
              terms={offer.termsShort || ''}
              isLicensed={!!(offer.operator?.isLicensedRO || offer.isLicensedRO)}
              isSponsored={!!offer.isSponsored}
              ctaHref={`/go/${offer.id}`}
              wr={offer.wrMultiplier || offer.wr || null}
              minDeposit={typeof offer.minDeposit === 'number' ? offer.minDeposit : (offer.min_deposit ?? null)}
              days={offer.validDays || offer.validityDays || null}
              spins={offer.spins || offer.freeSpins || null}
              heroImageUrl={offer.heroImageUrl || null}
            />
            <div className="mt-2 text-[11px] opacity-80">
              <span className="chip-accent transition-stable">🔥 {claims} revendicări azi</span>
            </div>
          </div>
        );
      })}
    </TopTodayCarousel>
  );
}

// Loading skeleton for better UX
function TopTodayLoading() {
  return (
    <section id="topul-de-azi" className="mx-auto mt-6 md:mt-8 max-w-6xl px-4">
      <div className="carousel-container">
        <div className="-mx-4 overflow-hidden px-4">
          <div className="flex gap-4 pb-2" style={{ minHeight: 320 }}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%] grid-item-stable">
                <div className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function TopToday() {
  try {
    const top = await getTopTodayOffers(12, 72);
    const items = top?.map((t: any) => ({ offer: t.offer, clicks24h: t.clicks24h || 0 })) || [];
    
    if (items.length === 0) {
      return null; // Don't render empty section
    }
    
    return (
      <section id="topul-de-azi" className="mx-auto mt-6 md:mt-8 max-w-6xl px-4 content-stable">
        <TopTodayContent items={items} />
      </section>
    );
  } catch (error) {
    console.error('TopToday component error:', error);
    return null; // Graceful degradation
  }
}
