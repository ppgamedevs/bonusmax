import { useState, useEffect, useRef } from 'react';
import { HelpArticle } from '../../lib/help-data';

type CategoryLite = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

function highlight(text: string, query: string) {
  if (!query) return text;
  try {
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    const parts = text.split(re);
    return parts.map((p, i) =>
      re.test(p) ? (
        <mark key={i} className="rounded bg-yellow-200/60 px-0.5 text-black dark:bg-yellow-300/40">
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  } catch {
    return text;
  }
}

export default function HelpSearch({
  query,
  onQueryChange,
  filteredArticles,
  filteredCategories,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  filteredArticles: HelpArticle[];
  filteredCategories: CategoryLite[];
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setShowDropdown(query.length > 0);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const inInput = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;
      if (!inInput && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') onQueryChange('');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onQueryChange]);

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        ref={inputRef}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Caută în Help Center…"
        aria-label="Caută în Help Center"
        className="w-full px-4 py-3 rounded-full border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      />
      {query && (
        <button
          type="button"
          aria-label="Șterge căutarea"
          onClick={() => onQueryChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-300 bg-white/80 px-2 py-0.5 text-xs text-neutral-700 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white"
        >
          Esc · Clear
        </button>
      )}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 max-h-80 overflow-y-auto">
          {filteredArticles.length === 0 && filteredCategories.length === 0 ? (
            <p className="text-neutral-600 dark:text-zinc-400">
              Nu am găsit rezultate. Încearcă alt cuvânt sau vezi categoriile.
            </p>
          ) : (
            <>
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <h4 className="font-semibold text-zinc-100">{highlight(cat.title, query)}</h4>
                  <a href={`/help/${cat.slug}`} className="text-blue-400 hover:underline text-sm">
                    {highlight(cat.description, query)}
                  </a>
                </div>
              ))}
              {filteredArticles.map((article) => (
                <div key={article.id} className="mb-4">
                  <h4>
                    <a
                      href={`/help/${article.category}/${article.slug}`}
                      className="text-blue-400 hover:underline"
                    >
                      {highlight(article.title, query)}
                    </a>
                  </h4>
                  <p className="text-zinc-400 text-sm">{highlight(article.excerpt, query)}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
