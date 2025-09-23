'use client';
import { useEffect, useState } from 'react';

export type CompareItem = {
  id: string;
  brand: string;
  logo?: string | null;
  headline?: string | null;
};

export default function CompareBar({
  items = [],
  onOpen,
}: {
  items: CompareItem[];
  onOpen: () => void;
}) {
  const count = items.length;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(count > 0);
  }, [count]);

  if (!visible) return null;

  return (
    <div className="fixed left-4 bottom-[max(env(safe-area-inset-bottom),16px)] z-40">
      <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 shadow dark:border-white/10 dark:bg-black/60 dark:text-white backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-90">Compari {count}/4 oferte</span>
          <button
            type="button"
            onClick={onOpen}
            className="rounded-xl border border-neutral-300 bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:border-white/25 dark:bg-white/10 dark:hover:bg-white/20"
            aria-haspopup="dialog"
            aria-controls="compare-drawer"
          >
            Deschide comparația
          </button>
        </div>
      </div>
    </div>
  );
}
