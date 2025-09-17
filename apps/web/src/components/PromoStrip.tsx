import { getActivePromos } from "@bonusmax/lib";
import OffersGrid from "./offers/OffersGrid";
import { SponsoredBadge } from "./Badges";

export default async function PromoStrip({ slot, title = "Sponsored" }: { slot: "HOME_TOP"|"HUB_FARA_DEP"|"HUB_ROTIRI"|"OPERATOR_TOP"; title?: string }) {
  const promos = await getActivePromos(slot, "RO", 3);
  if (!promos.length) return null;
  const offers = promos.map((p: any) => ({ ...p.offer, isSponsored: true }));
  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold opacity-80 u-accent-text">{title}</h2>
        <SponsoredBadge />
      </div>
      <OffersGrid offers={offers} />
      <p className="mt-3 text-xs opacity-60">ConÃˆâ€ºinut comercial. 18+ JoacÃ„Æ’ responsabil.</p>
    </section>
  );
}
