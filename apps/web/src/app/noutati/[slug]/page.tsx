import { prisma } from "@bonusmax/lib";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const i = await (prisma as any).feedItem.findUnique({ where: { slug: params.slug } });
  return {
    title: i?.title || "Noutate",
    description: i?.excerpt || "Noutăți iGaming România",
    openGraph: { locale: "ro_RO" },
    alternates: { languages: { "ro-RO": `/noutati/${params.slug}` } },
  } as any;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const i = await (prisma as any).feedItem.findUnique({ where: { slug: params.slug }, include: { source: true, tags: { include: { tag: true } } } });
  if (!i || i.status !== "APPROVED")
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Nu s-a găsit.</p>
      </main>
    );

  const newsLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    inLanguage: "ro-RO",
    headline: i.title,
    datePublished: (i.publishedAt || i.createdAt) as any,
    mainEntityOfPage: i.url,
    author: { "@type": "Organization", name: i.source?.name || "Sursă" },
  } as const;

  return (
    <main className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsLd) }} />
      <p className="text-xs opacity-70">Sursă: {i.source?.name || "Contribuție utilizator"}</p>
      <h1 className="text-2xl font-bold">{i.title}</h1>
      <p className="mt-2 text-sm opacity-80">{i.excerpt}</p>
      <a className="mt-3 inline-block rounded border px-3 py-2 underline" href={i.url} rel="nofollow noopener" target="_blank">
        Deschide sursa ↗
      </a>
      <p className="mt-2 text-xs opacity-60">18+ Joacă responsabil • Dacă este promo/advertorial, marcăm “Conținut comercial”.</p>
    </main>
  );
}
