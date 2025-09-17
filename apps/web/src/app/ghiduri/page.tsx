import { getAllGuidesMeta } from "@/lib/guides";
import Link from "next/link";

export const revalidate = 3600;
export const metadata = { title: "Ghiduri bonusuri & cazinouri" };

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const list = getAllGuidesMeta();
  const sp = (await searchParams) || {} as Record<string, string>;
  const q = (sp.q || "").toLowerCase().trim();
  const filtered = (q
    ? list.filter((g: any) =>
        [g.title || "", g.description || ""].some((t: string) => t.toLowerCase().includes(q))
      )
    : list
  ).sort((a: any, b: any) => {
    const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bd - ad;
  });

  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const highlight = (text: string, query: string) => {
    if (!query) return text;
    const rx = new RegExp(`(${escapeRe(query)})`, "ig");
    const parts = text.split(rx);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 px-0.5">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Ghiduri (RomÃƒÆ’Ã‚Â¢nia)</h1>
      <p className="mt-2 text-sm opacity-80">ExplicaÃƒË†Ã¢â‚¬Âºii clare despre bonusuri, WR ÃƒË†Ã¢â€žÂ¢i operatori licenÃƒË†Ã¢â‚¬ÂºiaÃƒË†Ã¢â‚¬Âºi ONJN. 18+ JoacÃƒâ€žÃ†â€™ responsabil.</p>

      <form className="mt-4 flex gap-2" method="get">
        <input
          className="w-full max-w-md rounded border px-3 py-2 text-sm"
          type="search"
          name="q"
          placeholder="CautÃƒâ€žÃ†â€™ ÃƒÆ’Ã‚Â®n titlu/descriere..."
          defaultValue={q}
        />
        <button className="rounded border px-3 py-2 text-sm" type="submit">CautÃƒâ€žÃ†â€™</button>
      </form>

      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((g: any) => (
          <li key={g.slug} className="rounded border p-3">
            <Link prefetch={false} href={`/ghiduri/${g.slug}`} className="text-base font-semibold underline">
              {highlight(g.title, q) as any}
            </Link>
            <p className="mt-1 text-sm opacity-80">{highlight(g.description || "", q) as any}</p>
            {g.updatedAt && (
              <p className="mt-1 text-xs opacity-60">Actualizat: {new Date(g.updatedAt).toLocaleDateString("ro-RO")}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
