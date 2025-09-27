export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour - guides rarely change
import { getAllGuidesMeta } from '@/lib/guides';
import Link from 'next/link';
import type { Metadata } from 'next';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import BackHome from '@/components/BackHome';
import { Suspense } from 'react';

export const metadata: Metadata = defaultMetadata({
  title: 'Ghiduri bonusuri & cazinouri',
  description: 'Ghiduri utile despre bonusuri, WR și operatori licențiați ONJN. 18+ Joacă responsabil.',
  alternates: { canonical: absoluteUrl('/ghiduri') },
});

// Pre-process guides data for better performance
const getAllGuidesProcessed = () => {
  const list = getAllGuidesMeta();
  return list.sort((a: any, b: any) => {
    const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bd - ad;
  });
};

// Optimized search function
const filterGuides = (guides: any[], query: string) => {
  if (!query) return guides;
  const lowerQuery = query.toLowerCase();
  return guides.filter((g: any) =>
    (g.title || '').toLowerCase().includes(lowerQuery) ||
    (g.description || '').toLowerCase().includes(lowerQuery)
  );
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  // Pre-process guides once
  const allGuides = getAllGuidesProcessed();
  
  // Handle search params safely
  const spAny = (await searchParams) as any || {};
  const rawQ = spAny?.q;
  const q = (Array.isArray(rawQ) ? rawQ.join(' ') : (rawQ || ''))
    .toString()
    .toLowerCase()
    .trim();
  
  // Filter guides efficiently
  const filtered = filterGuides(allGuides, q);

  // Optimized highlight function with memoization
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const getHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const rx = new RegExp(`(${escapeRe(query)})`, 'ig');
    return text.replace(rx, `<mark class="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">$1</mark>`);
  };
  return (
    <main className="container mx-auto px-4 py-8 content-stable">
      {/* SEO: Breadcrumbs & ItemList JSON-LD */}
      {(() => {
        const breadcrumbLd = jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'Ghiduri', url: absoluteUrl('/ghiduri') },
        ]);
        const itemListLd = {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: filtered.map((g: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/ghiduri/${g.slug}`),
            name: g.title,
          })),
        };
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
          </>
        );
      })()}

      {/* Visible breadcrumb */}
      <nav aria-label="breadcrumb" className="text-xs text-neutral-600 dark:text-zinc-500">
        <ol className="flex items-center gap-1">
          <li>
            <a className="underline underline-offset-2 text-neutral-800 dark:text-zinc-200" href="/">Acasă</a>
          </li>
          <li aria-hidden>›</li>
          <li className="text-neutral-800 dark:text-zinc-200">Ghiduri</li>
        </ol>
      </nav>

      {/* Page header */}
      <header className="mt-2">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-700 dark:text-zinc-300 border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Ghiduri
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Ghiduri (România)</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-700 dark:text-zinc-200">
          Explicații clare despre bonusuri, WR și operatori licențiați ONJN. 18+ Joacă responsabil.
        </p>
      </header>

      <BackHome />

      <form className="mt-4 flex gap-2 form-stable" method="get">
        <input
          className="w-full max-w-md rounded border px-3 py-2 text-sm border-neutral-300 text-neutral-900 placeholder:text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white transition-stable focus-stable"
          type="search"
          name="q"
          placeholder="Caută în titlu/descriere..."
          defaultValue={q}
          autoComplete="off"
        />
        <button className="btn-stable rounded border px-4 py-2 text-sm border-neutral-300 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10 transition-stable focus-stable" type="submit">
          Caută
        </button>
      </form>

      {/* Results info */}
      <div className="mt-3 text-xs text-neutral-600 dark:text-zinc-300">
        {filtered.length} rezultate{q ? (
          <> pentru <span className="font-medium text-neutral-800 dark:text-zinc-200">“{q}”</span></>
        ) : null}
      </div>

      {/* Results grid with layout stability */}
      <Suspense fallback={
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl border p-4 border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 skeleton" style={{ minHeight: 120 }} />
          ))}
        </div>
      }>
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-xl border p-6 text-sm border-neutral-200 text-neutral-700 dark:border-white/10 dark:text-zinc-300 hydration-stable">
            Niciun rezultat. Încearcă alt termen sau șterge filtrul.
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {filtered.map((g: any) => {
              const highlightedTitle = getHighlightedText(g.title, q);
              const highlightedDesc = getHighlightedText(g.description || '', q);
              const formattedDate = g.updatedAt ? new Date(g.updatedAt).toLocaleDateString('ro-RO') : null;
              
              return (
                <li
                  key={g.slug}
                  className="group rounded-xl border p-4 transition-stable border-neutral-200 bg-white hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 grid-item-stable"
                  style={{ minHeight: 120 }}
                >
                  <Link prefetch={false} href={`/ghiduri/${g.slug}`} className="flex flex-col h-full">
                    <div
                      className="text-base font-semibold underline underline-offset-2 group-hover:decoration-2 text-neutral-900 dark:text-white font-stable"
                      dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                    <p
                      className="mt-1 text-sm text-neutral-700 dark:text-zinc-200 flex-1"
                      dangerouslySetInnerHTML={{ __html: highlightedDesc }}
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600 dark:text-zinc-300">
                      <span className="font-stable">
                        {formattedDate ? `Actualizat: ${formattedDate}` : '\u00A0'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-neutral-800 dark:text-zinc-100">
                        <span aria-hidden>→</span>
                        <span className="underline underline-offset-2">Citește ghidul</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Suspense>
    </main>
  );
}
