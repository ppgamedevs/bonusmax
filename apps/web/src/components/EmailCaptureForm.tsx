"use client";
import { useState } from "react";

export default function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setMsg("");
    try {
      const r = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) throw new Error("Request failed");
      setStatus("ok");
      setMsg("Gata! Ți-am trimis un email de confirmare.");
    } catch {
      setStatus("error");
      setMsg("Nu am reușit să trimitem emailul. Verifică adresa și încearcă din nou.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col items-start gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="email@exemplu.ro"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-xs rounded-xl border bg-transparent px-4 py-2"
      />
      <button className="rounded-xl border px-4 py-2 font-semibold" type="submit">Primește alerte</button>
      {msg && <p className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>{msg}</p>}
    </form>
  );
}
