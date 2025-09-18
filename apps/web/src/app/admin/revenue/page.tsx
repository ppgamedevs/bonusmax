import { prisma } from '../../../../../../packages/lib/db/client';
type PageProps = { searchParams?: Promise<Record<string, string | undefined>> };

;

;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams: Record<string, string | undefined> = searchParams ? await searchParams : {};
  const keyParam = resolvedSearchParams.key;
  
  const rows = await (prisma as any).revenueEvent.findMany({
    include: { offer: { include: { operator: true } }, network: true },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div className="p-6">
      <h1>Revenue</h1>
      {keyParam && <p>Key: {keyParam}</p>}
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}