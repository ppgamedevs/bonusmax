"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Baseline = { clicks: number; impressions: number; ctr: number };

export default function PricingClient() {
  const sp = useSearchParams();
  const key = sp.get("key") || "";
  const [base, setBase] = useState<Baseline>({ clicks: 0, impressions: 0, ctr: 0 });
  const [imps, setImps] = useState<number>(10000);
  const [ctr, setCtr] = useState<number>(0.05);
  const [cpc, setCpc] = useState<number>(2.5);
  const [cpm, setCpm] = useState<number>(60);
  const [flat, setFlat] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/admin/baseline?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok) {
          setBase({ clicks: d.clicks, impressions: d.impressions, ctr: d.ctr });
          setCtr(Math.max(0.01, Math.min(0.15, d.ctr || 0.05)));
        }
      })
      .catch(() => {});
  }, [key]);

  const expectedClicks = Math.round(imps * ctr);
  const costCPC = expectedClicks * cpc;
  const costCPM = (imps / 1000) * cpm;
  const suggested = Math.max(costCPC, costCPM, flat);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Pricing calculator (Sponsored)</h1>
      <p className="mt-2 text-sm opacity-80">
        Baseline 30z: Impr {base.impressions.toLocaleString("ro-RO")} / Clicks {base.clicks.toLocaleString("ro-RO")} / CTR {(base.ctr * 100).toFixed(1)}%
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="rounded border p-3 text-sm">
          Impresii estimate (slot)
          <input className="mt-2 w-full rounded border px-3 py-2" type="number" value={imps} onChange={(e) => setImps(Number(e.target.value || 0))} />
        </label>
        <label className="rounded border p-3 text-sm">
          CTR estimat (%)
          <input className="mt-2 w-full rounded border px-3 py-2" type="number" step={0.1} value={(ctr * 100).toFixed(1)} onChange={(e) => setCtr(Number(e.target.value) / 100)} />
        </label>
        <div className="rounded border p-3 text-sm">
          <div>Clicks așteptate</div>
          <div className="mt-2 text-2xl font-bold">{expectedClicks.toLocaleString("ro-RO")}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="rounded border p-3 text-sm">
          CPC (RON)
          <input className="mt-2 w-full rounded border px-3 py-2" type="number" step={0.1} value={cpc} onChange={(e) => setCpc(Number(e.target.value || 0))} />
        </label>
        <label className="rounded border p-3 text-sm">
          CPM (RON)
          <input className="mt-2 w-full rounded border px-3 py-2" type="number" step={1} value={cpm} onChange={(e) => setCpm(Number(e.target.value || 0))} />
        </label>
        <label className="rounded border p-3 text-sm">
          Preț FLAT (RON)
          <input className="mt-2 w-full rounded border px-3 py-2" type="number" step={1} value={flat} onChange={(e) => setFlat(Number(e.target.value || 0))} />
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded border p-3">
          <div className="text-xs opacity-60">Cost estimat (CPC)</div>
          <div className="text-2xl font-bold">{costCPC.toFixed(0)} RON</div>
        </div>
        <div className="rounded border p-3">
          <div className="text-xs opacity-60">Cost estimat (CPM)</div>
          <div className="text-2xl font-bold">{costCPM.toFixed(0)} RON</div>
        </div>
        <div className="rounded border p-3">
          <div className="text-xs opacity-60">Sugestie (max dintre CPC/CPM/FLAT)</div>
          <div className="text-2xl font-bold">{suggested.toFixed(0)} RON</div>
        </div>
      </div>

      <p className="mt-6 text-xs opacity-60">
        Note: CTR variază în funcție de poziționare și creativ. Folosește valorile din 30 de zile ca punct de plecare.
      </p>
    </main>
  );
}
