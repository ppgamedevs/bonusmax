import MDXProvider from "../../../components/mdx/MDXProvider";
import { loadGuide } from "../../../lib/guides";
import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "../../../components/JsonLd";
import JsonLdFaq from "../../../components/JsonLdFaq";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const g = loadGuide(params.slug);
  return {
    title: g.title,
    description: g.description,
    openGraph: { locale: "ro_RO" },
    alternates: { languages: { "ro-RO": `/ghiduri/${g.slug}` } },
  } as any;
}

export default function Page({ params }: { params: { slug: string } }) {
  const g = loadGuide(params.slug);
  const url = absoluteUrl(`/ghiduri/${g.slug}`);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    inLanguage: "ro-RO",
    dateModified: g.updatedAt || undefined,
    author: { "@type": "Organization", name: "Bonusmax" },
    publisher: { "@type": "Organization", name: "Bonusmax" },
    mainEntityOfPage: url,
  };
  const qa = g.source
    .split("\n### ")
    .slice(1)
    .map((block: any) => {
      const [q, ...rest] = block.split("\n");
      const a = rest.join("\n").trim();
      return { q: q.trim(), a };
    })
    .slice(0, 8);

  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "Acasă", url: absoluteUrl("/") }, { name: "Ghiduri", url: absoluteUrl("/ghiduri") }, { name: g.title, url }])} />
      <JsonLd data={articleLd} />
      {qa.length > 0 && <JsonLdFaq qa={qa} />}
      <article className="prose max-w-none">
        <h1>{g.title}</h1>
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <section>
            {/* MDX source rendered server-side */}
            <MDXProvider source={g.source} />
            <section className="mt-8">
              <h3 className="text-base font-semibold">Citește și</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                <li><a href="/bonusuri-fara-depunere">Bonusuri fără depunere</a></li>
                <li><a href="/rotiri-gratuite">Rotiri gratuite</a></li>
              </ul>
            </section>
          </section>
          <aside className="border-l pl-4">
            <h3 className="text-sm font-semibold">Cuprins</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {g.headings.map((h: any) => (
                <li key={h.id} className={h.depth === 2 ? "font-medium" : ""}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <p className="mt-6 text-xs opacity-60">Conținut comercial • 18+ Joacă responsabil.</p>
      </article>
    </main>
  );
}
