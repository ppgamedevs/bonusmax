// Server component by default
import type { ReactNode } from 'react';
import TopTodayCarouselEnhancer from './TopTodayCarouselEnhancer';

export default function TopTodayCarousel({ id, children }: { id: string; children: ReactNode }) {
  // Server-rendered scroll container with minimal client enhancer for arrows
  return (
    <div className="relative pb-2 md:pb-3">
      {/* gradient edges (kept lightweight; enhancer can hide them if desired) */}
      <div
        className="pointer-events-none absolute inset-y-1 left-0 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-black/5 to-transparent dark:from-black/25 rounded-l"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-1 right-0 w-4 md:w-6 lg:w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-black/25 rounded-r"
        aria-hidden
      />

      <div id={`${id}-scroller`} className="-mx-4 overflow-x-auto px-4 scrollbar-none">
        <div className="flex snap-x snap-mandatory gap-4 pb-2" style={{ minHeight: 280 }}>
          {children}
        </div>
      </div>

      {/* nav arrows (wired by client enhancer) */}
      <div className="pointer-events-none absolute inset-y-0 left-1 right-1 flex items-center justify-between">
        <button id={`${id}-left`} type="button" aria-label="Scroll left" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/80 text-black text-xl shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/80 dark:text-white">‹</button>
        <button id={`${id}-right`} type="button" aria-label="Scroll right" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/80 text-black text-xl shadow-sm backdrop-blur hover:bg-white focus-accent dark:bg-neutral-800/80 dark:text-white">›</button>
      </div>

      {/* Minimal client-side behavior for arrows */}
      <TopTodayCarouselEnhancer id={id} />
    </div>
  );
}
