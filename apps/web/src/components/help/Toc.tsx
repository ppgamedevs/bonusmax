import { useEffect, useState } from 'react';

export default function Toc({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ level: number; text: string; id: string }[]>([]);

  useEffect(() => {
    const lines = content.split('\n');
    const h = lines
      .filter(l => l.startsWith('#'))
      .map(l => {
        const level = l.match(/^#+/)![0].length;
        const text = l.replace(/^#+ /, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { level, text, id };
      });
    setHeadings(h);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-8 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
      <h3 className="text-sm font-semibold mb-4 text-zinc-100">Cuprins</h3>
      <ul className="space-y-2">
        {headings.map(h => (
          <li key={h.id} className={`pl-${(h.level - 1) * 4}`}>
            <a
              href={`#${h.id}`}
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
