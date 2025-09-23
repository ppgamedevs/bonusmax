import Image from 'next/image';
import Link from 'next/link';

export default function CompareRecommendation({
  offer,
  metrics,
}: {
  offer: {
    id: string;
    brand: string;
    logoUrl?: string | null;
    headline?: string | null;
    terms?: string | null;
    isLicensedRO?: boolean;
    isSponsored?: boolean;
  };
  metrics: { clicks: number; revenue: number; epc: number; days?: number };
}) {
  const days = metrics.days ?? 30;
  return (
    <section className="mt-8 rounded-2xl border border-white/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold">Recomandarea noastră</h2>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          Bazat pe EPC {days}z
        </span>
      </div>

      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[auto,1fr,auto]">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-black/10 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/10">
          {offer.logoUrl ? (
            <Image src={offer.logoUrl} alt="" width={48} height={48} />
          ) : (
            <div className="h-6 w-6 rounded bg-white/20" />
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-base font-semibold">{offer.brand}</div>
            {offer.isLicensedRO && <span className="chip-accent">Licențiat ONJN</span>}
            {offer.isSponsored && <span className="chip-accent">Sponsored</span>}
          </div>
          {offer.headline && <div className="mt-1 text-sm">{offer.headline}</div>}
          {offer.terms && <div className="text-xs opacity-70">{offer.terms}</div>}

          <div className="mt-2 text-xs opacity-70">
            EPC: {metrics.epc.toFixed(2)} RON • Clickuri: {metrics.clicks} • Venit:{' '}
            {metrics.revenue.toFixed(2)} RON
          </div>
        </div>

        <div className="min-w-[200px]">
          <Link
            href={`/go/${offer.id}?utm_content=reco_widget&utm_campaign=compara_reco` as any}
            rel="nofollow sponsored noopener"
            className="btn-accent h-11 w-full"
            aria-label={`Revendică bonusul la ${offer.brand}`}
          >
            Revendică bonusul
          </Link>
          <div className="mt-1 text-[11px] opacity-60">18+ • T&C • Publicitate</div>
        </div>
      </div>
    </section>
  );
}
