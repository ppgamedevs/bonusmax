'use client';
import { useState } from 'react';

export default function CalculatorWRClient() {
  const [bonus, setBonus] = useState(200);
  const [wr, setWr] = useState(30);
  const [contrib, setContrib] = useState(100);
  const turnover = Math.round(bonus * wr * (100 / Math.max(1, contrib)));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Calculator WR (Wagering)</h1>
      <p className="mt-2 text-sm opacity-80">
        Calculează rulajul necesar pentru a elibera un bonus. Conținut informativ • 18+
        Joacă responsabil.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="rounded border p-3 text-sm">
          Bonus (RON)
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(Number(e.target.value || 0))}
            className="mt-2 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="rounded border p-3 text-sm">
          WR (x)
          <input
            type="number"
            value={wr}
            onChange={(e) => setWr(Number(e.target.value || 0))}
            className="mt-2 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="rounded border p-3 text-sm">
          % contribuție joc (sloturi=100)
          <input
            type="number"
            value={contrib}
            onChange={(e) => setContrib(Number(e.target.value || 0))}
            className="mt-2 w-full rounded border px-3 py-2"
          />
        </label>
      </div>
      <div className="mt-6 rounded-xl border p-4">
        <div className="text-sm opacity-70">Rulaj estimat necesar</div>
        <div className="text-3xl font-bold">{turnover.toLocaleString('ro-RO')} RON</div>
      </div>
    </main>
  );
}
