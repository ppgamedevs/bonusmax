export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour - guides rarely change
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
    <main className="mx-auto max-w-6xl px-4 py-10 content-stable hydration-stable">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {Array.isArray(frontmatter.faqs) && frontmatter.faqs.length > 0 ? (
        <JsonLdFaq qa={frontmatter.faqs} />
      ) : null}

      <header className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" aria-hidden />
          Ghiduri
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white lg:text-4xl">{frontmatter.title || slug}</h1>
        {frontmatter.date ? (
          <div className="mt-3 text-sm text-neutral-600 dark:text-zinc-400">
            📅 Actualizat: {new Date(frontmatter.date).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        ) : null}
      </header>

      <BackHome />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Cuprins</h3>
            <nav className="text-sm">
              <ul className="space-y-3 border-l border-neutral-200 dark:border-neutral-700 pl-4">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 2 ? '' : 'ml-4 opacity-75'}>
                    <a 
                      href={`#${h.id}`} 
                      className="block text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-neutral-200 dark:prose-h2:border-neutral-700 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6 prose-strong:font-semibold prose-strong:text-neutral-900 dark:prose-strong:text-white prose-ul:my-6 prose-li:my-2 font-stable transition-stable">
          {content}
        </article>
      </div>
    </main>
  );
}
