"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function heuristicBestValue(list: any[]) {
  // Lower WR, then higher maxCashout, then lower minDeposit
  let best = list[0]?.id as string | undefined;
  let scoreBest = Number.NEGATIVE_INFINITY;
  for (const o of list) {
    const wr = typeof o.wrMultiplier === "number" ? o.wrMultiplier : 99;
    const mc = typeof o.maxCashout === "number" ? o.maxCashout : 0;
    const md = typeof o.minDeposit === "number" ? o.minDeposit : 9999;
    const score = -wr * 1000 + mc - md; // crude but effective
    if (score > scoreBest) {
      scoreBest = score; best = o.id;
    }
  }
  return best;
}

export default function HomeCompareSectionClient() {
  const [offers, setOffers] = useState<any[] | null>(null);

  useEffect(() => {
    try {
      const rawA = localStorage.getItem("bmx_compare_ids");
      const rawB = localStorage.getItem("bm_compare_ids");
      const raw = rawA ?? rawB;
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      if (!ids.length) { setOffers([]); return; }
      fetch("/api/offers/by-ids", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids }) })
        .then((r) => r.json())
        .then((j) => setOffers(j?.offers || []))
        .catch(() => setOffers([]));
    } catch { setOffers([]); }
  }, []);

  const bestId = useMemo(() => (offers && offers.length ? heuristicBestValue(offers) : undefined), [offers]);

  if (offers === null) return null;

  return (
    <section className="mx-auto mt-10 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">ComparaÃˆâ€ºie Bonusuri</h2>
        <p className="mt-1 text-sm opacity-70">Alege 2Ã¢â‚¬â€œ3 oferte Ãˆâ„¢i comparÃ„Æ’-le rapid. CautÃ„Æ’ Ã¢â‚¬Å¾ComparaÃ¢â‚¬Â pe carduri pentru a selecta.</p>
      </header>

      {(!offers || offers.length < 2) ? (
        <p className="text-sm opacity-80">AdaugÃ„Æ’ cel puÃˆâ€ºin 2 oferte pentru a ÃƒÂ®ncepe comparaÃˆâ€ºia.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="sticky top-0 z-[1] bg-white/70 backdrop-blur dark:bg-black/50">
                  <th className="w-40 p-3 text-left text-xs font-semibold opacity-70">Criteriu</th>
                  {offers.map((o) => (
                    <th key={o.id} className="min-w-[220px] align-top p-3">
                      <div className={(o.id===bestId?"ring-1 ring-violet-300/40 bg-violet-500/[0.05] ":"")+"rounded-lg p-2"}>
                        <div className="flex items-center gap-2">
                          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/10 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/10">
                            {o.logoUrl ? (<Image src={o.logoUrl} alt="" width={40} height={40} />) : (<div className="h-6 w-6 rounded bg-white/20" />)}
                          </div>
                          <div>
                            <div className="font-semibold">{o.brand}</div>
                            <div className="text-[11px] opacity-70">{o.headline || ""}</div>
                          </div>
                          {o.id===bestId && (
                            <span className="ml-auto rounded-full bg-violet-500/15 px-2 py-[2px] text-[10px] font-medium text-violet-600 dark:text-violet-400">Best Value</span>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Max bonus", val: (o:any)=> o.maxBonus || o.headline || "Ã¢â‚¬â€" },
                  { label: "WR", val: (o:any)=> o.wr || (o.wrMultiplier?`x${o.wrMultiplier}`:"Ã¢â‚¬â€") },
                  { label: "Depunere minimÃ„Æ’", val: (o:any)=> (typeof o.minDeposit==="number"? `${o.minDeposit} RON` : (o.minDeposit || "Ã¢â‚¬â€")) },
                  { label: "Rotiri gratuite", val: (o:any)=> o.spins || o.freeSpins || "Ã¢â‚¬â€" },
                  { label: "Valabilitate", val: (o:any)=> o.validity || (o.validDays? `${o.validDays} zile` : "Ã¢â‚¬â€") },
                ].map((row, idx) => (
                  <tr key={row.label} className={(idx%2===0?"bg-white/5 dark:bg-white/5":"bg-white/10 dark:bg-black/10")+" border-t border-white/10"}>
                    <td className="w-40 p-3 text-xs opacity-70">{row.label}</td>
                    {offers.map((o) => (
                      <td key={o.id} className="min-w-[220px] align-top p-3">
                        <div className={(o.id===bestId?"ring-1 ring-violet-300/40 bg-violet-500/[0.05] ":"")+"rounded-lg p-2"}>
                          {(row.val(o))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-white/10">
                  <td className="p-3 text-xs opacity-70">AcÃˆâ€ºiune</td>
                  {offers.map((o) => (
                    <td key={o.id} className="min-w-[220px] align-top p-3">
                      <div className={(o.id===bestId?"ring-1 ring-violet-300/40 bg-violet-500/[0.05] ":"")+"rounded-lg p-2"}>
                        <Link href={`/go/${o.id}` as any} rel="nofollow sponsored noopener" className="btn-accent h-10 w-full">RevendicÃ„Æ’ bonusul</Link>
                        <div className="mt-1 text-[11px] opacity-60">18+ Ã¢â‚¬Â¢ T&C Ã¢â‚¬Â¢ Publicitate</div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards with swipe */}
          <div className="md:hidden -mx-4 overflow-x-auto px-4 mt-2">
            <div className="flex snap-x snap-mandatory gap-3 pb-2">
              {offers.map((o) => (
                <div key={o.id} className={(o.id===bestId?"ring-1 ring-violet-300/40 bg-violet-500/[0.05] ":"")+"snap-start shrink-0 basis-[90%] rounded-2xl border border-white/10 p-4"}>
                  <div className="flex items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/10 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/10">
                      {o.logoUrl ? (<Image src={o.logoUrl} alt="" width={40} height={40} />) : (<div className="h-6 w-6 rounded bg-white/20" />)}
                    </div>
                    <div>
                      <div className="font-semibold">{o.brand}</div>
                      <div className="text-[11px] opacity-70">{o.headline || ""}</div>
                    </div>
                    {o.id===bestId && (<span className="ml-auto chip-accent">Best Value</span>)}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li><span className="opacity-70">Max bonus:</span> {o.maxBonus || o.headline || "Ã¢â‚¬â€"}</li>
                    <li><span className="opacity-70">WR:</span> {o.wr || (o.wrMultiplier?`x${o.wrMultiplier}`:"Ã¢â‚¬â€")}</li>
                    <li><span className="opacity-70">Min dep:</span> {typeof o.minDeposit==="number"? `${o.minDeposit} RON` : (o.minDeposit || "Ã¢â‚¬â€")}</li>
                    <li><span className="opacity-70">Rotiri:</span> {o.spins || o.freeSpins || "Ã¢â‚¬â€"}</li>
                    <li><span className="opacity-70">Valabilitate:</span> {o.validity || (o.validDays? `${o.validDays} zile` : "Ã¢â‚¬â€")}</li>
                  </ul>
                  <Link href={`/go/${o.id}` as any} rel="nofollow sponsored noopener" className="btn-accent mt-3 h-11 w-full">RevendicÃ„Æ’ bonusul</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href={("/compara" as any)} className="btn-accent h-11 px-6 focus-accent">Alege bonusul Ãˆâ„¢i revendicÃ„Æ’ acum Ã¢â€ â€™</Link>
          </div>
        </>
      )}
    </section>
  );
}
