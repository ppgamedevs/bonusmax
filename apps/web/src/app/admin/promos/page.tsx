import { prisma } from "@bonusmax/lib";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Unauthorized</h1>
        <p className="mt-2 text-sm opacity-80">AdaugÃƒâ€žÃ†â€™ ?key=ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ (ADMIN_KEY) ÃƒÆ’Ã‚Â®n URL.</p>
      </main>
    );
  }
  return <>{children}</>;
}

async function createPromo(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY) throw new Error("ADMIN_KEY not set");
  if (String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const data = {
    offerId: String(formData.get("offerId")),
    slot: String(formData.get("slot")) as any,
    country: String(formData.get("country") || "RO"),
    label: String(formData.get("label") || "Sponsored"),
    isActive: formData.get("isActive") === "on",
    weight: Number(formData.get("weight") || 100),
    startAt: formData.get("startAt") ? new Date(String(formData.get("startAt"))) : null,
    endAt: formData.get("endAt") ? new Date(String(formData.get("endAt"))) : null,
  };
  await (prisma as any).promoPlacement.create({ data });
  revalidatePath("/");
  revalidatePath("/bonusuri-fara-depunere");
  revalidatePath("/rotiri-gratuite");
}

async function updatePromo(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY) throw new Error("ADMIN_KEY not set");
  if (String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  const data = {
    offerId: String(formData.get("offerId")),
    slot: String(formData.get("slot")) as any,
    country: String(formData.get("country") || "RO"),
    label: String(formData.get("label") || "Sponsored"),
    isActive: formData.get("isActive") === "on",
    weight: Number(formData.get("weight") || 100),
    startAt: formData.get("startAt") ? new Date(String(formData.get("startAt"))) : null,
    endAt: formData.get("endAt") ? new Date(String(formData.get("endAt"))) : null,
  };
  await (prisma as any).promoPlacement.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/bonusuri-fara-depunere");
  revalidatePath("/rotiri-gratuite");
}

async function deletePromo(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY) throw new Error("ADMIN_KEY not set");
  if (String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  await (prisma as any).promoPlacement.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/bonusuri-fara-depunere");
  revalidatePath("/rotiri-gratuite");
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const keyParam = searchParams?.key;
  const offers = await prisma.offer.findMany({ include: { operator: true }, orderBy: [{ createdAt: "desc" }] });
  const promos = await (prisma as any).promoPlacement.findMany({ include: { offer: { include: { operator: true } } }, orderBy: [{ slot: "asc" }, { weight: "asc" }] });

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Promos</h1>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Create promo</h2>
          <form action={createPromo} className="mt-2 grid gap-2 md:grid-cols-2">
            <input type="hidden" name="key" defaultValue={keyParam} />
            <select className="rounded border px-3 py-2" name="offerId" required>
              <option value="">Alege ofertÃƒâ€žÃ†â€™</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.operator.name} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {o.title}
                </option>
              ))}
            </select>
            <select className="rounded border px-3 py-2" name="slot">
              <option>HOME_TOP</option>
              <option>HUB_FARA_DEP</option>
              <option>HUB_ROTIRI</option>
              <option>OPERATOR_TOP</option>
            </select>
            <input className="rounded border px-3 py-2" name="country" defaultValue="RO" />
            <input className="rounded border px-3 py-2" name="label" defaultValue="Sponsored" />
            <input className="rounded border px-3 py-2" name="weight" defaultValue="100" type="number" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked /> Activ</label>
            <input className="rounded border px-3 py-2" type="datetime-local" name="startAt" />
            <input className="rounded border px-3 py-2" type="datetime-local" name="endAt" />
            <button className="rounded border px-3 py-2 font-semibold md:col-span-2" type="submit">Create</button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Existing promos</h2>
          <div className="mt-2 grid gap-4">
            {promos.map((p: any) => (
              <div key={p.id} className="rounded border p-3">
                <div className="text-xs opacity-60">{p.slot} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {p.country}</div>
                <div className="font-semibold">{p.offer.operator.name} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {p.offer.title}</div>
                <form action={updatePromo} className="mt-2 grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="key" defaultValue={keyParam} />
                  <input type="hidden" name="id" defaultValue={p.id} />
                  <select className="rounded border px-3 py-2" name="offerId" defaultValue={p.offerId}>
                    {offers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.operator.name} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {o.title}
                      </option>
                    ))}
                  </select>
                  <select className="rounded border px-3 py-2" name="slot" defaultValue={p.slot}>
                    <option>HOME_TOP</option>
                    <option>HUB_FARA_DEP</option>
                    <option>HUB_ROTIRI</option>
                    <option>OPERATOR_TOP</option>
                  </select>
                  <input className="rounded border px-3 py-2" name="country" defaultValue={p.country} />
                  <input className="rounded border px-3 py-2" name="label" defaultValue={p.label ?? "Sponsored"} />
                  <input className="rounded border px-3 py-2" name="weight" defaultValue={String(p.weight)} type="number" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={p.isActive} /> Activ</label>
                  <input className="rounded border px-3 py-2" type="datetime-local" name="startAt" defaultValue={p.startAt ? new Date(p.startAt).toISOString().slice(0, 16) : ""} />
                  <input className="rounded border px-3 py-2" type="datetime-local" name="endAt" defaultValue={p.endAt ? new Date(p.endAt).toISOString().slice(0, 16) : ""} />
                  <div className="md:col-span-2 flex items-center gap-2">
                    <button className="rounded border px-3 py-2 font-semibold" type="submit">Save</button>
                    <form action={deletePromo}>
                      <input type="hidden" name="key" defaultValue={keyParam} />
                      <input type="hidden" name="id" defaultValue={p.id} />
                      <button className="rounded border px-3 py-2 text-red-600" type="submit">Delete</button>
                    </form>
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
