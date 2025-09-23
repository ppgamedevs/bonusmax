'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { useEffect, useMemo, useState } from 'react';

function Captcha({ onChange }: { onChange: (vals: { a: string; b: string; c: string }) => void }) {
  // generate operands once per mount
  const a = useMemo(() => Math.floor(1 + Math.random() * 9), []);
  const b = useMemo(() => Math.floor(1 + Math.random() * 9), []);
  const [c, setC] = useState('');
  useEffect(() => {
    onChange({ a: String(a), b: String(b), c });
  }, [a, b, c, onChange]);
  return (
    <div className="text-sm">
      <label>
        Verificare: {a} + {b} =
      </label>
      <input
        className="ml-2 w-16 rounded border px-2 py-1"
        value={c}
        onChange={(e) => {
          setC(e.target.value);
          onChange({ a: String(a), b: String(b), c: e.target.value });
        }}
      />
    </div>
  );
}

export default function Page() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [cap, setCap] = useState({ a: '', b: '', c: '' });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as any;
    payload.monthlyBudget = Number(payload.monthlyBudget || 0);
    payload.ca = cap.a;
    payload.cb = cap.b;
    payload.cc = cap.c;
    payload.hp = payload.companyField || '';
    const r = await fetch('/api/partners/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j = await r.json().catch(() => null);
    setSubmitting(false);
    if (j?.ok) setOk('Mulțumim! Te contactăm în scurt timp.');
    else setOk('Eroare la trimitere. Verifică câmpurile.');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Promovează-te pe Bonusmax</h1>
        <p className="mt-2 text-sm opacity-80">
          Sponsored placements pe homepage și hub-uri, listări editoriale și colaborări de conținut.
          Doar operatori licențiați ONJN și agenții cu mandate valide. 18+ Joacă responsabil.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Sponsored (Homepage)</h3>
            <p className="text-sm opacity-70">
              Slot dedicat, vizibilitate maximă. Contracte 7–30 zile.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Hub-uri (Fără depunere / Rotiri)</h3>
            <p className="text-sm opacity-70">Targetare pe intenție. Opțiuni pin & sort.</p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">CPA/Hybrid</h3>
            <p className="text-sm opacity-70">Parteneriate performante (EPC verificat).</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-8 grid gap-3 rounded-xl border p-4">
          {/* honeypot */}
          <input
            type="text"
            name="companyField"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Companie*
              <input name="companyName" required className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="text-sm">
              Nume contact
              <input name="contactName" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="text-sm">
              Email*
              <input
                type="email"
                name="email"
                required
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="text-sm">
              Telefon
              <input name="phone" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="text-sm">
              Website
              <input
                name="website"
                placeholder="https://..."
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="text-sm">
              ONJN #
              <input name="onjnLicenseId" className="mt-1 w-full rounded border px-3 py-2" />
            </label>
            <label className="text-sm">
              Buget lunar estimat (RON)
              <input
                type="number"
                name="monthlyBudget"
                placeholder="5000"
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="text-sm">
              Obiectiv
              <select name="goal" className="mt-1 w-full rounded border px-3 py-2">
                <option value="SPONSORED">Sponsored</option>
                <option value="LISTING">Listing editorial</option>
                <option value="BRANDING">Branding</option>
                <option value="CPA">CPA/Hybrid</option>
              </select>
            </label>
          </div>
          <label className="text-sm">
            Mesaj
            <textarea
              name="message"
              rows={4}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="Perioada dorită, slot, brief, etc."
            />
          </label>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <Captcha onChange={setCap} />
            <button disabled={submitting} className="rounded border px-4 py-2 font-semibold">
              {submitting ? 'Se trimite...' : 'Trimite'}
            </button>
          </div>
          {ok && <p className="text-sm">{ok}</p>}
          <p className="mt-2 text-xs opacity-60">
            Prin trimitere confirmi că ești operator/agenție conform ONJN. „Sponsored” și „Conținut
            comercial” vor fi marcate în site.
          </p>
        </form>
      </section>
    </main>
  );
}
