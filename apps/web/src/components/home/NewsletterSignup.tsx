"use client";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      // TODO: Wire to your provider (e.g., SendGrid/Mailchimp/Supabase) via an API route
      await new Promise((r) => setTimeout(r, 600));
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
      <h2 className="text-xl font-extrabold tracking-tight">Alerte de bonusuri & oferte exclusive</h2>
      <p className="mt-1 text-sm text-neutral-700 dark:text-zinc-300">
        Primește noutăți despre bonusuri fără depunere, rotiri gratuite și alte oferte verificate. Fără spam.
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">Email</label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="adresa@exemplu.ro"
          className="w-full rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-zinc-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          {status === "loading" ? "Se procesează…" : status === "ok" ? "Înscris!" : "Mă abonez"}
        </button>
      </form>
      <div className="mt-3 flex items-start gap-2 text-xs text-neutral-700 dark:text-zinc-300">
        <input
          id="nl-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-sky-500 focus:ring-sky-400 dark:border-white/20"
          required
        />
        <label htmlFor="nl-consent">
          Sunt de acord să primesc comunicări comerciale pe email. Poți oricând să te dezabonezi.
          Vezi <a className="underline" href="/politica-confidentialitate">Politica de confidențialitate</a>.
        </label>
      </div>
      {status === "error" && (
        <div className="mt-2 text-xs text-red-500">Te rugăm introdu o adresă de email validă și acordă consimțământul.</div>
      )}
      {status === "ok" && (
        <div className="mt-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-300">Mulțumim! Ți-am înregistrat adresa.</div>
      )}
    </section>
  );
}
