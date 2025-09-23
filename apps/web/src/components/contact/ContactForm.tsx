'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Te rugăm completează numele.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Email invalid.');
    if (!subject.trim()) return setError('Te rugăm adaugă un subiect.');
    if (message.trim().length < 10) return setError('Mesajul trebuie să aibă minim 10 caractere.');
    if (!consent) return setError('Trebuie să îți dai acordul pentru a trimite mesajul.');
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok !== true) throw new Error('send_failed');
      setStatus('ok');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setConsent(false);
    } catch (e: any) {
      setStatus('error');
      setError('A apărut o eroare la trimitere. Încearcă din nou.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="block text-xs opacity-70">Nume</label>
          <input id="ct-name" value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-zinc-400"
            placeholder="Numele tău" />
        </div>
        <div>
          <label htmlFor="ct-email" className="block text-xs opacity-70">Email</label>
          <input id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-zinc-400"
            placeholder="adresa@exemplu.ro" />
        </div>
      </div>
      <div>
        <label htmlFor="ct-subject" className="block text-xs opacity-70">Subiect</label>
        <input id="ct-subject" value={subject} onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-zinc-400"
          placeholder="Ex: Parteneriat / Întrebare generală" />
      </div>
      <div>
        <label htmlFor="ct-message" className="block text-xs opacity-70">Mesaj</label>
        <textarea id="ct-message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-white/10 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-zinc-400"
          placeholder="Scrie câteva detalii..." />
      </div>
      <div className="flex items-start gap-2 text-xs">
        <input id="ct-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-sky-500 focus:ring-sky-400 dark:border-white/20" />
        <label htmlFor="ct-consent">Sunt de acord să fiu contactat(ă) pe email în legătură cu mesajul trimis. Vezi <a href="/politica-confidentialitate" className="underline">politica de confidențialitate</a>.</label>
      </div>
      {error && <div className="text-xs text-red-500">{error}</div>}
      {status === 'ok' && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-300">
          Mulțumim! Mesajul tău a fost trimis. Îți vom răspunde în cel mai scurt timp.
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={status === 'loading'}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20">
          {status === 'loading' ? 'Se trimite…' : 'Trimite mesajul'}
        </button>
        <a href="mailto:hello@bonusmax.ro" className="text-xs underline opacity-80">sau scrie-ne direct: hello@bonusmax.ro</a>
      </div>
    </form>
  );
}
