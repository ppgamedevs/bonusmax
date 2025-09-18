import Link from "next/link";
import {
  analyticsByOperator,
  analyticsClicksByOffer,
  analyticsImpressionsByOffer
} from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function getParam(sp: Record<string, string> | undefined, key: string) {
  const v = sp?.[key];
  return typeof v === "string" ? v : undefined;
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (await searchParams) || {} as Record<string, string>;
  const key = getParam(sp, "key");
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃƒâ€žÃ†â€™ ?key=ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ (ADMIN_KEY) ÃƒÆ’Ã‚Â®n URL.</p>
      </main>
    );
  }

  const from = getParam(sp, "from");
  const to = getParam(sp, "to");

  const clicks = await analyticsClicksByOffer(from, to);
  const impsMap = await analyticsImpressionsByOffer(from, to) as Map<string, number>;

  const rows: { offer: any; clicks: number; impressions: number; ctr: number }[] = clicks
    .map((c) => {
      const impressions = Number(impsMap.get(c.offer.id) ?? 0);
      const ctr: number = impressions ? Number(c.clicks) / Number(impressions) : 0;
      return { offer: c.offer, clicks: c.clicks, impressions, ctr };
    })
    .sort((a, b) => b.clicks - a.clicks);

  const byOperator = await analyticsByOperator(from, to);

  return (
    <main className="container mx-auto px-4 py-8" id="main">
      <h1 className="text-2xl font-bold">Admin ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ PerformanÃƒË†Ã¢â‚¬ÂºÃƒâ€žÃ†â€™</h1>

      <form className="mt-4 flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs opacity-70">From (YYYY-MM-DD)</label>
          <input className="rounded border px-3 py-2 text-sm" type="date" name="from" defaultValue={from} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs opacity-70">To (YYYY-MM-DD)</label>
          <input className="rounded border px-3 py-2 text-sm" type="date" name="to" defaultValue={to} />
        </div>
        <input type="hidden" name="key" value={key} />
        <button className="rounded border px-3 py-2 text-sm" type="submit">
          AplicÃƒâ€žÃ†â€™
        </button>
      </form>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Top Oferte (Clicks / Impressions / CTR)</h2>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Operator</th>
              <th className="text-left p-2">OfertÃƒâ€žÃ†â€™</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Impr.</th>
              <th className="p-2">CTR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.offer.id} className="border-t">
                <td className="p-2">{r.offer.operator.name}</td>
                <td className="p-2">
                  <Link href={("/bonus/" + r.offer.id) as any} className="underline">
                    {r.offer.title}
                  </Link>
                </td>
                <td className="p-2 text-center">{r.clicks}</td>
                <td className="p-2 text-center">{r.impressions}</td>
                <td className="p-2 text-center">{(r.ctr * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Agregat pe Operator</h2>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Operator</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Impr.</th>
              <th className="p-2">CTR</th>
            </tr>
          </thead>
          <tbody>
            {byOperator.map((r) => (
              <tr key={r.operator.id} className="border-t">
                <td className="p-2">{r.operator.name}</td>
                <td className="p-2 text-center">{r.clicks}</td>
                <td className="p-2 text-center">{r.impressions}</td>
                <td className="p-2 text-center">{(r.ctr * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
