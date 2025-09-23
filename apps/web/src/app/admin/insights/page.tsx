export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { overview30, topPagesEpc, utmPerformance } from '@bonusmax/lib';

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 — Unauthorized</h1>
      </main>
    );
  }
  return <>{children}</>;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const keyParam = resolvedSearchParams.key;
  const o = await overview30();
  const pages = await topPagesEpc(30, 10, 30);
  const utm = await utmPerformance(30, 10, 50);

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Insights (30 zile)</h1>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border p-4">
            <div className="text-xs opacity-70">Clicks</div>
            <div className="text-2xl font-bold">{o.clicks.toLocaleString('ro-RO')}</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-xs opacity-70">Conversii</div>
            <div className="text-2xl font-bold">{o.convs.toLocaleString('ro-RO')}</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-xs opacity-70">Revenue</div>
            <div className="text-2xl font-bold">{o.revenue.toFixed(2)} RON</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="text-xs opacity-70">EPC / CVR</div>
            <div className="text-2xl font-bold">
              {o.epc.toFixed(2)} RON{' '}
              <span className="text-sm opacity-70">• {(o.cvr * 100).toFixed(2)}%</span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Top pages după EPC (min 10 clicks)</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Pagină</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((r: any) => (
                <tr key={r.path} className="border-t">
                  <td className="p-2">{r.path}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)} RON</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)} RON</td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={4}>
                    Nimic încă (ai nevoie de clicks).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">UTM performance (min 10 clicks)</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">source</th>
                <th className="p-2">medium</th>
                <th className="p-2">campaign</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {utm.map((r: any) => (
                <tr key={`${r.source}|${r.medium}|${r.campaign}`} className="border-t">
                  <td className="p-2">{r.source}</td>
                  <td className="p-2">{r.medium}</td>
                  <td className="p-2">{r.campaign}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)} RON</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)} RON</td>
                </tr>
              ))}
              {utm.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={6}>
                    Nimic încă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </Guard>
  );
}
