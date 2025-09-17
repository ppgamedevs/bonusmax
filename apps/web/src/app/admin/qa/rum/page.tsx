import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃƒâ€žÃ†â€™ ?key=ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ (ADMIN_KEY) ÃƒÆ’Ã‚Â®n URL.</p>
      </main>
    );
  }
  return <>{children}</>;
}

function quantiles(values: number[], qs: number[]) {
  if (values.length === 0) return qs.map(() => 0);
  const arr = [...values].sort((a, b) => a - b);
  return qs.map((q) => {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined) return arr[base] + rest * (arr[base + 1] - arr[base]);
    return arr[base];
  });
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const keyParam = searchParams?.key;
  const now = new Date();
  const start = new Date(now.getTime() - 7 * 864e5);

  // Fetch last 7 days RUM samples (cap to keep it light)
  const rows = await (prisma as any).rumEvent.findMany({
    where: { ts: { gte: start, lte: now } },
    select: { metric: true, url: true, value: true },
    orderBy: { ts: "desc" },
    take: 5000,
  });

  // Group by metric -> url
  const grouped = new Map<string, Map<string, number[]>>();
  for (const r of rows as Array<{ metric: string; url: string | null; value: number }>) {
    const m = r.metric;
    const u = r.url || "/";
    if (!grouped.has(m)) grouped.set(m, new Map());
    const byUrl = grouped.get(m)!;
    if (!byUrl.has(u)) byUrl.set(u, []);
    byUrl.get(u)!.push(r.value);
  }

  // Build summary (limit each metric to top 10 URLs by sample count)
  const summary: Array<{ metric: string; url: string; n: number; p50: number; p75: number; p90: number }> = [];
  for (const [metric, byUrl] of grouped.entries()) {
    const entries = Array.from(byUrl.entries()).sort((a, b) => b[1].length - a[1].length).slice(0, 10);
    for (const [url, values] of entries) {
      const [p50, p75, p90] = quantiles(values, [0.5, 0.75, 0.9]);
      summary.push({ metric, url, n: values.length, p50, p75, p90 });
    }
  }

  // Order for display: by metric then url
  summary.sort((a, b) => (a.metric === b.metric ? a.url.localeCompare(b.url) : a.metric.localeCompare(b.metric)));

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">RUM ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Web Vitals (7 zile)</h1>
        <p className="mt-2 text-sm opacity-80">Agregat local din {rows.length.toLocaleString("ro-RO")} mÃƒâ€žÃ†â€™surÃƒâ€žÃ†â€™tori LCP/CLS/INP/TTFB.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2 text-right">N</th>
                <th className="p-2 text-right">p50</th>
                <th className="p-2 text-right">p75</th>
                <th className="p-2 text-right">p90</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{s.metric}</td>
                  <td className="p-2"><a className="underline" href={s.url}>{s.url}</a></td>
                  <td className="p-2 text-right">{s.n}</td>
                  <td className="p-2 text-right">{s.p50.toFixed(2)}</td>
                  <td className="p-2 text-right">{s.p75.toFixed(2)}</td>
                  <td className="p-2 text-right">{s.p90.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Guard>
  );
}
