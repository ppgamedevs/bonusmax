"use client";
import { useState } from "react";



export default function Page() {
  const [msg, setMsg] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const r = await fetch("/api/feedy/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    setMsg(j.ok ? "Mulțumim! Linkul tău a intrat în moderare." : "Eroare – verifică URL-ul.");
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Trimite un link</h1>
      <p className="mt-2 text-sm opacity-80">
        Noutăți utile pentru comunitatea iGaming din România (ONJN, responsabilitate, operatori). Fără promisiuni de câștig. 18+.
      </p>
      <form onSubmit={submit} className="mt-4 grid max-w-xl gap-3">
        <label className="text-sm">
          URL*
          <input name="url" required placeholder="https://..." className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Titlu
          <input name="title" className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Notă
          <textarea name="note" rows={3} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="text-sm">
          Email (opțional)
          <input name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <button className="rounded border px-3 py-2">Trimite</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </main>
  );
}
