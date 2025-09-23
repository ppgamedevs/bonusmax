import OfferCard from './OfferCard';

export default function OffersGrid({ offers }: { offers: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((o: any) => {
        const brand = o.operator?.name || o.brand || '';
        const logoUrl = o.operator?.logoUrl || o.logoUrl || undefined;
        const terms =
          o.termsShort ||
          [
            o.wrMultiplier ? `WR x${o.wrMultiplier}` : null,
            typeof o.minDeposit === 'number' ? `min dep ${o.minDeposit} RON` : null,
            o.validDays ? `${o.validDays} zile` : null,
          ]
            .filter(Boolean)
            .join(', ') ||
          '';
        const isLicensed = !!(o.operator?.isLicensedRO || o.isLicensedRO);
        const isSponsored = !!o.isSponsored;
        const wr = o.wrMultiplier || o.wr || null;
        const minDeposit =
          typeof o.minDeposit === 'number' ? o.minDeposit : (o.min_deposit ?? null);
        const days = o.validDays || o.validityDays || null;
        const spins = o.spins || o.freeSpins || null;
        const heroImageUrl = o.heroImageUrl || null;

        return (
          <OfferCard
            key={o.id}
            id={o.id}
            brand={brand}
            logoUrl={logoUrl}
            title={o.title || o.headline}
            terms={terms}
            isLicensed={isLicensed}
            isSponsored={isSponsored}
            ctaHref={`/go/${o.id}`}
            inCompare={o.inCompare}
            wr={wr}
            minDeposit={minDeposit}
            days={days}
            spins={spins}
            heroImageUrl={heroImageUrl}
          />
        );
      })}
    </div>
  );
}
