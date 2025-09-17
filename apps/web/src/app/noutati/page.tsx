import { prisma } from "@bonusmax/lib";
import Link from 'next/link';

export const revalidate = 600;
export const metadata = { title: "NoutÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi (RomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nia) ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â iGaming, ONJN, responsabilitate" };

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const tag = typeof searchParams?.tag === "string" ? searchParams!.tag : undefined;
  const where: any = { status: "APPROVED" };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  const items = await (prisma as any).feedItem.findMany({
    where,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
    include: { source: true, tags: { include: { tag: true } } },
  });
  const tags = await (prisma as any).tag.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">NoutÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi (RO)</h1>
      <p className="mt-2 text-sm opacity-80">ÃƒÆ’Ã‹â€ Ãƒâ€¹Ã…â€œtiri ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i resurse din piaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºa din RomÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nia. 18+ JoacÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ responsabil. ConÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºinut comercial marcat corespunzÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢tor.</p>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Link className={`rounded border px-2 py-1 ${!tag ? "bg-neutral-100" : ""}`} href="/noutati">
          Toate
        </Link>
        {tags.map((t: any) => (
          <a key={t.id} className={`rounded border px-2 py-1 ${tag === t.slug ? "bg-neutral-100" : ""}`} href={`/noutati?tag=${t.slug}`}>
            {t.name}
          </Link>
        ))}
        <Link className="ml-auto underline" href="/noutati/trimite">
          Trimite link
        </Link>
        <Link className="underline" href="/newsletter">
          AboneazÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢-te
        </Link>
      </div>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((i: any) => (
          <li key={i.id} className={`rounded border p-3 ${i.featured ? "ring-1 ring-amber-300" : ""}`}>
            <div className="text-xs opacity-70">
              {i.source?.name || "UGC"} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ {i.publishedAt ? new Date(i.publishedAt).toLocaleDateString("ro-RO") : ""}
            </div>
            <a className="mt-1 block text-base font-semibold underline" href={`/noutati/${i.slug}`}>
              {i.title}
            </Link>
            <p className="mt-1 text-sm opacity-80">{i.excerpt || ""}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
