import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";
function Guard({ children, keyParam }: { children: any; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) return <main className="p-8">401</main>;
  return <>{children}</>;
}

async function act(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  const action = String(formData.get("action"));
  if (action === "approve") await (prisma as any).feedItem.update({ where: { id }, data: { status: "APPROVED" } });
  if (action === "reject") await (prisma as any).feedItem.update({ where: { id }, data: { status: "REJECTED" } });
  if (action === "feature") await (prisma as any).feedItem.update({ where: { id }, data: { featured: true, status: "APPROVED" } });
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const searchParamsObj = (typeof searchParams === 'object' && 'then' in (searchParams as any)) ? await (searchParams as any) : (searchParams as any);
  const key = searchParamsObj?.key;
  const pending = await (prisma as any).feedItem.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 100, include: { source: true, tags: { include: { tag: true } } } });
  const recent = await (prisma as any).feedItem.findMany({ where: { status: "APPROVED" }, orderBy: { publishedAt: "desc" }, take: 50, include: { source: true, tags: { include: { tag: true } } } });

  return (
    <Guard keyParam={key}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Feedy ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Review</h1>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">ÃƒÆ’Ã…Â½n aÃƒË†Ã¢â€žÂ¢teptare</h2>
          <ul className="mt-2 space-y-2">
            {pending.map((i: any) => (
              <li key={i.id} className="rounded border p-3">
                <div className="text-sm opacity-70">{i.source?.name || "UGC"}</div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm opacity-80">{i.excerpt || ""}</div>
                <div className="mt-2 flex gap-2 text-sm">
                  <form action={act}>
                    <input type="hidden" name="key" defaultValue={key} />
                    <input type="hidden" name="id" defaultValue={i.id} />
                    <button name="action" value="approve" className="rounded border px-2 py-1">
                      Approve
                    </button>
                  </form>
                  <form action={act}>
                    <input type="hidden" name="key" defaultValue={key} />
                    <input type="hidden" name="id" defaultValue={i.id} />
                    <button name="action" value="reject" className="rounded border px-2 py-1">
                      Reject
                    </button>
                  </form>
                  <form action={act}>
                    <input type="hidden" name="key" defaultValue={key} />
                    <input type="hidden" name="id" defaultValue={i.id} />
                    <button name="action" value="feature" className="rounded border px-2 py-1">
                      Feature
                    </button>
                  </form>
                  <a className="underline" href={i.url} target="_blank">
                    deschide sursa
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Aprobate recent</h2>
          <ul className="mt-2 space-y-2">
            {recent.map((i: any) => (
              <li key={i.id} className="rounded border p-3">
                <div className="text-sm opacity-70">{i.source?.name || "UGC"}</div>
                <div className="font-semibold">{i.title}</div>
                <a className="text-sm underline" href={`/noutati/${i.slug}`} target="_blank">
                  /noutati/{i.slug}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Guard>
  );
}
