export const dynamic = 'force-static';
export const revalidate = 600; // 10 minutes - guides don't change often
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import { getGuideBySlug } from '@/lib/content';
import JsonLdFaq from '@/components/JsonLdFaq';
import BackHome from '@/components/BackHome';

type PageParams = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const guide = await getGuideBySlug(slug);
    if (!guide) return defaultMetadata({ title: 'Ghiduri' });
    const { frontmatter } = guide;
    return defaultMetadata({
      title: frontmatter.title || 'Ghid',
      description: frontmatter.description,
      alternates: { canonical: absoluteUrl(`/ghiduri/${frontmatter.slug || slug}`) },
    });
  } catch {
    return defaultMetadata({ title: 'Ghiduri' });
  }
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  let content: any = null;
  let frontmatter: any = null;
  let headings: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  try {
    const guide = await getGuideBySlug(slug);
    if (!guide) return notFound();
    ({ content, frontmatter, headings } = guide as any);
  } catch (err) {
    // Render a safe fallback instead of 500
    console.error('[guides] rendering failed for', slug, err);
    frontmatter = { title: 'Ghid indisponibil', description: 'Ne pare rău, conținutul nu poate fi afișat acum.' };
    content = (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100">
        Conținutul ghidului nu poate fi afișat momentan. Încearcă din nou mai târziu.
      </div>
    );
  }
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Ghiduri', url: absoluteUrl('/ghiduri') },
    { name: frontmatter.title || slug, url: absoluteUrl(`/ghiduri/${frontmatter.slug || slug}`) },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {Array.isArray(frontmatter.faqs) && frontmatter.faqs.length > 0 ? (
        <JsonLdFaq qa={frontmatter.faqs} />
      ) : null}

      <header className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Ghiduri
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{frontmatter.title || slug}</h1>
        {frontmatter.date ? (
          <div className="mt-1 text-[11px] text-zinc-400">
            Actualizat: {new Date(frontmatter.date).toLocaleDateString('ro-RO')}
          </div>
        ) : null}
      </header>

      <BackHome />

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <nav className="text-sm">
            <ul className="space-y-2">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 2 ? '' : 'ml-3 opacity-80'}>
                  <a href={`#${h.id}`} className="underline underline-offset-2">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="prose prose-invert max-w-none">{content}</article>
      </div>
    </main>
  );
}
