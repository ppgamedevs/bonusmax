import { prisma } from "@bonusmax/lib";

export const dynamic = "force-dynamic";
function Guard({ children, keyParam }: { children: any; keyParam?: string }) {
  if (!process.env.ADMIN_KEY || keyParam !== process.env.ADMIN_KEY) return <main className="p-8">401</main>;
  return <>{children}</>;
}

async function createIssue(formData: FormData) {
  "use server";
  if (!process.env.ADMIN_KEY || String(formData.get("key")) !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
  const subject = String(formData.get("subject") || "NoutÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºi Bonusmax ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â sÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ptÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢na aceasta");
  const ids = String(formData.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const items = await (prisma as any).feedItem.findMany({ where: { id: { in: ids } }, orderBy: { publishedAt: "desc" } });
  const num = ((await (prisma as any).newsletterIssue.count()) as number) + 1;
  const html = `
  <div style="font-family:Arial,sans-serif">
    <h1>${subject}</h1>
    <p style="font-size:12px;opacity:.7">18+ JoacÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ responsabil ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ConÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºinut comercial marcat</p>
    <ul>
      ${items
        .map(
          (i: any) =>
            `<li><a href="${i.url}" target="_blank" rel="nofollow noopener">${i.title}</a> ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â <span style="opacity:.7">${i.excerpt || ""}</span></li>`
        )
        .join("")}
    </ul>
    <p style="font-size:12px;opacity:.7">Te poÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºi dezabona oricÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢nd.</p>
  </div>`;
  const issue = await (prisma as any).newsletterIssue.create({ data: { number: num, subject, html } });
  await (prisma as any).newsletterIssueItem.createMany({
    data: items.map((i: any, idx: number) => ({ issueId: issue.id, feedItemId: i.id, order: idx })),
  });
}

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const key = resolvedSearchParams.key;
  const last7 = await (prisma as any).feedItem.findMany({
    where: { status: "APPROVED", publishedAt: { gte: new Date(Date.now() - 7 * 864e5) } },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 50,
  });
  const issues = await (prisma as any).newsletterIssue.findMany({ orderBy: { createdAt: "desc" }, take: 10 });

  return (
    <Guard keyParam={key}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Newsletter ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Compose</h1>
        <form action={createIssue} className="mt-3 flex flex-wrap items-end gap-2">
          <input type="hidden" name="key" defaultValue={key} />
          <label className="text-sm">
            Subiect
            <input name="subject" className="ml-2 rounded border px-2 py-1" defaultValue="NoutÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºi Bonusmax ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â sÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ptÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢na aceasta" />
          </label>
          <label className="text-sm">
            Item IDs (virgule)
            <input name="ids" className="ml-2 w-[420px] rounded border px-2 py-1" placeholder={(last7 as any[]).map((i: any) => i.id).slice(0, 6).join(",")} />
          </label>
          <button className="rounded border px-3 py-1">GenereazÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢</button>
        </form>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">Ultimele 7 zile</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Titlu</th>
                <th className="p-2">Data</th>
                <th className="p-2">ID</th>
              </tr>
            </thead>
            <tbody>
              {(last7 as any[]).map((i: any) => (
                <tr key={i.id} className="border-t">
                  <td className="p-2">{i.title}</td>
                  <td className="p-2">{i.publishedAt ? new Date(i.publishedAt).toLocaleDateString("ro-RO") : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}</td>
                  <td className="p-2">{i.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Issues</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {(issues as any[]).map((i: any) => (
              <li key={i.id}>
                <a className="underline" href={`/api/admin/newsletter/issues/${i.id}/export?key=${key}`} target="_blank">
                  Export HTML
                </a>{" "}
                ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â #{i.number} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {i.subject}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Guard>
  );
}
