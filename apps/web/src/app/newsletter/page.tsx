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
    setMsg(j.ok ? "VerificÃƒâ€žÃ†â€™ emailul (sau foloseÃƒË†Ã¢â€žÂ¢te linkul de verificare din admin)." : "Email invalid.");
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Newsletter (sÃƒâ€žÃ†â€™ptÃƒâ€žÃ†â€™mÃƒÆ’Ã‚Â¢nal)</h1>
      <p className="mt-2 text-sm opacity-80">Rezumatul sÃƒâ€žÃ†â€™ptÃƒâ€žÃ†â€™mÃƒÆ’Ã‚Â¢nii: ONJN, industrie, oferte marcate ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œConÃƒË†Ã¢â‚¬Âºinut comercialÃƒÂ¢Ã¢â€šÂ¬Ã‚Â.</p>
      <form onSubmit={sub} className="mt-4 flex gap-2">
        <input name="email" type="email" required placeholder="you@exemplu.ro" className="rounded border px-3 py-2" />
        <button className="rounded border px-3 py-2">AboneazÃƒâ€žÃ†â€™-te</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </main>
  );
}
