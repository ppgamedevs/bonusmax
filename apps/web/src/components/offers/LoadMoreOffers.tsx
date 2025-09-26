"use client";

import { useEffect, useState } from "react";
import OffersGrid from "./OffersGrid";

type Offer = any;

export default function LoadMoreOffers({ initialCount = 12, limit = 36 }: { initialCount?: number; limit?: number }) {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Defer network until idle to not compete with FCP
        if ("requestIdleCallback" in window) {
          await new Promise<void>((res) => (window as any).requestIdleCallback(() => res(), { timeout: 1500 }));
        }
        const rsp = await fetch(`/api/offers?offset=${initialCount}&limit=${limit}`, { next: { revalidate: 300 } });
        const data = await rsp.json();
        if (!cancelled && data?.ok) setOffers(Array.isArray(data.offers) ? data.offers : []);
      } catch (e) {
        if (!cancelled) setError("not-available");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [initialCount, limit]);

  if (error || !offers || offers.length === 0) return null;

  return (
    <div className="mt-6">
      <OffersGrid offers={offers} />
    </div>
  );
}
