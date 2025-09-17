"use client";
import { useMemo, useState } from "react";
import TopTodayCarouselClient from "./TopTodayCarouselClient";

type Offer = any;

type TabKey = "popular" | "no_deposit" | "highest_value";

function sortOffers(offers: Offer[], key: TabKey): Offer[] {
  const list = [...offers];
  switch (key) {
    case "no_deposit":
      return list
        .filter((o) => o.offerType === "FARA_DEPUNERE" || (typeof o.minDeposit === "number" && o.minDeposit === 0))
        .concat(list.filter((o) => o.offerType !== "FARA_DEPUNERE" && (o.minDeposit !== 0)));
    case "highest_value": {
      // Heuristic: lower WR multiplier first, then higher maxCashout, then lower minDeposit
      return list.sort((a, b) => {
        const wrA = typeof a.wrMultiplier === "number" ? a.wrMultiplier : 99;
        const wrB = typeof b.wrMultiplier === "number" ? b.wrMultiplier : 99;
        if (wrA !== wrB) return wrA - wrB;
        const mcA = typeof a.maxCashout === "number" ? a.maxCashout : 0;
        const mcB = typeof b.maxCashout === "number" ? b.maxCashout : 0;
        if (mcA !== mcB) return mcB - mcA;
        const mdA = typeof a.minDeposit === "number" ? a.minDeposit : 9999;
        const mdB = typeof b.minDeposit === "number" ? b.minDeposit : 9999;
        return mdA - mdB;
      });
    }
    case "popular":
    default:
      return list; // keep API order (CTR/recency ranking)
  }
}

export default function TopBonusesSectionClient({ offers }: { offers: Offer[] }) {
  const [tab, setTab] = useState<TabKey>("popular");
  const items = useMemo(() => sortOffers(offers, tab), [offers, tab]);
  return (
    <div className="mt-2">
      {/* Sorting tabs */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {([
          { key: "popular", label: "Most Popular" },
          { key: "no_deposit", label: "Best No-Deposit" },
          { key: "highest_value", label: "Highest Value" },
        ] as { key: TabKey; label: string }[]).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              "rounded-xl border px-3 py-1.5 text-sm focus-accent " +
              (tab === t.key ? "btn-accent" : "hover:bg-white/10 border-white/20")
            }
            aria-pressed={tab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      <TopTodayCarouselClient offers={items} />
    </div>
  );
}
