'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import OfferCard from '../offers/OfferCard';
import { getCompareIds, toggleCompare } from '../../lib/compare';

function stableSmallOffset(id: string): number {
  // Stable pseudo-random integer in [2,6]
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 2 + (h % 5); // 2..6
}

export default function TopTodayCarouselClient({ offers }: { offers: any[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showEdges, setShowEdges] = useState(false);

  useEffect(() => {
    const load = () => setIds(getCompareIds());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  // Detect if horizontal overflow exists; only then show edge gradients
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 1;
      setShowEdges(hasOverflow);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const items = useMemo(() => offers || [], [offers]);

  const onToggle = (id: string) => {
    setIds(toggleCompare(id));
  };

  return (
    <div className="relative pb-2 md:pb-3">
      {/* gradient edges */}
      {showEdges && (
        <>
          <div
            className="pointer-events-none absolute inset-y-1 left-0 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-black/5 to-transparent dark:from-black/25 rounded-l"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-1 right-0 w-4 md:w-6 lg:w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-black/25 rounded-r"
            aria-hidden
          />
        </>
      )}
      <div ref={scrollerRef} className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex snap-x snap-mandatory gap-4 pb-2">
          {items.map((o: any) => {
            const inCompare = ids.includes(o.id);
            const real = typeof o.clicks24h === 'number' ? o.clicks24h : 0;
            const claims = Math.max(0, real) + stableSmallOffset(o.id);
            return (
              <motion.div
                key={o.id}
                className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%]"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <OfferCard
                  id={o.id}
                  brand={o.operator?.name || o.brand || ''}
                  logoUrl={o.operator?.logoUrl || o.logoUrl || undefined}
                  title={o.title || o.headline}
                  terms={o.termsShort || ''}
                  isLicensed={!!(o.operator?.isLicensedRO || o.isLicensedRO)}
                  isSponsored={!!o.isSponsored}
                  ctaHref={`/go/${o.id}`}
                  inCompare={inCompare}
                  onCompareToggle={() => onToggle(o.id)}
                  wr={o.wrMultiplier || o.wr || null}
                  minDeposit={
                    typeof o.minDeposit === 'number' ? o.minDeposit : (o.min_deposit ?? null)
                  }
                  days={o.validDays || o.validityDays || null}
                  spins={o.spins || o.freeSpins || null}
                  heroImageUrl={o.heroImageUrl || null}
                />
                <div className="mt-2 text-[11px] opacity-80">
                  <span className="chip-accent">🔥 {claims} revendicări azi</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* nav arrows */}
      <div className="pointer-events-none absolute inset-y-0 left-1 right-1 flex items-center justify-between">
        <button
          type="button"
          aria-label="Scroll left"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/80 text-black text-xl shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/80 dark:text-white"
          onClick={() => {
            const el = scrollerRef.current;
            if (!el) return;
            el.scrollBy({ left: -Math.max(320, el.clientWidth * 0.7), behavior: 'smooth' });
          }}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/80 text-black text-xl shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/80 dark:text-white"
          onClick={() => {
            const el = scrollerRef.current;
            if (!el) return;
            el.scrollBy({ left: Math.max(320, el.clientWidth * 0.7), behavior: 'smooth' });
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
