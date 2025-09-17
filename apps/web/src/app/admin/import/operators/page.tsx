"use client";
import { useSearchParams } from 'next/navigation';
"use client";
import { useState } from "react";

export default function Page() {
  const key = (useSearchParams().get("key")) ?? `";
  const [summary, setSummary] = useState<any>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [url, setUrl] = useState<string>("");

  async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const r = await fetch("/api/admin/import/operators/preview?key=" + encodeURIComponent(key), {
      method: "POST",
      body: fd,
    });
    const j = await r.json();
    setSummary(j.summary);
    setPreview(j.preview || []);
  }

  async function fetchUrl() {
    const r = await fetch("/api/admin/import/operators/preview?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const j = await r.json();
    setSummary(j.summary);
    setPreview(j.preview || []);
  }

  async function commit() {
    const items = preview.filter((p) => p.kind === "CREATE" || p.kind === "UPDATE");
    const r = await fetch(`/api/admin/import/operators/commit?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const j = await r.json();
    alert(j.ok ? `Created: ${j.created} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Updated: ${j.updated}` : "Commit failed");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Admin ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Import operatori</h1>
      <p className="mt-2 text-sm opacity-80">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ncarcÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ CSV sau indicÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ un URL CSV (Google Sheets ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾Publish to webÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â).</p>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <form onSubmit={uploadFile} className="rounded border p-3">
          <h2 className="text-lg font-semibold">Upload CSV</h2>
          <input type="file" name="file" accept=".csv,text/csv" className="mt-2 block" required />
          <button className="mt-3 rounded border px-3 py-2">Preview</button>
        </form>

        <div className="rounded border p-3">
          <h2 className="text-lg font-semibold">CSV URL</h2>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID}"
            className="mt-2 w-full rounded border px-3 py-2"
          />
          <button className="mt-3 rounded border px-3 py-2" onClick={fetchUrl}>
            Preview
          </button>
          <p className="mt-2 text-xs opacity-70">Sheets: File ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Share ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Publish to web ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ CSV; foloseÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢te linkul de export.</p>
        </div>
      </section>

      {summary && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Rezumat</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <span className="rounded border px-2 py-1">CREATE: {summary.create}</span>
            <span className="rounded border px-2 py-1">UPDATE: {summary.update}</span>
            <span className="rounded border px-2 py-1">SKIP: {summary.skip}</span>
            <span className="rounded border px-2 py-1">INVALID: {summary.invalid}</span>
          </div>
          <button className="mt-4 rounded border px-3 py-2 font-semibold" onClick={commit}>
            Commit changes
          </button>
        </section>
      )}

      {preview.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Website</th>
                <th className="p-2 text-left">ONJN ID</th>
                <th className="p-2 text-left">Expiry</th>
                <th className="p-2 text-left">Licensed</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p, i) => {
                if (p.kind === "CREATE") {
                  const r = p.proposed;
                  return (
                    <tr key={i} className="border-t bg-emerald-50/50">
                      <td className="p-2">CREATE</td>
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.slug}</td>
                      <td className="p-2">{r.website || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{r.onjnLicenseId || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{r.onjnLicenseExpiry ? new Date(r.onjnLicenseExpiry).toLocaleDateString("ro-RO") : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{r.isLicensedRO ? "DA" : "NU"}</td>
                    </tr>
                  );
                }
                if (p.kind === "UPDATE") {
                  return (
                    <tr key={i} className="border-t bg-amber-50/50">
                      <td className="p-2">UPDATE</td>
                      <td className="p-2">{p.before.name}</td>
                      <td className="p-2">{p.patch.slug ?? p.before.slug}</td>
                      <td className="p-2">{p.patch.website ?? p.before.website ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.patch.onjnLicenseId ?? p.before.onjnLicenseId ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">
                        {(p.patch.onjnLicenseExpiry ?? p.before.onjnLicenseExpiry)
                          ? new Date(p.patch.onjnLicenseExpiry ?? p.before.onjnLicenseExpiry).toLocaleDateString("ro-RO")
                          : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                      </td>
                      <td className="p-2">{(p.patch.isLicensedRO ?? p.before.isLicensedRO) ? "DA" : "NU"}</td>
                    </tr>
                  );
                }
                if (p.kind === "SKIP") {
                  return (
                    <tr key={i} className="border-t opacity-70">
                      <td className="p-2">SKIP</td>
                      <td className="p-2">{p.row.name ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.row.slug ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.row.website ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.row.onjnLicenseId ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.row.onjnLicenseExpiry ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                      <td className="p-2">{p.row.isLicensed ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={i} className="border-t bg-rose-50/80">
                    <td className="p-2">INVALID</td>
                    <td className="p-2">{p.row?.name ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                    <td className="p-2" colSpan={5}>
                      {p.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
