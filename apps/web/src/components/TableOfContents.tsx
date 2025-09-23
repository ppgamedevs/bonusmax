'use client';
import { useEffect, useState } from 'react';

export default function TableOfContents({
  headings,
}: {
  headings: { level: 2 | 3; text: string; id: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 1.0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);
  if (!headings?.length) return null;
  return (
    <nav className="rounded-xl border p-3 text-sm">
      <div className="mb-2 text-xs uppercase opacity-60">Cuprins</div>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${h.id}`}
              className={active === h.id ? 'font-semibold underline' : 'hover:underline'}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
