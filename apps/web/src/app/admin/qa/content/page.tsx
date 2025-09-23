export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';

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

async function resolveIssue(formData: FormData) {
  'use server';
  if (!process.env.ADMIN_KEY || String(formData.get('key')) !== process.env.ADMIN_KEY)
    throw new Error('Unauthorized');
  const id = String(formData.get('id'));
  await (prisma as any).contentQaIssue.update({ where: { id }, data: { resolvedAt: new Date() } });
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams = await (searchParams ||
    Promise.resolve({} as Record<string, string | undefined>));
  const keyParam = resolvedSearchParams.key;
  const sev = resolvedSearchParams.sev as 'ERROR' | 'WARN' | 'INFO' | undefined;
  const type = resolvedSearchParams.type as 'OFFER' | 'GUIDE' | 'OPERATOR' | undefined;
  const issues = await (prisma as any).contentQaIssue.findMany({
    where: {
      resolvedAt: null,
      ...(sev ? { severity: sev as any } : {}),
      ...(type ? { entityType: type as any } : {}),
    },
    orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    take: 300,
  });
  const counts = await (prisma as any).contentQaIssue.groupBy({
    by: ['severity'],
    where: { resolvedAt: null },
    _count: { severity: true },
  });

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin — QA Content</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <a
            className="rounded border px-2 py-1"
            href={`/api/admin/qa/run?key=${keyParam}`}
            onClick={(e) => {
              e.preventDefault();
              fetch(`/api/admin/qa/run?key=${keyParam}`, {
                method: 'POST',
                body: JSON.stringify({ type: 'offer', limit: 100 }),
                headers: { 'content-type': 'application/json' },
              }).then(() => (location as any).reload());
            }}
          >
            Re-run Offers
          </a>
          <span className="ml-3 opacity-60">
            Ne-rezolvate: {counts.reduce((s: number, c: any) => s + c._count.severity, 0)}
          </span>
        </div>

        <table className="mt-4 w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Sev</th>
              <th className="p-2 text-left">Rule</th>
              <th className="p-2 text-left">Mesaj</th>
              <th className="p-2 text-left">Entity</th>
              <th className="p-2 text-left">Creat</th>
              <th className="p-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.severity}</td>
                <td className="p-2">{i.ruleId}</td>
                <td className="p-2">{i.message}</td>
                <td className="p-2">
                  {i.entityType} — {i.entityId}
                </td>
                <td className="p-2">{new Date(i.createdAt).toLocaleString('ro-RO')}</td>
                <td className="p-2 text-center">
                  <form action={resolveIssue}>
                    <input type="hidden" name="key" defaultValue={keyParam} />
                    <input type="hidden" name="id" defaultValue={i.id} />
                    <button className="rounded border px-3 py-1">Resolve</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 text-xs opacity-60">
          Reguli: FWD-001/002 (formulări interzise), WR-001, DEP-001, DATE-001, LIC-001,
          SEO-001/002, DISC-001, H1-001.
        </p>
      </main>
    </Guard>
  );
}
