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

      {/* nav arrows (improved styling) */}
      <div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between">
        <button 
          id={`${id}-left`} 
          type="button" 
          aria-label="Scroll left" 
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border-2 border-white/20 bg-white/90 text-neutral-800 text-2xl font-bold shadow-lg backdrop-blur-sm hover:bg-white hover:border-white/40 hover:shadow-xl focus-accent transition-all duration-200 dark:bg-neutral-900/90 dark:text-white dark:border-neutral-700/50 dark:hover:bg-neutral-800"
        >
          ‹
        </button>
        <button 
          id={`${id}-right`} 
          type="button" 
          aria-label="Scroll right" 
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border-2 border-white/20 bg-white/90 text-neutral-800 text-2xl font-bold shadow-lg backdrop-blur-sm hover:bg-white hover:border-white/40 hover:shadow-xl focus-accent transition-all duration-200 dark:bg-neutral-900/90 dark:text-white dark:border-neutral-700/50 dark:hover:bg-neutral-800"
        >
          ›
        </button>
      </div>

      {/* Minimal client-side behavior for arrows */}
      <TopTodayCarouselEnhancer id={id} />
    </div>
  );
}
