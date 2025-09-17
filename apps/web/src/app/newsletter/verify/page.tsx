import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verificare abonare" };

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const token = searchParams?.token || "";
  let ok = false;
  if (token) {
    const sub = await (prisma as any).newsletterSubscriber.findFirst({ where: { token } });
    if (sub) {
      await (prisma as any).newsletterSubscriber.update({ where: { id: sub.id }, data: { status: "ACTIVE", verifiedAt: new Date() } });
      ok = true;
    }
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Verificare abonare</h1>
      {ok ? (
        <p className="mt-2">MulÃƒË†Ã¢â‚¬Âºumim! Abonarea ta a fost confirmatÃƒâ€žÃ†â€™.</p>
      ) : (
        <p className="mt-2">Token invalid sau lipsÃƒâ€žÃ†â€™.</p>
      )}
    </main>
  );
}
