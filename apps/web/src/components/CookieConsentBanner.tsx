'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'bm_cookie_consent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      setVisible(v !== '1');
    } catch {}
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 m-3 rounded-2xl border border-neutral-200 bg-white/95 p-4 text-sm text-neutral-900 shadow-lg backdrop-blur dark:border-white/10 dark:bg-neutral-900/90 dark:text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          Folosim cookie-uri pentru a îmbunătăți experiența și a analiza traficul. Vezi{' '}
          <Link className="underline" href="/politica-confidentialitate">Politica de confidențialitate</Link>.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { try { localStorage.setItem(KEY, '1'); } catch {}; setVisible(false); }}
            className="rounded-xl border border-neutral-300 bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-800 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            Accept
          </button>
          <Link href="/gdpr" className="rounded-xl border border-neutral-300 px-3 py-1.5 hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10">
            Află mai mult
          </Link>
        </div>
      </div>
    </div>
  );
}
