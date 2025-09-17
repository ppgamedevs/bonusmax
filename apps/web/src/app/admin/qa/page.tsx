import { prisma } from "@bonusmax/lib";
import { recheckOfferLink } from "../actions";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 Ã¢â‚¬â€œ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃ„Æ’ ?key=Ã¢â‚¬Â¦ (ADMIN_KEY) ÃƒÂ®n URL.</p>
      </main>
    );
  }
  return <>{children}</>;
}

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const keyParam = searchParams?.key;

  const problems = await prisma.offer.findMany({
    where: {
      OR: [
        { lastCheckedAt: null },
        { lastCheckStatus: { not: "OK" } as any },
        { lastHttpCode: { gte: 400 } as any },
      ],
    },
    include: { operator: true },
    orderBy: [{ lastCheckedAt: "asc" as any }, { updatedAt: "desc" }],
    take: 100,
  });

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin Ã¢â‚¬â€œ QA</h1>
        <p className="mt-2 text-sm opacity-80">Link checker & oferte cu probleme.</p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Oferte de verificat ({problems.length})</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Operator</th>
                <th className="p-2 text-left">OfertÃ„Æ’</th>
                <th className="p-2">Ultima verificare</th>
                <th className="p-2">Status</th>
                <th className="p-2">HTTP</th>
                <th className="p-2">AcÃˆâ€ºiuni</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.operator.name}</td>
                  <td className="p-2">{o.title}</td>
                  <td className="p-2 text-center">{o.lastCheckedAt ? new Date(o.lastCheckedAt).toLocaleString("ro-RO") : "Ã¢â‚¬â€"}</td>
                  <td className="p-2 text-center">{o.lastCheckStatus ?? "Ã¢â‚¬â€"}</td>
                  <td className="p-2 text-center">{o.lastHttpCode ?? "Ã¢â‚¬â€"}</td>
                  <td className="p-2">
                    <form action={recheckOfferLink} className="inline">
                      <input type="hidden" name="key" defaultValue={keyParam} />
                      <input type="hidden" name="offerId" defaultValue={o.id} />
                      <button className="rounded border px-3 py-1" type="submit">Recheck</button>
                    </form>
                    <a className="ml-2 underline" href={`/go/${o.id}`} rel="nofollow sponsored">Link</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </Guard>
  );
}
