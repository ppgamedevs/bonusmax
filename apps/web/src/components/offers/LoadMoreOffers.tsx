"use client";

import { useEffect, useState } from "react";
import OffersGrid from "./OffersGrid";

type Offer = any;

export default function LoadMoreOffers({ initialCount = 50, limit = 50 }: { initialCount?: number; limit?: number }) {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Defer network until idle to not compete with FCP
        if ("requestIdleCallback" in window) {
          await new Promise<void>((res) => (window as any).requestIdleCallback(() => res(), { timeout: 1500 }));
        }
        const rsp = await fetch(`/api/offers?offset=${initialCount}&limit=${limit}`, { cache: 'force-cache', next: { revalidate: 300 } });
        const data = await rsp.json();
        if (!cancelled && data?.ok) setOffers(Array.isArray(data.offers) ? data.offers : []);
      } catch (e) {
        if (!cancelled) setError("not-available");
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [initialCount, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[340px] rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5" />
        ))}
      </div>
    );
  }

  if (error || !offers || offers.length === 0) return null;

  return (
    <div className="mt-6">
      <OffersGrid offers={offers} />
    </div>
  );
}
