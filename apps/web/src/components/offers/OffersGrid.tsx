import { memo, useMemo } from 'react';
import { useVirtualScrolling, useIntersectionObserver } from '@bonusmax/lib/performance';
import OfferCard from './OfferCard';

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

// Memoized offer card component
const MemoizedOfferCard = memo(OfferCard, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.inCompare === nextProps.inCompare &&
    prevProps.brand === nextProps.brand &&
    prevProps.title === nextProps.title
  );
});

// Lazy loaded offer card for intersection observer
const LazyOfferCard = memo(({ offerData, index }: { offerData: any; index: number }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Load 100px before coming into view
  });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ minHeight: '200px' }}>
      {isVisible ? (
        <MemoizedOfferCard {...offerData} />
      ) : (
        <div className="animate-pulse bg-gray-200 rounded-lg h-48" />
      )}
    </div>
  );
});

function OffersGrid({ offers, virtualScrolling = false, lazyLoad = true }: OffersGridProps) {
  // Memoize transformed offer data to prevent recalculation
  const transformedOffers = useMemo(
    () => offers.map(transformOfferData),
    [offers]
  );

  // Virtual scrolling for large datasets
  if (virtualScrolling && offers.length > 50) {
    const { visibleItems, startIndex, totalHeight, offsetY } = useVirtualScrolling(
      transformedOffers,
      250, // Estimated item height
      800  // Container height
    );

    return (
      <div style={{ height: '800px', overflow: 'auto' }}>
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {visibleItems.map((offerData, index) => (
              <MemoizedOfferCard
                key={offerData.id}
                {...offerData}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular grid with optional lazy loading
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {transformedOffers.map((offerData, index) => 
        lazyLoad && index > 6 ? (
          <LazyOfferCard
            key={offerData.id}
            offerData={offerData}
            index={index}
          />
        ) : (
          <MemoizedOfferCard
            key={offerData.id}
            {...offerData}
          />
        )
      )}
    </div>
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
