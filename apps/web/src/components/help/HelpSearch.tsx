import { useState, useEffect } from 'react';
import { HelpArticle, HelpCategory } from '../../lib/help-data';

export default function HelpSearch({
  query,
  onQueryChange,
  filteredArticles,
  filteredCategories
}: {
  query: string;
  onQueryChange: (q: string) => void;
  filteredArticles: HelpArticle[];
  filteredCategories: HelpCategory[];
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setShowDropdown(query.length > 0);
  }, [query]);

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Caută în Help Center..."
        className="w-full px-4 py-3 rounded-full border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-h-80 overflow-y-auto shadow-lg">
          {filteredArticles.length === 0 && filteredCategories.length === 0 ? (
            <p className="text-zinc-400">Nu am găsit rezultate. Încearcă alt cuvânt sau vezi categoriile.</p>
          ) : (
            <>
              {filteredCategories.map(cat => (
                <div key={cat.id} className="mb-4">
                  <h4 className="font-semibold text-zinc-100">{cat.title}</h4>
                  <a href={`/help/${cat.slug}`} className="text-blue-400 hover:underline text-sm">
                    {cat.description}
                  </a>
                </div>
              ))}
              {filteredArticles.map(article => (
                <div key={article.id} className="mb-4">
                  <h4>
                    <a href={`/help/${article.category}/${article.slug}`} className="text-blue-400 hover:underline">
                      {article.title}
                    </a>
                  </h4>
                  <p className="text-zinc-400 text-sm">{article.excerpt}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
