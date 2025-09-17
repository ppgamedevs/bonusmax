import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dezabonare" };

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const email = (searchParams?.email || "").toLowerCase().trim();
  let ok = false;
  if (email) {
    const sub = await (prisma as any).newsletterSubscriber.findUnique({ where: { email } });
    if (sub) {
      await (prisma as any).newsletterSubscriber.update({ where: { id: sub.id }, data: { status: "UNSUB", unsubAt: new Date() } });
      ok = true;
    }
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Dezabonare</h1>
      {ok ? (
        <p className="mt-2">Ai fost dezabonat(ă). Ne pare rău să te vedem plecând!</p>
      ) : (
        <p className="mt-2">Email invalid sau lipsă.</p>
      )}
    </main>
  );
}
