export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import Link from 'next/link';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import { helpCategories, helpArticles } from '@/lib/help-data';
import HelpSearchWidget from '@/components/help/HelpSearchWidget';
import HelpContinue from '@/components/help/HelpContinue';
import BackHome from '@/components/BackHome';

export const metadata: Metadata = defaultMetadata({
  title: 'Ajutor & suport',
  description: 'Găsești răspunsuri rapide despre folosirea Bonusmax și ofertele listate.',
  alternates: { canonical: absoluteUrl('/help') },
});

export default function Page() {
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Ajutor & suport', url: absoluteUrl('/help') },
  ]);
  const featured = helpArticles.slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <header className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Help Center
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Ajutor & suport</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Găsești răspunsuri rapide despre folosirea Bonusmax și ofertele listate.
        </p>
      </header>

      <BackHome />

      {/* Search */}
      <HelpSearchWidget
        articles={helpArticles}
        categories={helpCategories.map(({ id, slug, title, description }) => ({ id, slug, title, description }))}
      />

      {/* Continue where you left off */}
      <HelpContinue />

      {/* Categories */}
      <section className="mt-8">
        <h2 className="sr-only">Categorii ajutor</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {helpCategories.map((c) => (
            <Link
              key={c.id}
              href={`/help/${c.slug}`}
              className="group rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-white/10 border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{c.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">{c.title}</div>
                  <p className="mt-1 text-xs text-neutral-600 opacity-90 dark:text-zinc-300">{c.description}</p>
                </div>
              </div>
              {c.topLinks?.length ? (
                <ul className="mt-3 space-y-1 text-xs text-neutral-700 dark:text-zinc-300">
                  {c.topLinks.slice(0, 3).map((l) => (
                    <li key={l.href} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-white/50" aria-hidden />
                      <span className="underline underline-offset-2">{l.title}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Articole recomandate</h2>
          <Link href="/ghiduri" className="text-sm underline">
            Vezi toate ghidurile
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {featured.map((a) => (
            <Link
              key={a.id}
              href={`/help/${a.category}/${a.slug}`}
              className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-white/10 border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5"
            >
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">{a.title}</div>
              <p className="mt-1 text-xs text-neutral-600 opacity-90 line-clamp-2 dark:text-zinc-300">{a.excerpt}</p>
              <div className="mt-2 text-[11px] text-neutral-600 opacity-80 dark:text-zinc-400">
                {new Date(a.updatedAt).toLocaleDateString('ro-RO')} • {a.readMins} min
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
