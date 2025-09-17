"use client";
import { useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState<string | null>(null);
  async function sub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: fd.get("email") }),
    });
    const j = await r.json();
    setMsg(j.ok ? "VerificÃ„Æ’ emailul (sau foloseÃˆâ„¢te linkul de verificare din admin)." : "Email invalid.");
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Newsletter (sÃ„Æ’ptÃ„Æ’mÃƒÂ¢nal)</h1>
      <p className="mt-2 text-sm opacity-80">Rezumatul sÃ„Æ’ptÃ„Æ’mÃƒÂ¢nii: ONJN, industrie, oferte marcate Ã¢â‚¬Å“ConÃˆâ€ºinut comercialÃ¢â‚¬Â.</p>
      <form onSubmit={sub} className="mt-4 flex gap-2">
        <input name="email" type="email" required placeholder="you@exemplu.ro" className="rounded border px-3 py-2" />
        <button className="rounded border px-3 py-2">AboneazÃ„Æ’-te</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </main>
  );
}
