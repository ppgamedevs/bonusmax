import EmailCaptureForm from "@/components/EmailCaptureForm";
import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = { title: "Alerte bonusuri (email)" } as any;

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const resolvedSearchParams: Record<string, string | undefined> = searchParams ? await searchParams : {};
  const status = resolvedSearchParams.status;
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢", url: absoluteUrl("/") }, { name: "Alerte bonusuri", url: absoluteUrl("/alerte-bonusuri") }])} />
      <h1 className="text-2xl font-bold">Alerte bonusuri pe email</h1>
      <p className="mt-2 text-sm opacity-80">PrimeÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ti o datÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ pe sÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ptÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢mÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ top bonusuri noi ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i oferte limitate. ConfirmÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ adresa pentru a activa alertele.</p>
      <EmailCaptureForm />
      {status === "confirmed" && <p className="mt-4 text-emerald-600">MulÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºumim! Abonarea a fost confirmatÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢.</p>}
      {status === "unsubscribed" && <p className="mt-4 text-amber-600">Ai fost dezabonat. PoÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi reveni oricÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢nd.</p>}
      <p className="mt-6 text-xs opacity-60">Prin abonare, eÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ti de acord cu politicile noastre ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i cÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ acesta este conÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºinut comercial. 18+ JoacÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ responsabil.</p>
    </main>
  );
}
