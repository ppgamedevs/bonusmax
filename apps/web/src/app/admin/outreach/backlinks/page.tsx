import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";
function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY)
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl">401</h1>
      </main>
    );
  return <>{children}</>;
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const resolvedSearchParams: Record<string, string> = (await searchParams) ?? {};
  const key = resolvedSearchParams.key;
  const rows = await (prisma as any).backlink.findMany({ include: { domain: true }, orderBy: [{ ok: "asc" }, { lastSeen: "asc" }], take: 300 });
  return (
    <Guard keyParam={key}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Backlinks</h1>
        <p className="mt-2 text-sm opacity-70">
          <a className="underline" href={`/api/cron/backlinks?key=${key}&limit=50`}>
            RuleazÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ verificare (50)
          </a>
        </p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Status</th>
              <th className="p-2">Domeniu</th>
              <th className="p-2">URL</th>
              <th className="p-2">Anchor</th>
              <th className="p-2">Ultima verificare</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className={`p-2 ${r.ok ? "text-emerald-700" : "text-rose-700"}`}>{r.ok ? "OK" : "Missing"}</td>
                <td className="p-2">{r.domain.host}</td>
                <td className="p-2">
                  <a className="underline" href={r.url} rel="nofollow" target="_blank">
                    {r.url}
                  </a>
                </td>
                <td className="p-2">{r.anchor ?? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                <td className="p-2">{r.lastSeen ? new Date(r.lastSeen).toLocaleString("ro-RO") : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Guard>
  );
}
