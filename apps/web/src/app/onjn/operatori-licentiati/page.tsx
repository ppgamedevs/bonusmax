import { prisma } from "@bonusmax/lib";

export const revalidate = 3600;
export const metadata = { title: "Operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN Ã¢â‚¬â€ Index" };

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
      <h1 className="text-2xl font-bold">Operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN Ã¢â‚¬â€ Index</h1>
      <p className="mt-2 text-sm opacity-80">ListÃ„Æ’ informativÃ„Æ’ bazatÃ„Æ’ pe datele noastre. VerificÃ„Æ’ ÃƒÂ®ntotdeauna site-ul ONJN pentru actualizÃ„Æ’ri. 18+ JoacÃ„Æ’ responsabil.</p>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Operator</th>
            <th className="p-2">Website</th>
            <th className="p-2">LicenÃˆâ€ºÃ„Æ’</th>
            <th className="p-2">ExpirÃ„Æ’</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((o: any) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.name}</td>
              <td className="p-2">{o.website ? <a className="underline" href={o.website} rel="nofollow">site</a> : "Ã¢â‚¬â€"}</td>
              <td className="p-2">{o.onjnLicenseId || "Ã¢â‚¬â€"}</td>
              <td className="p-2">{o.onjnLicenseExpiry ? new Date(o.onjnLicenseExpiry).toLocaleDateString("ro-RO") : "Ã¢â‚¬â€"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form method="post" action={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}>
        <button className="mt-4 rounded border px-3 py-2">DescarcÃ„Æ’ CSV</button>
      </form>
    </main>
  );
}
