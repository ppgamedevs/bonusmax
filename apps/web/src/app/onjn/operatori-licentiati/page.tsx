export const dynamic = "force-dynamic";
import { prisma } from "@bonusmax/lib";

export const revalidate = 3600;
export const metadata = { title: "Operatori licenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºiaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi ONJN ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Index" };

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
      <h1 className="text-2xl font-bold">Operatori licenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºiaÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi ONJN ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Index</h1>
      <p className="mt-2 text-sm opacity-80">ListÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ informativÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ bazatÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ pe datele noastre. VerificÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®ntotdeauna site-ul ONJN pentru actualizÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ri. 18+ JoacÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ responsabil.</p>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Operator</th>
            <th className="p-2">Website</th>
            <th className="p-2">LicenÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
            <th className="p-2">ExpirÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((o: any) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.name}</td>
              <td className="p-2">{o.website ? <a className="underline" href={o.website} rel="nofollow">site</a> : "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}</td>
              <td className="p-2">{o.onjnLicenseId || "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}</td>
              <td className="p-2">{o.onjnLicenseExpiry ? new Date(o.onjnLicenseExpiry).toLocaleDateString("ro-RO") : "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form method="post" action={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}>
        <button className="mt-4 rounded border px-3 py-2">DescarcÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ CSV</button>
      </form>
    </main>
  );
}
