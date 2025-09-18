import { prisma } from "@bonusmax/lib";
import { quickDisableOffer } from "../actions";

export const dynamic = "force-dynamic";
function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ ?key=ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ (ADMIN_KEY) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®n URL.</p>
      </main>
    );
  }
  return <>{children}</>;
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (await searchParams) || ({} as Record<string, string>);
  const keyParam = sp.key;

  // Oferte active la operatori nelicenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºiaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi (ar trebui sÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ fie 0)
  const badOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      country: "RO",
      operator: { isLicensedRO: false },
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
        { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
      ],
    },
    include: { operator: true },
  });

  // Operatorii cu licenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ expiratÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ (fÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢rÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ a depinde de tipÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ri Prisma: filtrÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢m ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®n JS)
  const allOps = await prisma.operator.findMany();
  const now = new Date();
  const expiredOps = allOps.filter((op: any) => op.onjnLicenseExpiry && new Date(op.onjnLicenseExpiry) < now);

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Compliance</h1>
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Oferte active la operatori nelicenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºiaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi</h2>
          {badOffers.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-600">OK ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Nu existÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢.</p>
          ) : (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">Operator</th>
                  <th className="p-2 text-left">OfertÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">AcÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºiune</th>
                </tr>
              </thead>
              <tbody>
                {badOffers.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">{o.operator.name}</td>
                    <td className="p-2">{o.title}</td>
                    <td className="p-2 text-center">{o.country}</td>
                    <td className="p-2 text-center">ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â</td>
                    <td className="p-2 text-center">
                      <form action={quickDisableOffer} className="inline-flex items-center gap-2">
                        <input type="hidden" name="key" defaultValue={keyParam} />
                        <input type="hidden" name="id" defaultValue={o.id} />
                        <button className="rounded border px-2 py-1 text-xs" type="submit">Disable</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Operatori cu licenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ expiratÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</h2>
          {expiredOps.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-600">OK ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Niciunul.</p>
          ) : (
            <ul className="mt-2 list-disc pl-6 text-sm">
              {expiredOps.map((op) => (
                <li key={op.id}>{op.name} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â expirat</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Guard>
  );
}
