"use client";

import { Suspense } from "react";
export const dynamic = "force-dynamic";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function PageContent() {
  const sp = useSearchParams();
  const key = sp.get("key") || "";

  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>("");

  async function preview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const url = new URL("/api/admin/outreach/prospects/preview", window.location.origin);
    if (key) url.searchParams.set("key", key);
    const r = await fetch(url.toString(), { method: "POST", body: fd });
    const j = await r.json();
    setItems(j.items || []);
    setSummary(j.summary || "");
  }

  async function commit() {
    const url = new URL("/api/admin/outreach/prospects/commit", window.location.origin);
    if (key) url.searchParams.set("key", key);
    const toCommit = items.filter((p: any) => p && (p.kind === "CREATE" || p.kind === "UPDATE"));
    const r = await fetch(url.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: toCommit }),
    });
    const j = await r.json();
    // eslint-disable-next-line no-alert
    alert(j && j.ok ? ("Created: " + (j.created || 0) + " Updated: " + (j.updated || 0)) : "Commit failed");
  }

  const high = useMemo(() => items.filter((x: any) => (x.dr || 0) >= 50), [items]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Outreach Prospects</h1>

      <form onSubmit={preview} className="mt-4 rounded border p-3">
        <input type="file" name="file" accept=".csv" required />
        <button className="ml-3 rounded border px-3 py-2">Preview</button>
      </form>

      <div className="mt-3 text-sm opacity-70">{summary}</div>

      {items.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded border px-2 py-1">High DR: {high.length}</span>
            <a
              className="rounded border px-2 py-1"
              href={"/api/admin/outreach/prospects/export?key=" + encodeURIComponent(key) + "&minScore=60"}
            >
              Export CSV &gt;=60
            </a>
            <button onClick={commit} type="button" className="rounded border px-3 py-2 font-semibold">
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
              {items.slice(0, 300).map((r: any, i: number) => (
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

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
