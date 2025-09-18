import { prisma } from "@bonusmax/lib/prisma";

interface PageProps {
  searchParams?: Promise<Record<string, string>>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await (searchParams || Promise.resolve({}));
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