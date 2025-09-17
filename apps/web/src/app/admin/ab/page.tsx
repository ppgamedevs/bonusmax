import { abReportCta, abReportOrder, uiCtrReport } from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 Ã¢â‚¬â€œ Unauthorized</h1>
      </main>
    );
  }
  return <>{children}</>;
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const keyParam = searchParams?.key;
  const cta = await abReportCta();
  const ord = await abReportOrder();
  const sticky = await uiCtrReport("sticky_bar");
  const exit = await uiCtrReport("exit_modal");

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">A/B (30 zile) Ã¢â‚¬â€ Light</h1>
        <p className="mt-1 text-sm opacity-70">Min 10 clicks pentru rÃƒÂ¢ndurile pe paginÃ„Æ’. Valorile sunt ÃƒÂ®n RON.</p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">CTA Copy Ã¢â‚¬â€ Total</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {cta.total.map((r: any) => (
                <tr key={r.variant} className="border-t">
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)}</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-6 font-semibold">CTA Copy Ã¢â‚¬â€ Top pagini (min 10 clicks)</h3>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-left">PaginÃ„Æ’</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {cta.perPath.map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2">{r.path}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)}</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)}</td>
                </tr>
              ))}
              {cta.perPath.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={5}>
                    ÃƒÅ½ncÃ„Æ’ nu ai destule clicks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Offers Order Ã¢â‚¬â€ Total</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">Revenue</th>
                <th className="p-2 text-right">EPC</th>
              </tr>
            </thead>
            <tbody>
              {ord.total.map((r: any) => (
                <tr key={r.variant} className="border-t">
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{r.revenue.toFixed(2)}</td>
                  <td className="p-2 text-right">{r.epc.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Sticky bar Ã¢â‚¬â€ CTR (30 zile)</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-center">Impressions</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {sticky.total.map((r: any) => (
                <tr key={r.variant} className="border-t">
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2 text-center">{r.impressions}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{(r.ctr * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-6 font-semibold">Sticky Ã¢â‚¬â€ top pagini (min 10 imp)</h3>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">PaginÃ„Æ’</th>
                <th className="p-2">Variant</th>
                <th className="p-2 text-center">Imp</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {sticky.perPath.map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.path}</td>
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2 text-center">{r.impressions}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{(r.ctr * 100).toFixed(2)}%</td>
                </tr>
              ))}
              {sticky.perPath.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={5}>
                    Nimic ÃƒÂ®ncÃ„Æ’.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Exit-intent Ã¢â‚¬â€ CTR (30 zile)</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-center">Impressions</th>
                <th className="p-2 text-center">Clicks</th>
                <th className="p-2 text-right">CTR</th>
              </tr>
            </thead>
            <tbody>
              {exit.total.map((r: any) => (
                <tr key={r.variant} className="border-t">
                  <td className="p-2">{r.variant}</td>
                  <td className="p-2 text-center">{r.impressions}</td>
                  <td className="p-2 text-center">{r.clicks}</td>
                  <td className="p-2 text-right">{(r.ctr * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>
    </Guard>
  );
}
