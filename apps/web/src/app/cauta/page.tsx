import { searchOffersAndOperators } from "@bonusmax/lib";
import OffersGrid from "@/components/offers/OffersGrid";
import FilterBar from "@/components/FilterBar";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const q = (searchParams?.q ?? "").trim();
  const data = await searchOffersAndOperators(q);
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">CÃ„Æ’utare</h1>
      <p className="mt-1 text-sm opacity-80">Rezultate pentru: <span className="font-medium">{q || "Ã¢â‚¬â€"}</span></p>

      {data.operators.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Operatori</h2>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {data.operators.map((o: any) => (
              <li key={o.slug} className="rounded border p-3">
                <a className="underline" href={`/casino/${o.slug}`}>{o.name}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Oferte</h2>
        <FilterBar basePath="/cauta" />
        <div className="mt-2">
          <OffersGrid offers={data.offers} />
        </div>
        {data.offers.length === 0 && <p className="mt-4 text-sm opacity-70">Nicio ofertÃ„Æ’ gÃ„Æ’sitÃ„Æ’.</p>}
      </section>
    </main>
  );
}
