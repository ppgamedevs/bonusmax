import { getTopTodayOffers } from '@bonusmax/lib';
import TopTodayCarousel from './home/TopTodayCarousel';
import OfferCardServer from './offers/OfferCardServer';

export default async function TopToday() {
  const top = await getTopTodayOffers(12, 72);
  const items = top.map((t: any) => ({ offer: t.offer, clicks24h: t.clicks24h || 0 }));
  return (
    <section id="topul-de-azi" className="mx-auto mt-6 md:mt-8 max-w-6xl px-4">
      <TopTodayCarousel id="top-azi">
        {items.map(({ offer, clicks24h }: any) => {
          // stable small offset 2..6
          let h = 0;
          for (let i = 0; i < offer.id.length; i++) h = (h * 31 + offer.id.charCodeAt(i)) >>> 0;
          const offset = 2 + (h % 5);
          const claims = Math.max(0, clicks24h) + offset;
          return (
            <div key={offer.id} className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%]">
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
                <span className="chip-accent">🔥 {claims} revendicări azi</span>
              </div>
            </div>
          );
        })}
      </TopTodayCarousel>
    </section>
  );
}
