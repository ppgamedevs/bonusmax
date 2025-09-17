import { revenueByOffer, revenueByOperator, spendBySource, prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return <main className="container mx-auto px-4 py-10"><h1 className="text-xl font-semibold">401 Ã¢â‚¬â€œ Unauthorized</h1></main>;
  }
  return <>{children}</>;
}

function getParam(sp: any, k: string) { return typeof sp?.[k] === "string" ? sp[k] : undefined; }

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const keyParam = searchParams?.key;
  const from = getParam(searchParams, "from");
  const to = getParam(searchParams, "to");

  const [byOffer, byOperator, spend] = await Promise.all([
    revenueByOffer(from, to),
    revenueByOperator(from, to),
    spendBySource(from, to),
  ]);

  const now = new Date(); const start = from ? new Date(from) : new Date(now.getTime() - 30 * 864e5);
  const clicks = await (prisma as any).clickEvent.count({ where: { ts: { gte: start, lte: to ? new Date(to) : now } } });
  const imps = await (prisma as any).offerImpression.count({ where: { ts: { gte: start, lte: to ? new Date(to) : now } } });
  const ctr = imps ? clicks / imps : 0;

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin Ã¢â‚¬â€œ ROAS / EPC</h1>

        <form className="mt-2 flex flex-wrap items-end gap-2">
          <label className="text-xs">From <input type="date" name="from" defaultValue={from} className="ml-2 rounded border px-2 py-1 text-sm" /></label>
          <label className="text-xs">To <input type="date" name="to" defaultValue={to} className="ml-2 rounded border px-2 py-1 text-sm" /></label>
          <input type="hidden" name="key" value={keyParam} />
          <button className="rounded border px-3 py-1 text-sm" type="submit">AplicÃ„Æ’</button>
        </form>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Pe oferte</h2>
          <table className="mt-2 w-full text-sm">
            <thead><tr><th className="p-2 text-left">Operator</th><th className="p-2 text-left">OfertÃ„Æ’</th><th className="p-2 text-center">Clicks</th><th className="p-2 text-right">Revenue</th><th className="p-2 text-right">EPC</th></tr></thead>
            <tbody>
              {byOffer.map((r: any) => (
                <tr key={r.offer.id} className="border-top">
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

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Pe operator</h2>
          <table className="mt-2 w-full text-sm">
            <thead><tr><th className="p-2 text-left">Operator</th><th className="p-2 text-center">Clicks</th><th className="p-2 text-right">Revenue</th><th className="p-2 text-right">EPC</th></tr></thead>
            <tbody>
              {byOperator.map((r: any) => (
                <tr key={r.operator.id} className="border-top">
                  <td className="p-2">{r.operator.name}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)} RON</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)} RON</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">ROAS (by source)</h2>
          <table className="mt-2 w-full text-sm">
            <thead><tr><th className="p-2 text-left">SursÃ„Æ’</th><th className="p-2 text-right">Spend</th><th className="p-2 text-right">Revenue</th><th className="p-2 text-right">ROAS</th></tr></thead>
            <tbody>
              {spend.map((s: any) => (
                <tr key={s.source} className="border-t">
                  <td className="p-2">{s.source}</td>
                  <td className="p-2 text-right">{s.spend.toFixed(2)} RON</td>
                  <td className="p-2 text-right">Ã¢â‚¬â€</td>
                  <td className="p-2 text-right">Ã¢â‚¬â€</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs opacity-70">NotÃ„Æ’: pentru ROAS complet pe surse, extindeÃˆâ€ºi atribuirea cu revenue sum pe UTM source (join RevenueEvent Ã¢â€ â€™ ClickEvent prin clickId).</p>
        </section>

        <p className="mt-6 text-xs opacity-60">CTR site-wide: {(ctr * 100).toFixed(2)}% Ã¢â‚¬Â¢ EPC/ROAS ÃƒÂ®n RON</p>
      </main>
    </Guard>
  );
}
