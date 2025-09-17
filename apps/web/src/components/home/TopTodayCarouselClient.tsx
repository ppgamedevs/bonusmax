"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import OfferCard from "../offers/OfferCard";
import { getCompareIds, toggleCompare } from "../../lib/compare";

function pseudoClaims(id: string): number {
  // Stable pseudo-random between 24 and 240 per id
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const n = 24 + (h % 217); // 24..240
  return n;
}

export default function TopTodayCarouselClient({ offers }: { offers: any[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => setIds(getCompareIds());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const items = useMemo(() => offers || [], [offers]);

  const onToggle = (id: string) => {
    setIds(toggleCompare(id));
  };

  return (
    <div className="relative pb-6 md:pb-8">
      {/* gradient edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent dark:from-black/30" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent dark:from-black/30" aria-hidden />
      <div ref={scrollerRef} className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex snap-x snap-mandatory gap-4 pb-2">
          {items.map((o: any) => {
            const inCompare = ids.includes(o.id);
            const claims = o.claims24h ?? pseudoClaims(o.id);
            return (
              <motion.div
                key={o.id}
                className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%]"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <OfferCard
                  id={o.id}
                  brand={o.operator?.name || o.brand || ""}
                  logoUrl={o.operator?.logoUrl || o.logoUrl || undefined}
                  title={o.title || o.headline}
                  terms={o.termsShort || ""}
                  isLicensed={!!(o.operator?.isLicensedRO || o.isLicensedRO)}
                  isSponsored={!!o.isSponsored}
                  ctaHref={`/go/${o.id}`}
                  inCompare={inCompare}
                  onCompareToggle={() => onToggle(o.id)}
                  wr={o.wrMultiplier || o.wr || null}
                  minDeposit={typeof o.minDeposit === "number" ? o.minDeposit : (o.min_deposit ?? null)}
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
          className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/70 text-black shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/70 dark:text-white"
          onClick={() => { const el = scrollerRef.current; if (!el) return; el.scrollBy({ left: -Math.max(320, el.clientWidth * 0.7), behavior: 'smooth' }); }}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/70 text-black shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/70 dark:text-white"
          onClick={() => { const el = scrollerRef.current; if (!el) return; el.scrollBy({ left: Math.max(320, el.clientWidth * 0.7), behavior: 'smooth' }); }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
