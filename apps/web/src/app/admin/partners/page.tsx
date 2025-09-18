import { prisma } from "@bonusmax/lib";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function Guard({ children, keyParam }: { children: React.ReactNode; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold">401 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Unauthorized</h1>
      </main>
    );
  }
  return <>{children}</>;
}

async function moveLead(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  const stage = String(formData.get("stage")) as any;
  await (prisma as any).partnerLead.update({ where: { id }, data: { stage, lastTouchAt: new Date() } });
  revalidatePath("/admin/partners");
}

async function addNote(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  const body = String(formData.get("body") || "").trim();
  if (body) {
    await (prisma as any).partnerNote.create({ data: { leadId: id, body, author: "admin" } });
    await (prisma as any).partnerLead.update({ where: { id }, data: { lastTouchAt: new Date() } });
  }
  revalidatePath("/admin/partners");
}

async function createReservation(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const leadId = String(formData.get("id"));
  const slot = String(formData.get("slot")) as any;
  const startAt = new Date(String(formData.get("startAt")));
  const endAt = new Date(String(formData.get("endAt")));
  const quotedPrice = Number(String(formData.get("quotedPrice") || 0));
  await (prisma as any).slotReservation.create({ data: { leadId, slot, startAt, endAt, quotedPrice, status: "PENDING" } });
  revalidatePath("/admin/partners");
}

async function updateReservationStatus(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const id = String(formData.get("resId"));
  const status = String(formData.get("status"));
  await (prisma as any).slotReservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/partners");
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const keyParam = resolvedSearchParams.key;
  const leads = await (prisma as any).partnerLead.findMany({
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    include: { reservations: true, notes: { orderBy: { createdAt: "desc" }, take: 3 } },
    take: 200,
  });
  const stages: any[] = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
  const map = (st: string) => leads.filter((l: any) => l.stage === st);

  return (
    <Guard keyParam={keyParam}>
      <main className="container mx-auto px-3 py-8">
        <h1 className="text-2xl font-bold">Partners ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Pipeline</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {stages.map((st) => (
            <section key={st} className="rounded-xl border p-2">
              <h2 className="px-1 text-sm font-semibold">{st}</h2>
              <div className="mt-2 space-y-2">
                {map(st).map((l) => (
                  <div key={l.id} className="rounded border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{l.companyName}</div>
                      <form action={moveLead}>
                        <input type="hidden" name="key" defaultValue={keyParam} />
                        <input type="hidden" name="id" defaultValue={l.id} />
                        <select name="stage" defaultValue={l.stage} className="rounded border px-1 py-0.5 text-xs">
                          {stages.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button className="ml-1 rounded border px-2 py-0.5 text-xs">Move</button>
                      </form>
                    </div>
                    <div className="mt-1 opacity-80">
                      {l.email} {l.phone ? `ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${l.phone}` : ""}
                    </div>
                    <div className="mt-1">
                      Goal: {l.goal} ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ Budget: {l.monthlyBudget?.toLocaleString("ro-RO") ?? "-"} RON
                    </div>
                    <div className="mt-1">
                      Score: <span className="font-semibold">{l.score}</span>
                    </div>

                    {l.reservations.length > 0 && (
                      <div className="mt-2 rounded bg-neutral-50 p-2">
                        <div className="text-xs font-semibold">RezervÃƒâ€žÃ†â€™ri</div>
                        {[...l.reservations]
                          .sort((a: any, b: any) => {
                            const rank = (s: string) => (s === "APPROVED" ? 0 : s === "PENDING" ? 1 : 2);
                            return rank(a.status) - rank(b.status) || new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
                          })
                          .map((r) => (
                            <div key={r.id} className="text-xs flex items-center justify-between gap-2">
                              <div>
                                ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {r.slot} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â {new Date(r.startAt).toLocaleDateString("ro-RO")} ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ {new Date(r.endAt).toLocaleDateString("ro-RO")} (
                                {r.quotedPrice ? `${r.quotedPrice} RON` : "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"})
                              </div>
                              <form action={updateReservationStatus} className="flex items-center gap-1">
                                <input type="hidden" name="key" defaultValue={keyParam} />
                                <input type="hidden" name="resId" defaultValue={r.id} />
                                <select name="status" defaultValue={r.status} className="rounded border px-1 py-0.5">
                                  <option value="PENDING">PENDING</option>
                                  <option value="APPROVED">APPROVED</option>
                                  <option value="REJECTED">REJECTED</option>
                                </select>
                                <button className="rounded border px-2 py-0.5">Set</button>
                              </form>
                            </div>
                          ))}
                      </div>
                    )}

                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs opacity-70">Note</summary>
                      {l.notes.map((n) => (
                        <div key={n.id} className="mt-1 text-xs">
                          ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {new Date(n.createdAt).toLocaleString("ro-RO")}: {n.body}
                        </div>
                      ))}
                      <form action={addNote} className="mt-2 flex items-center gap-1">
                        <input type="hidden" name="key" defaultValue={keyParam} />
                        <input type="hidden" name="id" defaultValue={l.id} />
                        <input name="body" placeholder="AdaugÃƒâ€žÃ†â€™ notÃƒâ€žÃ†â€™..." className="w-full rounded border px-2 py-1 text-xs" />
                        <button className="rounded border px-2 py-1 text-xs">Add</button>
                      </form>
                    </details>

                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs opacity-70">RezervÃƒâ€žÃ†â€™ slot</summary>
                      <form action={createReservation} className="mt-1 grid gap-1 text-xs">
                        <input type="hidden" name="key" defaultValue={keyParam} />
                        <input type="hidden" name="id" defaultValue={l.id} />
                        <select name="slot" className="rounded border px-2 py-1">
                          <option>HOME_TOP</option>
                          <option>HUB_FARA_DEP</option>
                          <option>HUB_ROTIRI</option>
                          <option>OPERATOR_TOP</option>
                        </select>
                        <input type="date" name="startAt" className="rounded border px-2 py-1" required />
                        <input type="date" name="endAt" className="rounded border px-2 py-1" required />
                        <input type="number" name="quotedPrice" placeholder="PreÃƒË†Ã¢â‚¬Âº (RON)" className="rounded border px-2 py-1" />
                        <button className="rounded border px-2 py-1">Save</button>
                      </form>
                    </details>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </Guard>
  );
}
