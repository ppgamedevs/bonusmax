"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from "react";


  const sp = useSearchParams();
  const key = sp.get('key') || '';
  const key = key || "";
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>("");

  async function preview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await fetch(`/api/admin/outreach/prospects/preview?key=${encodeURIComponent(key)}`, { method: "POST", body: fd });
    const j = await r.json();
    setItems(j.items || []);
    setSummary(`Found ${j.count} rows`);
  }
  async function commit() {
    const r = await fetch(`/api/admin/outreach/prospects/commit?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const j = await r.json();
    alert(`OK: created ${j.created}, skipped ${j.skipped}`);
  }
  const high = useMemo(() => items.filter((x) => (x.dr || 0) >= 50), [items]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Outreach ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Prospects</h1>
      <form onSubmit={preview} className="mt-4 rounded border p-3">
        <input type="file" name="file" accept=".csv" required />
        <button className="ml-3 rounded border px-3 py-2">Preview</button>
      </form>
      <div className="mt-3 text-sm opacity-70">{summary}</div>

      {items.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded border px-2 py-1">High DR: {high.length}</span>
            <a className="rounded border px-2 py-1" href={`/api/admin/outreach/prospects/export?key=${encodeURIComponent(key)}&minScore=60`}>
              Export CSV ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°Ãƒâ€šÃ‚Â¥60
            </a>
            <button onClick={commit} className="rounded border px-3 py-2 font-semibold">
              Commit to DB
            </button>
          </div>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">email</th>
                <th className="p-2">name</th>
                <th className="p-2">site</th>
                <th className="p-2">DR</th>
                <th className="p-2">topic</th>
                <th className="p-2">notes</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 300).map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.site}</td>
                  <td className="p-2 text-center">{r.dr || "-"}</td>
                  <td className="p-2">{r.topic}</td>
                  <td className="p-2">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
