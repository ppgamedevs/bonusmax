'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCompareIds } from '../lib/compare';

export default function CompareTray() {
  const [ids, setIds] = useState<string[]>([]);
  const [hidden, setHidden] = useState<boolean>(false);
  useEffect(() => {
    const on = () => setIds(getCompareIds());
    on();
    window.addEventListener('storage', on);
    const i = setInterval(on, 500);
    const h = localStorage.getItem('cmp_tray_hide') === '1';
    setHidden(h);
    return () => {
      window.removeEventListener('storage', on);
      clearInterval(i);
    };
  }, []);
  if (ids.length === 0 || hidden) return null;
  return (
    <div className="fixed bottom-[max(env(safe-area-inset-bottom),16px)] left-4 z-40 rounded-xl border border-neutral-200 bg-white p-3 text-neutral-900 shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm">Compari {ids.length}/4 oferte</div>
        <button
          aria-label="Închide bara de comparare"
          className="rounded p-1 text-xs opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2"
          onClick={() => {
            localStorage.setItem('cmp_tray_hide', '1');
            setHidden(true);
          }}
        >
          ×
        </button>
      </div>
      <Link
        className="mt-2 block rounded border border-neutral-300 bg-neutral-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        href={'/compara' as any}
        aria-label={`Deschide comparația pentru ${ids.length} oferte`}
      >
        Deschide comparația
      </Link>
    </div>
  );
}
