import { prisma, revenueByOffer } from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return <main className="container mx-auto px-4 py-10"><h1 className="text-xl font-semibold">401 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Unauthorized</h1></main>;
  }
  return <>{children}</>;
}

export default async function Page({
  const resolvedSearchParams = await (searchParams || Promise.resolve({} as Record<string, string | undefined>)); searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const keyParam = resolvedSearchParams.key;
  const rows = await (prisma as any).revenueEvent.findMany({
    include: { offer: { include: { operator: true } }, network: true },
    orderBy: { ts: "desc" },
    take: 200,
  });
  const total = rows.reduce((acc: number, r: any) => acc + (Number(r.amount) || 0), 0);
  const epcTop = await revenueByOffer();

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Revenue (ultimele 200)</h1>
        <p className="mt-1 text-sm opacity-80">Total evenimente: {rows.length} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ Total sumÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢: {total.toFixed(2)} {rows[0]?.currency || "RON"}</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Data</th>
              <th className="p-2">Net</th>
              <th className="p-2">Operator</th>
              <th className="p-2">OfertÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
              <th className="p-2">Tip</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">SumÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.ts).toLocaleString("ro-RO")}</td>
                <td className="p-2">{r.network.name}</td>
                <td className="p-2">{r.offer.operator.name}</td>
                <td className="p-2">{r.offer.title}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{r.status ?? "-"}</td>
                <td className="p-2 text-right">{r.amount.toFixed(2)} {r.currency}</td>
              </tr>
            ))}
            <tr className="border-t font-semibold">
              <td className="p-2" colSpan={6}>Total</td>
              <td className="p-2 text-right">{total.toFixed(2)} {rows[0]?.currency || "RON"}</td>
            </tr>
          </tbody>
        </table>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">EPC pe oferte (ultimele 30 zile)</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Operator</th>
                <th className="p-2 text-left">OfertÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {epcTop.map((r: any) => (
                <tr key={r.offer.id} className="border-t">
                  <td className="p-2">{r.offer.operator.name}</td>
                  <td className="p-2">{r.offer.title}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)} RON</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)} RON</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </Guard>
  );
}
