import { prisma } from "@bonusmax/lib";

export const revalidate = 3600;
export const metadata = { title: "Operatori licenÃƒË†Ã¢â‚¬ÂºiaÃƒË†Ã¢â‚¬Âºi ONJN ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Index" };

export default async function Page() {
  const ops = await (prisma as any).operator.findMany({ where: { isLicensedRO: true }, orderBy: [{ name: "asc" }] });
  const csv = [
    "name,website,onjnLicenseId,onjnLicenseExpiry",
    ...ops.map(
      (o: any) =>
        [
          o.name,
          o.website || "",
          o.onjnLicenseId || "",
          o.onjnLicenseExpiry ? new Date(o.onjnLicenseExpiry).toISOString().slice(0, 10) : "",
        ].join(",")
    ),
  ].join("\n");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Operatori licenÃƒË†Ã¢â‚¬ÂºiaÃƒË†Ã¢â‚¬Âºi ONJN ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Index</h1>
      <p className="mt-2 text-sm opacity-80">ListÃƒâ€žÃ†â€™ informativÃƒâ€žÃ†â€™ bazatÃƒâ€žÃ†â€™ pe datele noastre. VerificÃƒâ€žÃ†â€™ ÃƒÆ’Ã‚Â®ntotdeauna site-ul ONJN pentru actualizÃƒâ€žÃ†â€™ri. 18+ JoacÃƒâ€žÃ†â€™ responsabil.</p>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Operator</th>
            <th className="p-2">Website</th>
            <th className="p-2">LicenÃƒË†Ã¢â‚¬ÂºÃƒâ€žÃ†â€™</th>
            <th className="p-2">ExpirÃƒâ€žÃ†â€™</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((o: any) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.name}</td>
              <td className="p-2">{o.website ? <a className="underline" href={o.website} rel="nofollow">site</a> : "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"}</td>
              <td className="p-2">{o.onjnLicenseId || "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"}</td>
              <td className="p-2">{o.onjnLicenseExpiry ? new Date(o.onjnLicenseExpiry).toLocaleDateString("ro-RO") : "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form method="post" action={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}>
        <button className="mt-4 rounded border px-3 py-2">DescarcÃƒâ€žÃ†â€™ CSV</button>
      </form>
    </main>
  );
}
