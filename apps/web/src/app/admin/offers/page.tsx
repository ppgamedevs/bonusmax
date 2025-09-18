export const dynamic = "force-dynamic";
export const revalidate = 60;
import { prisma } from "@bonusmax/lib";
import { createOffer, updateOffer, deleteOffer } from "../actions";
import Link from "next/link";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ ?key=ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ (ADMIN_KEY) ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®n URL.</p>
      </main>
    );
  }
  return <>{children}</>;
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (await searchParams) || ({} as Record<string, string>);
  const keyParam = sp.key;
  const operators = await prisma.operator.findMany({ orderBy: { name: "asc" } });
  const networks = await (prisma as any).affiliateNetwork.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  const offers = await prisma.offer.findMany({ include: { operator: true }, orderBy: [{ createdAt: "desc" }] });

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Offers</h1>
        <p className="mt-2 text-sm">
          <Link href={("/admin/operators?key=" + encodeURIComponent(keyParam ?? "")) as any} className="underline">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ Manage Operators</Link>
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Create</h2>
          <form action={createOffer} className="mt-2 grid gap-2 md:grid-cols-2">
            <input type="hidden" name="key" defaultValue={keyParam} />
            <select className="rounded border px-3 py-2" name="operatorId" required>
              <option value="">Alege operator</option>
              {operators.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <input className="rounded border px-3 py-2" name="title" placeholder="titlu" required />
            <select className="rounded border px-3 py-2" name="offerType">
              <option>CASINO</option>
              <option>PARIURI</option>
              <option>ROTIRI</option>
              <option>FARA_DEPUNERE</option>
            </select>
            <input className="rounded border px-3 py-2" name="termsShort" placeholder="T&C scurt" required />
            <input className="rounded border px-3 py-2" name="termsUrl" placeholder="T&C URL (opÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºional)" />
            <input className="rounded border px-3 py-2" name="ctaBaseUrl" placeholder="tracker URL" required />
            <select className="rounded border px-3 py-2" name="networkId">
              <option value="">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â FÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢rÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ reÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºea ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â</option>
              {networks.map((n: any) => (
                <option key={n.id} value={n.id}>{n.name} ({n.slug})</option>
              ))}
            </select>
            <input className="rounded border px-3 py-2" name="urlTemplate" placeholder="https://trk...&subid={subid}" />
            <input className="rounded border px-3 py-2" name="priority" placeholder="prioritate (0-9999)" defaultValue="100" />
            <input className="rounded border px-3 py-2" name="country" defaultValue="RO" />
            <input className="rounded border px-3 py-2" type="date" name="startAt" />
            <input className="rounded border px-3 py-2" type="date" name="endAt" />
            <input className="rounded border px-3 py-2" name="wrMultiplier" placeholder="WR (ex: 30)" />
            <input className="rounded border px-3 py-2" name="minDeposit" placeholder="Min Dep (RON)" />
            <input className="rounded border px-3 py-2" name="maxCashout" placeholder="Max cashout (RON)" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" defaultChecked /> Activ
            </label>
            <button className="rounded border px-3 py-2 font-semibold md:col-span-2" type="submit">
              Create
            </button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Existing</h2>
          <div className="mt-2 grid gap-4">
            {offers.map((o) => (
              <div key={o.id} className="rounded border p-3">
                <div className="text-sm opacity-70">{o.operator.name}</div>
                <div className="font-semibold">{o.title}</div>
                <div className="text-xs opacity-60">ID: {o.id}</div>
                <form action={updateOffer} className="mt-2 grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="key" defaultValue={keyParam} />
                  <input type="hidden" name="id" defaultValue={o.id} />
                  <select className="rounded border px-3 py-2" name="operatorId" defaultValue={o.operatorId}>
                    {operators.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name}
                      </option>
                    ))}
                  </select>
                  <input className="rounded border px-3 py-2" name="title" defaultValue={o.title} />
                  <select className="rounded border px-3 py-2" name="offerType" defaultValue={o.offerType}>
                    <option>CASINO</option>
                    <option>PARIURI</option>
                    <option>ROTIRI</option>
                    <option>FARA_DEPUNERE</option>
                  </select>
                  <input className="rounded border px-3 py-2" name="termsShort" defaultValue={o.termsShort} />
                  <input className="rounded border px-3 py-2" name="termsUrl" defaultValue={o.termsUrl ?? ""} />
                  <input className="rounded border px-3 py-2" name="ctaBaseUrl" defaultValue={o.ctaBaseUrl} />
                  <select className="rounded border px-3 py-2" name="networkId" defaultValue={(o as any).networkId ?? ""}>
                    <option value="">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â FÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢rÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ reÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â¹ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºea ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â</option>
                    {networks.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.name} ({n.slug})</option>
                    ))}
                  </select>
                  <input className="rounded border px-3 py-2" name="urlTemplate" defaultValue={(o as any).urlTemplate ?? ""} />
                  <input className="rounded border px-3 py-2" name="priority" defaultValue={String(o.priority)} />
                  <input className="rounded border px-3 py-2" name="country" defaultValue={o.country} />
                  <input
                    className="rounded border px-3 py-2"
                    type="date"
                    name="startAt"
                    defaultValue={o.startAt ? new Date(o.startAt).toISOString().slice(0, 10) : ""}
                  />
                  <input
                    className="rounded border px-3 py-2"
                    type="date"
                    name="endAt"
                    defaultValue={o.endAt ? new Date(o.endAt).toISOString().slice(0, 10) : ""}
                  />
                  <input className="rounded border px-3 py-2" name="wrMultiplier" defaultValue={(o as any).wrMultiplier ?? ""} />
                  <input className="rounded border px-3 py-2" name="minDeposit" defaultValue={(o as any).minDeposit ?? ""} />
                  <input className="rounded border px-3 py-2" name="maxCashout" defaultValue={(o as any).maxCashout ?? ""} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isActive" defaultChecked={o.isActive} /> Activ
                  </label>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <button className="rounded border px-3 py-2 font-semibold" type="submit">
                      Save
                    </button>
                    <form action={deleteOffer} className="inline">
                      <input type="hidden" name="key" defaultValue={keyParam} />
                      <input type="hidden" name="id" defaultValue={o.id} />
                      <button className="rounded border px-3 py-2 text-red-600" type="submit">
                        Delete
                      </button>
                    </form>
                    <a href={`/bonus/${o.id}`} className="ml-auto rounded border px-3 py-2 text-sm underline">
                      View
                    </a>
                    <a href={`/go/${o.id}`} className="rounded border px-3 py-2 text-sm underline" rel="nofollow sponsored">
                      Track link
                    </a>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Guard>
  );
}
