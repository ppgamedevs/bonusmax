import EmailCaptureForm from "@/components/EmailCaptureForm";
import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = { title: "Alerte bonusuri (email)" } as any;

export default function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const status = searchParams?.status;
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃƒâ€žÃ†â€™", url: absoluteUrl("/") }, { name: "Alerte bonusuri", url: absoluteUrl("/alerte-bonusuri") }])} />
      <h1 className="text-2xl font-bold">Alerte bonusuri pe email</h1>
      <p className="mt-2 text-sm opacity-80">PrimeÃƒË†Ã¢â€žÂ¢ti o datÃƒâ€žÃ†â€™ pe sÃƒâ€žÃ†â€™ptÃƒâ€žÃ†â€™mÃƒÆ’Ã‚Â¢nÃƒâ€žÃ†â€™ top bonusuri noi ÃƒË†Ã¢â€žÂ¢i oferte limitate. ConfirmÃƒâ€žÃ†â€™ adresa pentru a activa alertele.</p>
      <EmailCaptureForm />
      {status === "confirmed" && <p className="mt-4 text-emerald-600">MulÃƒË†Ã¢â‚¬Âºumim! Abonarea a fost confirmatÃƒâ€žÃ†â€™.</p>}
      {status === "unsubscribed" && <p className="mt-4 text-amber-600">Ai fost dezabonat. PoÃƒË†Ã¢â‚¬Âºi reveni oricÃƒÆ’Ã‚Â¢nd.</p>}
      <p className="mt-6 text-xs opacity-60">Prin abonare, eÃƒË†Ã¢â€žÂ¢ti de acord cu politicile noastre ÃƒË†Ã¢â€žÂ¢i cÃƒâ€žÃ†â€™ acesta este conÃƒË†Ã¢â‚¬Âºinut comercial. 18+ JoacÃƒâ€žÃ†â€™ responsabil.</p>
    </main>
  );
}
