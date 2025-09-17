"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export type OfferLite = {
  id: string;
  brand: string;
  logoUrl?: string | null;
  headline?: string | null;
  terms?: string | null;
  isLicensedRO?: boolean;
  isSponsored?: boolean;
  wr?: string | null;
  minDeposit?: string | null;
  validity?: string | null;
  timeLimit?: string | null;
  maxBonus?: string | null;
  spins?: string | null;
  app?: string | null;
  payments?: string[];
  pros?: string[];
};

export default function CompareTable({
  offers,
  highlightOfferId,
  badgeLabel = "Top EPC",
}: {
  offers: OfferLite[];
  highlightOfferId?: string;
  badgeLabel?: string;
}) {
  if (!offers?.length) {
    return <p className="text-sm opacity-80">Nu ai ales încă oferte pentru comparație.</p>;
  }

  const colClass = "min-w-[220px] align-top p-3";
  const yes = (
    <span className="rounded bg-emerald-500/15 px-2 py-[2px] text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
      Da
    </span>
  );
  const no = (
    <span className="rounded bg-neutral-500/10 px-2 py-[2px] text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
      —
    </span>
  );

  const colWrap = (isWinner: boolean) =>
    clsx("rounded-lg p-2", isWinner && "ring-1 ring-violet-300/40 bg-violet-500/[0.05]");

  return (
    <>
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="sticky top-0 z-[1] bg-white/70 backdrop-blur dark:bg-black/50">
            <th className="w-40 p-3 text-left text-xs font-semibold opacity-70">Criteriu</th>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <th key={o.id} className={colClass}>
                  <div className={colWrap(win)}>
                    <div className="flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/10 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/10">
                        {o.logoUrl ? (
                          <Image src={o.logoUrl} alt="" width={40} height={40} />
                        ) : (
                          <div className="h-6 w-6 rounded bg-white/20" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{o.brand}</div>
                        <div className="flex items-center gap-2 text-[11px]">
                          {o.isLicensedRO ? (
                            <span className="chip-accent">Licențiat ONJN</span>
                          ) : (
                            <span className="opacity-70">—</span>
                          )}
                          {o.isSponsored && (
                            <span className="chip-accent">Sponsored</span>
                          )}
                        </div>
                      </div>
                      {win && (
                        <span
                          className="ml-auto rounded-full bg-violet-500/15 px-2 py-[2px] text-[10px] font-medium text-violet-600 dark:text-violet-400"
                          aria-label="Câștigător EPC (30 zile)"
                          title="Câștigător EPC (30 zile)"
                        >
                          ⭐ {badgeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-white/10 even:bg-white/5 dark:even:bg-white/5">
            <td className="w-40 p-3 text-xs opacity-70">Oferta</td>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <td key={o.id} className={colClass}>
                  <div className={colWrap(win)}>
                    <div className="font-semibold">{o.headline || "—"}</div>
                    <div className="mt-1 text-xs opacity-75">{o.terms || ""}</div>
                  </div>
                </td>
              );
            })}
          </tr>

          <tr className="border-t border-white/10 even:bg-white/5 dark:even:bg-white/5">
            <td className="p-3 text-xs opacity-70">De ce ne place</td>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <td key={o.id} className={colClass}>
                  <div className={colWrap(win)}>
                    {o.pros?.length ? (
                      <ul className="list-disc pl-5">
                        {o.pros.slice(0, 2).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ) : (
                      no
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          {[ 
            { label: "Max bonus", key: "maxBonus" as const },
            { label: "WR", key: "wr" as const },
            { label: "Depunere minimă", key: "minDeposit" as const },
            { label: "Rotiri gratuite", key: "spins" as const },
            { label: "Timp limită", key: "timeLimit" as const },
            { label: "Valabilitate bonus", key: "validity" as const },
          ].map((row, index) => (
            <tr key={row.label} className={clsx("border-t border-white/10", index % 2 === 0 ? "bg-white/5 dark:bg-white/5" : "bg-white/10 dark:bg-black/10")}>
              <td className="p-3 text-xs opacity-70">{row.label}</td>
              {offers.map((o) => {
                const win = o.id === highlightOfferId;
                const val = (o as any)[row.key] || no;
                return (
                  <td key={o.id} className={colClass}>
                    <div className={colWrap(win)}>{val}</div>
                  </td>
                );
              })}
            </tr>
          ))}

          <tr className="border-t border-white/10 even:bg-white/5 dark:even:bg-white/5">
            <td className="p-3 text-xs opacity-70">Aplicație mobilă</td>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <td key={o.id} className={colClass}>
                  <div className={colWrap(win)}>{o.app ? <span className="text-xs">{o.app}</span> : no}</div>
                </td>
              );
            })}
          </tr>

          <tr className="border-t border-white/10 even:bg-white/5 dark:even:bg-white/5">
            <td className="p-3 text-xs opacity-70">Plăți</td>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <td key={o.id} className={colClass}>
                  <div className={colWrap(win)}>
                    {o.payments?.length ? (
                      <div className="text-xs opacity-80">{o.payments.join(" • ")}</div>
                    ) : (
                      no
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          <tr className="border-t border-white/10 even:bg-white/5 dark:even:bg-white/5">
            <td className="p-3 text-xs opacity-70">Acțiune</td>
            {offers.map((o) => {
              const win = o.id === highlightOfferId;
              return (
                <td key={o.id} className={colClass}>
                  <div className={colWrap(win)}>
                    <Link
                      href={`/go/${o.id}?utm_content=compare_table` as any}
                      className="btn-accent h-10 w-full"
                      rel="nofollow sponsored noopener"
                      aria-label={`Revendică bonusul la ${o.brand}`}
                    >
                      Revendică bonusul
                    </Link>
                    <div className="mt-1 text-[11px] opacity-60">18+ • T&C • Publicitate</div>
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex justify-center">
      <Link href={("/compara" as any)} className="btn-accent h-11 px-6 focus-accent">
        Alege bonusul →
      </Link>
    </div>
    </>
  );
}
