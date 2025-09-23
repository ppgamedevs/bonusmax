"use client";

import { useEffect, useMemo, useState } from "react";

export type Heading = { id: string; text: string; level: 2 | 3 };

export default function ArticleTOC({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id || "");

  const ids = useMemo(() => headings.map((h) => h.id), [headings]);

  useEffect(() => {
    if (ids.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the top-most visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
      <div className="px-1 text-xs font-semibold uppercase tracking-wide opacity-70">Cuprins</div>
      <ul className="mt-2 space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block rounded px-2 py-1 hover:bg-white/10 ${
                active === h.id ? "bg-white/10 text-white" : "text-zinc-300"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
