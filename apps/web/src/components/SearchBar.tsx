"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SearchBar({ initialQ = "", className = "" }: { initialQ?: string; className?: string }) {
  const [q, setQ] = useState(initialQ);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<{ offers: any[]; operators: any[] }>({ offers: [], operators: [] });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!q) { setResults({ offers: [], operators: [] }); setOpen(false); return; }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`).then(res => res.json());
      setResults(r);
      setOpen(true);
    }, 180);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  function go(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = `/cauta?q=${encodeURIComponent(q)}`;
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={go} role="search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="CautÃ„Æ’ bonusuri sau operatoriÃ¢â‚¬Â¦"
          className="w-full rounded-xl border bg-transparent px-4 py-2"
          aria-label="CÃ„Æ’utare"
        />
      </form>
      {open && (results.offers.length > 0 || results.operators.length > 0) && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border bg-white p-2 text-sm shadow-lg dark:bg-neutral-900">
          {results.operators.length > 0 && (
            <>
              <div className="px-2 pb-1 text-xs opacity-60">Operatori</div>
              <ul>
                {results.operators.map((o: any) => (
                  <li key={o.slug}>
                    <Link className="block rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href={`/casino/${o.slug}`}>{o.name}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {results.offers.length > 0 && (
            <>
              <div className="px-2 pt-2 pb-1 text-xs opacity-60">Oferte</div>
              <ul>
                {results.offers.map((o: any) => (
                  <li key={o.id}>
                    <Link className="block rounded px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href={`/bonus/${o.id}`}>{o.title} Ã¢â‚¬â€ <span className="opacity-70">{o.operator.name}</span></Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-2 border-t pt-2 text-right">
            <Link className="text-xs underline" href={`/cauta?q=${encodeURIComponent(q)}`}>Vezi toate rezultatele</Link>
          </div>
        </div>
      )}
    </div>
  );
}
