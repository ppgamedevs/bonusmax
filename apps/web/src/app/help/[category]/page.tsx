export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import { helpCategories, helpArticles } from '@/lib/help-data';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = helpCategories.find((c) => c.slug === category);
  if (!cat) return defaultMetadata({ title: 'Ajutor' });
  return defaultMetadata({
    title: `${cat.title} · Ajutor` as any,
    description: cat.description,
    alternates: { canonical: absoluteUrl(`/help/${cat.slug}`) },
  });
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = helpCategories.find((c) => c.slug === category);
  if (!cat) return notFound();
  const items = helpArticles.filter((a) => a.category === category);
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Ajutor & suport', url: absoluteUrl('/help') },
    { name: cat.title, url: absoluteUrl(`/help/${cat.slug}`) },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Help / {cat.title}
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{cat.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-700 dark:text-zinc-300">{cat.description}</p>
      </header>

      <section className="mt-8">
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((a) => (
            <Link
              key={a.id}
              href={`/help/${category}/${a.slug}`}
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

      {cat.topLinks?.length ? (
        <section className="mt-10">
          <h2 className="text-base font-semibold">Legături utile</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {cat.topLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-2 underline underline-offset-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 dark:bg-white/50" aria-hidden />
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
