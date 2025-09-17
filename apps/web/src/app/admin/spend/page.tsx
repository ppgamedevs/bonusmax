import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return <main className="container mx-auto px-4 py-10"><h1 className="text-xl font-semibold">401 – Unauthorized</h1></main>;
  }
  return <>{children}</>;
}

async function createSpend(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const day = new Date(String(formData.get("day")));
  day.setHours(0,0,0,0);
  await (prisma as any).adSpend.create({
    data: {
      day,
      source: String(formData.get("source")),
      campaign: String(formData.get("campaign") || ""),
      amount: Number(formData.get("amount") || 0),
      currency: "RON",
    },
  });
}

export default async function Page({ searchParams }: { searchParams?: Record<string,string> }) {
  const keyParam = searchParams?.key;
  const latest = await (prisma as any).adSpend.findMany({ orderBy: { day: "desc" }, take: 30 });
  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin – Ad Spend</h1>
        <form action={createSpend} className="mt-4 grid gap-2 md:grid-cols-4">
          <input type="hidden" name="key" defaultValue={keyParam} />
          <input className="rounded border px-3 py-2" type="date" name="day" required />
          <input className="rounded border px-3 py-2" name="source" placeholder="sursă (ex: google)" required />
          <input className="rounded border px-3 py-2" name="campaign" placeholder="campanie (opțional)" />
          <input className="rounded border px-3 py-2" type="number" step="0.01" name="amount" placeholder="RON" />
          <button className="rounded border px-3 py-2 font-semibold md:col-span-4" type="submit">Adaugă</button>
        </form>
        <table className="mt-6 w-full text-sm">
          <thead><tr><th className="p-2 text-left">Zi</th><th className="p-2">Sursă</th><th className="p-2">Campanie</th><th className="p-2 text-right">Sumă</th></tr></thead>
          <tbody>
            {latest.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.day).toLocaleDateString("ro-RO")}</td>
                <td className="p-2">{r.source}</td>
                <td className="p-2">{r.campaign ?? "—"}</td>
                <td className="p-2 text-right">{Number(r.amount).toFixed(2)} {r.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Guard>
  );
}
