import { memo, useMemo, Suspense } from 'react';
import OfferCard from './OfferCard';
import { OffersGridSkeleton } from '../LayoutStability';

interface OffersGridProps {
  offers: any[];
  virtualScrolling?: boolean;
  lazyLoad?: boolean;
}

// Memoized offer card data transformation
const transformOfferData = (o: any) => ({
  id: o.id,
  brand: o.operator?.name || o.brand || '',
  logoUrl: o.operator?.logoUrl || o.logoUrl || undefined,
  title: o.title || o.headline,
  terms: o.termsShort ||
    [
      o.wrMultiplier ? `WR x${o.wrMultiplier}` : null,
      typeof o.minDeposit === 'number' ? `min dep ${o.minDeposit} RON` : null,
      o.validDays ? `${o.validDays} zile` : null,
    ]
      .filter(Boolean)
      .join(', ') || '',
  isLicensed: !!(o.operator?.isLicensedRO || o.isLicensedRO),
  isSponsored: !!o.isSponsored,
  ctaHref: `/go/${o.id}`,
  inCompare: o.inCompare,
  wr: o.wrMultiplier || o.wr || null,
  minDeposit: typeof o.minDeposit === 'number' ? o.minDeposit : (o.min_deposit ?? null),
  days: o.validDays || o.validityDays || null,
  spins: o.spins || o.freeSpins || null,
  heroImageUrl: o.heroImageUrl || null,
});

function OffersGrid({ offers, virtualScrolling = false, lazyLoad = true }: OffersGridProps) {
  // Memoize transformed offer data to prevent recalculation
  const transformedOffers = useMemo(
    () => offers.map(transformOfferData),
    [offers]
  );

  // Show skeleton while loading to prevent layout shift
  if (!offers || offers.length === 0) {
    return <OffersGridSkeleton count={6} />;
  }

  // Grid with reserved space to prevent layout shift
  return (
    <Suspense fallback={<OffersGridSkeleton count={transformedOffers.length} />}>
      <div 
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        style={{
          // Reserve minimum height to prevent layout shift
          minHeight: `${Math.ceil(transformedOffers.length / 3) * 280}px`,
          contain: 'layout style', // Optimize for layout stability
        }}
      >
        {transformedOffers.map((offerData) => (
          <OfferCard
            key={offerData.id}
            {...offerData}
          />
        ))}
      </div>
    </Suspense>
  );
}

// Export memoized component with display name for debugging
export default memo(OffersGrid, (prevProps, nextProps) => {
  // Only re-render if offers array actually changed
  return (
    prevProps.offers.length === nextProps.offers.length &&
    prevProps.offers.every((offer, index) => offer.id === nextProps.offers[index]?.id)
  );
});

OffersGrid.displayName = 'OffersGrid';
