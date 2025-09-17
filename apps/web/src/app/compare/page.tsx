import { prisma } from "@bonusmax/lib";
import Link from "next/link";
import PopulateFromLocal from "./populate-from-local";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const ids = (searchParams?.ids ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">ComparaÃƒË†Ã¢â‚¬Âºie</h1>
        <p className="mt-2 text-sm opacity-80">SelecteazÃƒâ€žÃ†â€™ oferte cu butonul ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ComparaÃƒÂ¢Ã¢â€šÂ¬Ã‚Â.</p>
        <Link className="mt-4 inline-block text-sm underline" href="/">ÃƒÆ’Ã…Â½napoi la homepage</Link>
        <PopulateFromLocal />
      </main>
    );
  }
  const offers = await prisma.offer.findMany({
    where: { id: { in: ids }, operator: { isLicensedRO: true } },
    include: { operator: true }
  });
  // If some IDs were filtered out, continue with what we have
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">ComparaÃƒË†Ã¢â‚¬Âºie oferte</h1>
      <div className="mt-2 flex items-center justify-between">
        <a href="#main" className="text-sm underline">ÃƒÆ’Ã…Â½napoi sus</Link>
        <Link href="/" className="text-sm underline">ÃƒÆ’Ã…Â½napoi la homepage</Link>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white p-2 text-left dark:bg-neutral-900">Criteriu</th>
              {offers.map((o) => (
                <th key={o.id} className="p-2 text-left">
                  {o.operator.name}
                  <br />
                  <a className="underline" href={`/bonus/${o.id}`}>
                    {o.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">Tip</td>
              {offers.map((o: any) => (
                <td key={o.id} className="p-2">
                  {o.offerType}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">WR</td>
              {offers.map((o: any) => (
                <td key={o.id} className="p-2">
                  {o.wrMultiplier ?? "-"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">Min Dep (RON)</td>
              {offers.map((o: any) => (
                <td key={o.id} className="p-2">
                  {o.minDeposit ?? "-"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">Max cashout (RON)</td>
              {offers.map((o: any) => (
                <td key={o.id} className="p-2">
                  {o.maxCashout ?? "-"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">T&C scurt</td>
              {offers.map((o) => (
                <td key={o.id} className="p-2">
                  {o.termsShort}
                </td>
              ))}
            </tr>
            <tr>
              <td className="sticky left-0 z-10 bg-white p-2 font-medium dark:bg-neutral-900">CTA</td>
              {offers.map((o) => (
                <td key={o.id} className="p-2">
                  <a className="rounded border px-3 py-1" href={`/go/${o.id}`} rel="nofollow sponsored">
                    RevendicÃƒâ€žÃ†â€™
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
