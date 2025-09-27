// Server component by default
import type { ReactNode } from 'react';
import TopTodayCarouselEnhancer from './TopTodayCarouselEnhancer';

export default function TopTodayCarousel({ id, children }: { id: string; children: ReactNode }) {
  // Server-rendered scroll container with minimal client enhancer for arrows
  return (
    <div className="relative pb-2 md:pb-3 carousel-container">
      {/* gradient edges (kept lightweight; enhancer can hide them if desired) */}
      <div
        className="pointer-events-none absolute inset-y-1 left-0 w-4 md:w-6 lg:w-8 bg-gradient-to-r from-black/5 to-transparent dark:from-black/25 rounded-l"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-1 right-0 w-4 md:w-6 lg:w-8 bg-gradient-to-l from-black/5 to-transparent dark:from-black/25 rounded-r"
        aria-hidden
      />

      <div id={`${id}-scroller`} className="-mx-4 overflow-x-auto px-4 scrollbar-none carousel-scroller gpu-accelerated">
        <div className="flex snap-x snap-mandatory gap-4 pb-2 will-change-scroll" style={{ minHeight: 320 }}>
          {children}
        </div>
      </div>

      {/* nav arrows (modern styling with proper icons) */}
      <div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between">
        <button 
          id={`${id}-left`} 
          type="button" 
          aria-label="Scroll left" 
          className="pointer-events-auto group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/95 text-neutral-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:border-white/30 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 dark:bg-neutral-800/95 dark:text-neutral-200 dark:border-neutral-600/30 dark:hover:bg-neutral-700 dark:hover:border-neutral-500/40"
        >
          <svg className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          id={`${id}-right`} 
          type="button" 
          aria-label="Scroll right" 
          className="pointer-events-auto group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/95 text-neutral-700 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:border-white/30 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 dark:bg-neutral-800/95 dark:text-neutral-200 dark:border-neutral-600/30 dark:hover:bg-neutral-700 dark:hover:border-neutral-500/40"
        >
          <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Minimal client-side behavior for arrows */}
      <TopTodayCarouselEnhancer id={id} />
    </div>
  );
}
