export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';

export const metadata = { title: 'Verificare abonare' };

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams: Record<string, string | undefined> = searchParams
    ? await searchParams
    : {};
  const token = resolvedSearchParams.token || '';
  let ok = false;
  if (token) {
    const sub = await (prisma as any).newsletterSubscriber.findFirst({ where: { token } });
    if (sub) {
      await (prisma as any).newsletterSubscriber.update({
        where: { id: sub.id },
        data: { status: 'ACTIVE', verifiedAt: new Date() },
      });
      ok = true;
    }
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Verificare abonare</h1>
      {ok ? (
        <p className="mt-2">
          Mulțumim! Abonarea ta a fost confirmată.
        </p>
      ) : (
        <p className="mt-2">
          Token invalid sau lipsă.
        </p>
      )}
    </main>
  );
}
