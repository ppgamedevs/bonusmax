export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@bonusmax/lib';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import BackHome from '@/components/BackHome';

// Utilities to coerce possible field names from different sources
function pick<T = any>(obj: any, keys: string[]): T | undefined {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return undefined;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await (prisma as any).feedItem.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      image: true,
      updatedAt: true,
      publishedAt: true,
    },
  });
  if (!post) return defaultMetadata({ title: 'Blog' });

  const title = post.title || 'Articol';
  const description = post.excerpt || 'Articol pe blogul Bonusmax';
  const url = absoluteUrl(`/blog/${slug}`);
  const image = post.image || undefined;

  return defaultMetadata({
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await (prisma as any).feedItem.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      html: true,
      body: true,
      image: true,
      author: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
  if (!post) return notFound();

  const content = pick<string>(post, ['html', 'content', 'body']) || '';
  const date = post.publishedAt || post.updatedAt;

  // Related posts (server-side)
  let related = [] as any[];
  if (Array.isArray(post.tags) && post.tags.length) {
    related = await (prisma as any).feedItem.findMany({
      where: { status: 'APPROVED', slug: { not: slug }, tags: { hasSome: post.tags } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, publishedAt: true, tags: true },
      take: 4,
    });
  }
  if (!related.length) {
    related = await (prisma as any).feedItem.findMany({
      where: { status: 'APPROVED', slug: { not: slug } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, publishedAt: true, tags: true },
      take: 4,
    });
  }

  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
    { name: post.title || slug, url: absoluteUrl(`/blog/${slug}`) },
  ]);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    datePublished: date ? new Date(date).toISOString() : undefined,
    dateModified: date ? new Date(date).toISOString() : undefined,
    image: post.image ? [post.image] : undefined,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <header>
        <nav aria-label="breadcrumb" className="text-xs text-neutral-600 dark:text-zinc-500">
          <ol className="flex items-center gap-1">
            <li>
              <a className="underline underline-offset-2 text-neutral-800 dark:text-zinc-200" href="/">Acasă</a>
            </li>
            <li aria-hidden>›</li>
            <li>
              <a className="underline underline-offset-2 text-neutral-800 dark:text-zinc-200" href="/blog">Blog</a>
            </li>
            <li aria-hidden>›</li>
            <li className="text-neutral-800 dark:text-zinc-200">{post.title || slug}</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{post.title || slug}</h1>
        {post.excerpt ? (
          <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-200">{post.excerpt}</p>
        ) : null}
        {Array.isArray(post.tags) && post.tags.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {post.tags.map((t: string) => (
              <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10">{t}</a>
            ))}
          </div>
        ) : null}
        {date ? (
          <div className="mt-1 text-[11px] text-neutral-600 dark:text-zinc-400">
            {new Date(date).toLocaleDateString('ro-RO')}
          </div>
        ) : null}
      </header>

      <BackHome />

      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="mt-6 w-full rounded-lg border border-white/10"
          loading="lazy"
        />
      ) : null}

      <article className="prose prose-invert mt-6 max-w-none">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p>Conținutul articolului nu este disponibil.</p>
        )}
      </article>

      {/* Related posts */}
      {related && related.length ? (
        <section className="mt-10">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Articole similare</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {related.map((r: any) => (
              <li key={r.slug} className="rounded-xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <a href={`/blog/${r.slug}`} className="block">
                  <div className="text-sm font-semibold text-neutral-900 underline underline-offset-2 dark:text-white">{r.title}</div>
                  {r.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-700 dark:text-zinc-300">{r.excerpt}</p>
                  ) : null}
                  <div className="mt-2 text-[11px] text-neutral-600 dark:text-zinc-400">
                    {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString('ro-RO') : ''}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
