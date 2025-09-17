"use client";
import Link from 'next/link';
import { useEffect, useState } from "react";
import CompareTable, { type OfferLite } from "./CompareTable";

export default function CompareClient({ hasServer }: { hasServer: boolean }) {
  const [offers, setOffers] = useState<OfferLite[] | null>(null);

  useEffect(() => {
    if (hasServer) return; // pagina are deja date server-side
    try {
      const rawA = localStorage.getItem("bmx_compare_ids");
      const rawB = localStorage.getItem("bm_compare_ids");
      const raw = rawA ?? rawB;
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      if (ids.length) {
        fetch("/api/offers/by-ids", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids }),
        })
          .then((r) => r.json())
          .then((j) => {
            if (j?.ok) setOffers(j.offers);
            else setOffers([]);
          })
          .catch(() => setOffers([]));
      } else {
        setOffers([]);
      }
    } catch {
      setOffers([]);
    }
  }, [hasServer]);

  if (hasServer) return null;
  if (offers === null) return <p className="text-sm opacity-70">Se ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®ncarcÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ comparaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºiaÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦</p>;

  return (
    <div className="mt-6">
      <CompareTable offers={offers} />
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => {
            try {
              localStorage.removeItem("bmx_compare_ids");
              localStorage.removeItem("bm_compare_ids");
            } catch {}
            location.href = "/";
          }}
          className="rounded border px-3 py-1.5 text-sm underline"
        >
          ReseteazÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ comparaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºia
        </button>
        <Link href="/" className="text-sm underline">
          AdaugÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ mai multe oferte
        </Link>
      </div>
    </div>
  );
}
