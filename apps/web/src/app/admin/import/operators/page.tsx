"use client";
export const dynamic = "force-dynamic";
// @ts-nocheck
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const sp = useSearchParams();
  const key = sp?.get("key") ?? "";

  const [summary, setSummary] = useState(null);
  const [preview, setPreview] = useState([]);
  const [url, setUrl] = useState("");

  async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/admin/import/operators/preview?key=" + encodeURIComponent(key), { method: "POST", body: fd });
    const j = await r.json();
    setPreview((j && j.preview) || []);
    setSummary((j && j.summary) || null);
  }

  async function commit() {
    const items = preview.filter((p:any) => p.kind === "CREATE" || p.kind === "UPDATE");
    const r = await fetch("/api/admin/import/operators/commit?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items })
    });
    const j = await r.json();
    alert(j && j.ok ? ("Created: " + j.created + " - Updated: " + j.updated) : "Commit failed");
  }

  const fmt = (v:any) => (v ?? "-");
  const fmtDate = (v:any) => v ? new Date(v).toLocaleDateString("ro-RO") : "-";

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Import Operators</h1>

      <section className="mt-6">
        <form onSubmit={uploadFile} className="flex gap-3 items-center">
          <input name="file" type="file" accept=".csv,.xlsx" required />
          <button type="submit" className="px-3 py-2 rounded bg-black text-white">Preview</button>
        </form>
      </section>

      {summary && (
        <section className="mt-8">
          <h2 className="font-semibold mb-2">Summary</h2>
          <pre className="text-sm bg-gray-100 p-3 rounded">{JSON.stringify(summary, null, 2)}</pre>
          <button onClick={commit} className="mt-3 px-3 py-2 rounded bg-emerald-600 text-white">Commit</button>
        </section>
      )}

      {preview.length > 0 && (
        <section className="mt-8 overflow-x-auto">
          <table className="min-w-[900px] border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Website</th>
                <th className="p-2 text-left">License Id</th>
                <th className="p-2 text-left">License Expiry</th>
                <th className="p-2 text-left">Licensed RO</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p:any, i:number) => {
                if (p.kind === "CREATE" || p.kind === "UPDATE") {
                  return (
                    <tr key={i} className="border-t">
                      <td className="p-2">{p.kind}</td>
                      <td className="p-2">{fmt(p.patch?.name ?? p.before?.name)}</td>
                      <td className="p-2">{fmt(p.patch?.slug ?? p.before?.slug)}</td>
                      <td className="p-2">{fmt(p.patch?.website ?? p.before?.website)}</td>
                      <td className="p-2">{fmt(p.patch?.onjnLicenseId ?? p.before?.onjnLicenseId)}</td>
                      <td className="p-2">{fmtDate(p.patch?.onjnLicenseExpiry ?? p.before?.onjnLicenseExpiry)}</td>
                      <td className="p-2">{(p.patch?.isLicensedRO ?? p.before?.isLicensedRO) ? "DA" : "NU"}</td>
                    </tr>
                  );
                }
                if (p.kind === "SKIP") {
                  return (
                    <tr key={i} className="border-t opacity-70">
                      <td className="p-2">SKIP</td>
                      <td className="p-2">{fmt(p.row?.name)}</td>
                      <td className="p-2">{fmt(p.row?.slug)}</td>
                      <td className="p-2">{fmt(p.row?.website)}</td>
                      <td className="p-2">{fmt(p.row?.onjnLicenseId)}</td>
                      <td className="p-2">{fmtDate(p.row?.onjnLicenseExpiry)}</td>
                      <td className="p-2">{fmt(p.row?.isLicensedRO)}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={i} className="border-t bg-rose-50/80">
                    <td className="p-2">INVALID</td>
                    <td className="p-2">{fmt(p.row?.name)}</td>
                    <td className="p-2" colSpan={5}>{fmt(p.reason)}</td>
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