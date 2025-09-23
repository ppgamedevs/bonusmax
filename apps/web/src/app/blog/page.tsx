export const dynamic = 'force-dynamic';
export const revalidate = 60;
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@bonusmax/lib';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import BackHome from '@/components/BackHome';

export const metadata: Metadata = defaultMetadata({
  title: 'Blog',
  description:
    'Articole și noutăți despre bonusuri, oferte speciale și ghiduri pentru jucători responsabili. 18+ Joacă responsabil.',
  alternates: { canonical: absoluteUrl('/blog') },
});

type SearchParams = Promise<{ page?: string; tag?: string }>;

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const sp = (await searchParams) || {} as any;
  const page = Math.max(1, Number(sp.page || 1));
  const tag = (sp.tag || '').trim();
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Fetch posts
  const where = tag
    ? { status: 'APPROVED', tags: { has: tag } }
    : { status: 'APPROVED' };

  const [total, postsRaw] = await Promise.all([
    (prisma as any).feedItem.count({ where }),
    (prisma as any).feedItem.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        publishedAt: true,
        updatedAt: true,
        tags: true,
      },
      skip,
      take: pageSize,
    }),
  ]);

  // On first page without tag, feature the most recent post
  const featured = !tag && page === 1 ? postsRaw[0] : null;
  const posts = featured ? postsRaw.slice(1) : postsRaw;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // JSON-LD: Breadcrumb + Blog ItemList
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
  ]);
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog',
    url: absoluteUrl('/blog'),
    blogPost: (featured ? [featured, ...posts] : posts).map((p: any) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: (p.publishedAt || p.updatedAt)?.toISOString?.() || String(p.publishedAt || p.updatedAt || ''),
      dateModified: (p.updatedAt || p.publishedAt)?.toISOString?.() || String(p.updatedAt || p.publishedAt || ''),
      image: p.image ? [p.image] : undefined,
    })),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* Header */}
      <header className="mx-auto max-w-3xl">
        <nav aria-label="breadcrumb" className="text-xs text-neutral-600 dark:text-zinc-500">
          <ol className="flex items-center gap-1">
            <li>
              <a className="underline underline-offset-2 text-neutral-800 dark:text-zinc-200" href="/">Acasă</a>
            </li>
            <li aria-hidden>›</li>
            <li className="text-neutral-800 dark:text-zinc-200">Blog</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Blog</h1>
        <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-200">
          Articole și noutăți despre bonusuri, oferte speciale și ghiduri pentru jucători responsabili.
        </p>
      </header>

      <BackHome />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs text-neutral-600 dark:text-zinc-400">Filtre:</span>
        {['WR','Bonusuri','Retrageri','Securitate','Joc responsabil'].map((t) => (
          <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={`rounded-full border px-3 py-1 ${tag===t ? 'bg-neutral-900 text-white dark:bg-white/20' : 'border-neutral-200 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10'}`}>{t}</Link>
        ))}
        {tag ? (
          <Link href="/blog" className="text-xs underline underline-offset-2 text-neutral-700 dark:text-zinc-300">Reset</Link>
        ) : null}
      </div>

      {/* Featured */}
      {featured ? (
        <article className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <Link href={`/blog/${featured.slug}`} className="block">
            <div className="text-xl font-extrabold text-neutral-900 underline underline-offset-2 dark:text-white">{featured.title}</div>
            {featured.excerpt ? (
              <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-200">{featured.excerpt}</p>
            ) : null}
            <div className="mt-2 text-[11px] text-neutral-600 dark:text-zinc-400">
              {(featured.publishedAt || featured.updatedAt) ? new Date(featured.publishedAt || featured.updatedAt).toLocaleDateString('ro-RO') : ''}
            </div>
          </Link>
        </article>
      ) : null}

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700 dark:border-white/10 dark:bg-transparent dark:text-zinc-300">
          Momentan nu există articole aprobate.
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.map((p: any) => (
            <li key={p.slug} className="group overflow-hidden rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <Link href={`/blog/${p.slug}`} className="block p-4">
                <div className="text-base font-semibold text-neutral-900 underline underline-offset-2 group-hover:decoration-2 dark:text-white">
                  {p.title}
                </div>
                {p.excerpt ? (
                  <p className="mt-1 text-sm text-neutral-700 line-clamp-3 dark:text-zinc-200">{p.excerpt}</p>
                ) : null}
                {Array.isArray(p.tags) && p.tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t: string) => (
                      <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10">{t}</Link>
                    ))}
                  </div>
                ) : null}
                <div className="mt-2 text-[11px] text-neutral-600 dark:text-zinc-400">
                  {(p.publishedAt || p.updatedAt) ? new Date(p.publishedAt || p.updatedAt).toLocaleDateString('ro-RO') : ''}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <nav className="mt-6 flex items-center justify-between text-sm">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
            aria-disabled={page <= 1}
            className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-800 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-zinc-200"
          >
            ← Anterioare
          </Link>
          <div className="text-xs text-neutral-600 dark:text-zinc-400">Pagina {page} din {totalPages}</div>
          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
            aria-disabled={page >= totalPages}
            className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-800 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:text-zinc-200"
          >
            Următoare →
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
