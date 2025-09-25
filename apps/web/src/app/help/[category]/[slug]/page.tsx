export const dynamic = 'force-static';
export const revalidate = 600; // 10 minutes - help content doesn't change often

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import { helpArticles, helpCategories } from '@/lib/help-data';
import { compileMDX } from 'next-mdx-remote/rsc';
import ArticleTOC, { type Heading } from '@/components/help/ArticleTOC';
import ArticleAnalytics from '@/components/help/ArticleAnalytics';
import BackToTop from '@/components/help/BackToTop';
import JsonLdFaq from '@/components/JsonLdFaq';
import BackHome from '@/components/BackHome';

export async function generateMetadata(
  { params }: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const { category, slug } = await params;
  const a = helpArticles.find((x) => x.category === category && x.slug === slug);
  if (!a) return defaultMetadata({ title: 'Ajutor' });
  return defaultMetadata({
    title: `${a.title} · Ajutor` as any,
    description: a.excerpt,
    alternates: { canonical: absoluteUrl(`/help/${a.category}/${a.slug}`) },
  });
}

export default async function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const a = helpArticles.find((x) => x.category === category && x.slug === slug);
  const cat = helpCategories.find((c) => c.slug === category);
  if (!a || !cat) return notFound();

  // Extract H2/H3 headings for TOC
  function extractHeadings(md: string): Heading[] {
    const lines = md.split('\n');
    const hs: Heading[] = [];
    const slugify = (t: string) =>
      t
        .toLowerCase()
        .replace(/[^a-z0-9ăâîșțĂÂÎȘȚ -]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    for (const line of lines) {
      const m2 = /^##\s+(.+)$/.exec(line);
      const m3 = /^###\s+(.+)$/.exec(line);
      if (m2) hs.push({ level: 2, text: m2[1].trim(), id: slugify(m2[1].trim()) });
      if (m3) hs.push({ level: 3, text: m3[1].trim(), id: slugify(m3[1].trim()) });
    }
    return hs;
  }
  const headings = extractHeadings(a.content);

  const { content } = await compileMDX<{}>(
    {
      source: a.content,
      options: { parseFrontmatter: false },
      components: (await import('../../../../mdx/components')).default,
    }
  );

  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Ajutor & suport', url: absoluteUrl('/help') },
    { name: cat.title, url: absoluteUrl(`/help/${cat.slug}`) },
    { name: a.title, url: absoluteUrl(`/help/${a.category}/${a.slug}`) },
  ]);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    mainEntityOfPage: absoluteUrl(`/help/${a.category}/${a.slug}`),
    dateModified: new Date(a.updatedAt).toISOString(),
  };

  // Prev/Next within same category
  const siblings = helpArticles.filter((x) => x.category === category);
  const idx = siblings.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {Array.isArray(a.faqs) && a.faqs.length > 0 ? <JsonLdFaq qa={a.faqs} /> : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <header className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Help / {cat.title}
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{a.title}</h1>
        <div className="mt-1 text-[11px] text-neutral-600 dark:text-zinc-400">
          Actualizat: {new Date(a.updatedAt).toLocaleDateString('ro-RO')} • {a.readMins} min
        </div>
      </header>

      <BackHome />

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <ArticleTOC headings={headings} />
        </aside>
        <article className="prose prose-invert max-w-none">
          {content}
          <hr className="my-6 border-white/10" />
          <nav className="flex items-center justify-between text-sm">
            {prev ? (
              <a href={`/help/${prev.category}/${prev.slug}`} className="underline underline-offset-2">
                ← {prev.title}
              </a>
            ) : <span />}
            {next ? (
              <a href={`/help/${next.category}/${next.slug}`} className="underline underline-offset-2">
                {next.title} →
              </a>
            ) : <span />}
          </nav>
        </article>
      </div>

      {/* Related articles */}
      {(() => {
        const related = siblings.filter((x) => x.slug !== slug).slice(0, 4);
        return related.length ? (
          <section className="mx-auto mt-10 max-w-3xl">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Articole recomandate</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <a href={`/help/${r.category}/${r.slug}`} className="block">
                    <div className="text-sm font-semibold text-neutral-900 underline underline-offset-2 dark:text-white">{r.title}</div>
                    {r.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-700 dark:text-zinc-300">{r.excerpt}</p>
                    ) : null}
                    <div className="mt-2 text-[11px] text-neutral-600 dark:text-zinc-400">
                      {new Date(r.updatedAt).toLocaleDateString('ro-RO')} • {r.readMins} min
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })()}

      <ArticleAnalytics category={category} slug={slug} title={a.title} />
      <BackToTop />
    </main>
  );
}
