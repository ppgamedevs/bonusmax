export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';
import { quickDisableOffer } from '../actions';

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 — Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">
          Adaugă ?key=<strong>ADMIN_KEY</strong> în URL.
        </p>
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
  const sp = (await searchParams) || ({} as Record<string, string>);
  const keyParam = sp.key;

  // Oferte active la operatori nelicențiați (ar trebui să fie 0)
  const badOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      country: 'RO',
      operator: { isLicensedRO: false },
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
        { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
      ],
    },
    include: { operator: true },
  });

  // Operatorii cu licență ONJN expirată (detecția depinde de tipurile Prisma; filtrăm după data curentă)
  const allOps = await prisma.operator.findMany();
  const now = new Date();
  const expiredOps = allOps.filter(
    (op: any) => op.onjnLicenseExpiry && new Date(op.onjnLicenseExpiry) < now
  );

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin — Compliance</h1>
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Oferte active la operatori nelicențiați</h2>
          {badOffers.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-600">OK — Nu există.</p>
          ) : (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left">Operator</th>
                  <th className="p-2 text-left">Ofertă</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Acțiune</th>
                </tr>
              </thead>
              <tbody>
                {badOffers.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">{o.operator.name}</td>
                    <td className="p-2">{o.title}</td>
                    <td className="p-2 text-center">{o.country}</td>
                    <td className="p-2 text-center">—</td>
                    <td className="p-2 text-center">
                      <form action={quickDisableOffer} className="inline-flex items-center gap-2">
                        <input type="hidden" name="key" defaultValue={keyParam} />
                        <input type="hidden" name="id" defaultValue={o.id} />
                        <button className="rounded border px-2 py-1 text-xs" type="submit">
                          Disable
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Operatori cu licență expirată</h2>
          {expiredOps.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-600">OK — Niciunul.</p>
          ) : (
            <ul className="mt-2 list-disc pl-6 text-sm">
              {expiredOps.map((op) => (
                <li key={op.id}>{op.name} — licență expirată</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Guard>
  );
}
