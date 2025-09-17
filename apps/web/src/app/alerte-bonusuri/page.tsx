import EmailCaptureForm from "../../components/EmailCaptureForm";
import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "../../components/JsonLd";

export const metadata = { title: "Alerte bonusuri (email)" } as any;

export default function Page({ searchParams }: { searchParams?: Record<string, string> }) {
  const status = searchParams?.status;
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃ„Æ’", url: absoluteUrl("/") }, { name: "Alerte bonusuri", url: absoluteUrl("/alerte-bonusuri") }])} />
      <h1 className="text-2xl font-bold">Alerte bonusuri pe email</h1>
      <p className="mt-2 text-sm opacity-80">PrimeÃˆâ„¢ti o datÃ„Æ’ pe sÃ„Æ’ptÃ„Æ’mÃƒÂ¢nÃ„Æ’ top bonusuri noi Ãˆâ„¢i oferte limitate. ConfirmÃ„Æ’ adresa pentru a activa alertele.</p>
      <EmailCaptureForm />
      {status === "confirmed" && <p className="mt-4 text-emerald-600">MulÃˆâ€ºumim! Abonarea a fost confirmatÃ„Æ’.</p>}
      {status === "unsubscribed" && <p className="mt-4 text-amber-600">Ai fost dezabonat. PoÃˆâ€ºi reveni oricÃƒÂ¢nd.</p>}
      <p className="mt-6 text-xs opacity-60">Prin abonare, eÃˆâ„¢ti de acord cu politicile noastre Ãˆâ„¢i cÃ„Æ’ acesta este conÃˆâ€ºinut comercial. 18+ JoacÃ„Æ’ responsabil.</p>
    </main>
  );
}
