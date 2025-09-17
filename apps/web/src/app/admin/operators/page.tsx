import { prisma } from "@bonusmax/lib";
import { createOperator, updateOperator, deleteOperator } from "../actions";
import Link from "next/link";

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

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (await searchParams) || ({} as Record<string, string>);
  const keyParam = sp.key;
  const operators = await prisma.operator.findMany({ orderBy: { name: "asc" } });

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Admin ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Operators</h1>
        <p className="mt-2 text-sm">
          <Link href={("/admin/offers?key=" + encodeURIComponent(keyParam ?? "")) as any} className="underline">
            ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ Manage Offers
          </Link>
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Create</h2>
          <form action={createOperator} className="mt-2 grid gap-2 md:grid-cols-2">
            <input type="hidden" name="key" defaultValue={keyParam} />
            <input className="rounded border px-3 py-2" name="slug" placeholder="slug (ex: betano)" required />
            <input className="rounded border px-3 py-2" name="name" placeholder="name" required />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isLicensedRO" /> LicenÃƒË†Ã¢â‚¬Âºiat RO</label>
            <input className="rounded border px-3 py-2" name="logoUrl" placeholder="logoUrl (https://...)" />
            <input className="rounded border px-3 py-2" name="website" placeholder="website (https://...)" />
            <input className="rounded border px-3 py-2" name="rating" placeholder="rating 0..5" />
            <input className="rounded border px-3 py-2 md:col-span-2" name="pros" placeholder="pros separate cu |" />
            <input className="rounded border px-3 py-2 md:col-span-2" name="cons" placeholder="cons separate cu |" />
            <button className="rounded border px-3 py-2 font-semibold md:col-span-2" type="submit">Create</button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Existing</h2>
          <div className="mt-2 grid gap-4">
            {operators.map((op) => (
              <div key={op.id} className="rounded border p-3">
                <div className="text-sm opacity-70">{op.slug}</div>
                <div className="font-semibold">{op.name}</div>
                <form action={updateOperator} className="mt-2 grid gap-2 md:grid-cols-2">
                  <input type="hidden" name="key" defaultValue={keyParam} />
                  <input type="hidden" name="id" defaultValue={op.id} />
                  <input className="rounded border px-3 py-2" name="slug" defaultValue={op.slug} />
                  <input className="rounded border px-3 py-2" name="name" defaultValue={op.name} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isLicensedRO" defaultChecked={op.isLicensedRO} /> LicenÃƒË†Ã¢â‚¬Âºiat RO
                  </label>
                  <input className="rounded border px-3 py-2" name="logoUrl" defaultValue={op.logoUrl ?? ""} />
                  <input className="rounded border px-3 py-2" name="website" defaultValue={op.website ?? ""} />
                  <input className="rounded border px-3 py-2" name="rating" defaultValue={String(op.rating ?? 0)} />
                  <input className="rounded border px-3 py-2 md:col-span-2" name="pros" defaultValue={(op.pros ?? []).join("|")} />
                  <input className="rounded border px-3 py-2 md:col-span-2" name="cons" defaultValue={(op.cons ?? []).join("|")} />
                  <div className="flex items-center gap-2 md:col-span-2">
                    <button className="rounded border px-3 py-2 font-semibold" type="submit">Save</button>
                    <form action={deleteOperator} className="inline">
                      <input type="hidden" name="key" defaultValue={keyParam} />
                      <input type="hidden" name="id" defaultValue={op.id} />
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
