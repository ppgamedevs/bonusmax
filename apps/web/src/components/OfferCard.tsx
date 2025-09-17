"use client";

import Link from "next/link";
// Note: avoid client-side A/B decisions here to prevent hydration mismatches
import { useEffect, useState } from "react";
import { getCompareIds } from "../lib/compare";
import { LicensedBadge, SponsoredBadge } from "./Badges";
import dynamic from "next/dynamic";
import HydrateOnVisible from "./HydrateOnVisible";
import Img from "./Img";
const CompareButton = dynamic(() => import("./CompareButton"), { ssr: false });

type OfferCardProps = {
  offer: {
    id: string;
    title: string;
    termsShort?: string | null;
    isSponsored?: boolean | null;
    operator: { name: string; slug: string; logoUrl?: string | null };
  };
};

export default function OfferCard({ offer }: OfferCardProps) {
  const label = "RevendicÃ„Æ’ bonusul";
  const [chosen, setChosen] = useState<string[]>([]);
  useEffect(() => { setChosen(getCompareIds()); }, []);
  const inCompare = chosen.includes(offer.id);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/3 p-4 shadow-sm ring-1 ring-white/5 hover:bg-white/5">
      {/* Badge tray */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">LicenÃˆâ€ºiat ONJN</span>
        {offer.isSponsored ? (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-400">Sponsored</span>
        ) : null}
      </div>

      {/* Top: brand + logo */}
      <div className="flex items-center gap-3 pr-24">
        {offer.operator.logoUrl ? (
          <Img
            src={offer.operator.logoUrl}
            alt={offer.operator.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded object-contain"
            sizes="36px"
          />
        ) : (
          <div className="h-9 w-9 rounded bg-neutral-200 dark:bg-neutral-800" />
        )}
        <div className="text-sm uppercase opacity-75">{offer.operator.name}</div>
      </div>

      {/* Middle: title + terms */}
      <div className="mt-2 flex-1">
        <h3 className="text-base font-semibold leading-tight line-clamp-2">
          <Link prefetch={false} href={("/bonus/" + offer.id) as any} className="underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2">
            {offer.title}
          </Link>
        </h3>
        {offer.termsShort && (
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">{offer.termsShort}</p>
        )}
      </div>

      {/* Bottom: CTA + disclaimer */}
      <div className="mt-3">
        <a
          href={`/go/${offer.id}`}
          rel="nofollow sponsored noopener"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold underline hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {label}
        </a>
        <HydrateOnVisible>
          <CompareButton id={offer.id} initialInCompare={inCompare} />
        </HydrateOnVisible>
        <p className="mt-1 text-[11px] opacity-60">18+ Ã¢â‚¬Â¢ T&C Ã¢â‚¬Â¢ Publicitate</p>
      </div>
    </div>
  );
}
