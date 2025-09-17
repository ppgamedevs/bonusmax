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

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const key = searchParams?.key;
  const rows = await (prisma as any).backlink.findMany({ include: { domain: true }, orderBy: [{ ok: "asc" }, { lastSeen: "asc" }], take: 300 });
  return (
    <Guard keyParam={key}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Backlinks</h1>
        <p className="mt-2 text-sm opacity-70">
          <a className="underline" href={`/api/cron/backlinks?key=${key}&limit=50`}>
            RuleazÃ„Æ’ verificare (50)
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
                <td className="p-2">{r.anchor ?? "Ã¢â‚¬â€"}</td>
                <td className="p-2">{r.lastSeen ? new Date(r.lastSeen).toLocaleString("ro-RO") : "Ã¢â‚¬â€"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Guard>
  );
}
