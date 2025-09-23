      <BackHome />
import BackHome from '@/components/BackHome';
export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';

export const metadata = { title: 'Operatori licențiați ONJN — Index' };

export default async function Page() {
  const ops = await (prisma as any).operator.findMany({
    where: { isLicensedRO: true },
    orderBy: [{ name: 'asc' }],
  });
  const csv = [
    'name,website,onjnLicenseId,onjnLicenseExpiry',
    ...ops.map((o: any) =>
      [
        o.name,
        o.website || '',
        o.onjnLicenseId || '',
        o.onjnLicenseExpiry ? new Date(o.onjnLicenseExpiry).toISOString().slice(0, 10) : '',
      ].join(',')
    ),
  ].join('\n');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Operatori licențiați ONJN — Index</h1>
      <p className="mt-2 text-sm opacity-80">
        Listă informativă bazată pe datele noastre. Verifică întotdeauna site-ul ONJN pentru
        actualizări. 18+ Joacă responsabil.
      </p>

      <BackHome />

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Operator</th>
            <th className="p-2">Website</th>
            <th className="p-2">Licență</th>
            <th className="p-2">Expiră</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((o: any) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.name}</td>
              <td className="p-2">
                {o.website ? (
                  <a className="underline" href={o.website} rel="nofollow">
                    site
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="p-2">{o.onjnLicenseId || '—'}</td>
              <td className="p-2">
                {o.onjnLicenseExpiry
                  ? new Date(o.onjnLicenseExpiry).toLocaleDateString('ro-RO')
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form method="post" action={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}>
        <button className="mt-4 rounded border px-3 py-2">Descarcă CSV</button>
      </form>
    </main>
  );
}
