"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { memo } from "react";
import OffersGrid from "./OffersGrid";

type Offer = any;

const LoadMoreOffers = memo(function LoadMoreOffers({ initialCount = 50, limit = 50 }: { initialCount?: number; limit?: number }) {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOffers = useCallback(async (signal: AbortSignal) => {
    try {
      // Use intersection observer to defer loading until needed
      if ("requestIdleCallback" in window) {
        await new Promise<void>((res) => (window as any).requestIdleCallback(() => res(), { timeout: 1000 }));
      }
      
      const rsp = await fetch(`/api/offers?offset=${initialCount}&limit=${limit}`, { 
        signal,
        cache: 'force-cache',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
      
      const data = await rsp.json();
      if (data?.ok && Array.isArray(data.offers)) {
        setOffers(data.offers);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.warn('Failed to load offers:', e);
        setError("not-available");
      }
    } finally {
      setLoading(false);
    }
  }, [initialCount, limit]);

  useEffect(() => {
    const controller = new AbortController();
    loadOffers(controller.signal);
    return () => controller.abort();
  }, [loadOffers]);

  const skeletonItems = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="h-[340px] rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 animate-pulse">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-white/10" />
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-white/10" />
            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-white/10" />
          </div>
          <div className="mt-6 h-11 w-full rounded-xl bg-neutral-200 dark:bg-white/10" />
        </div>
      </div>
    )), []);

  if (loading) {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skeletonItems}
        </div>
      </div>
    );
  }

  if (error || !offers || offers.length === 0) return null;

  return (
    <div className="mt-6">
      <OffersGrid offers={offers} />
    </div>
  );
});

export default LoadMoreOffers;
