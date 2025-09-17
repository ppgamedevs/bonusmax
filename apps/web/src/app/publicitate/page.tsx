import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "../../components/JsonLd";

export const metadata = { title: "Politica de publicitate" };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "Acasă", url: absoluteUrl("/") }, { name: "Politica de publicitate", url: absoluteUrl("/publicitate") }])} />
      <h1 className="text-2xl font-bold">Politica de publicitate</h1>
      <p className="mt-2 text-sm opacity-80">
        Bonusmax.ro publică conținut comercial. În unele cazuri primim comisioane pentru înscrieri realizate prin linkurile noastre marcate ca Publicitate/Sponsored.
        Operatorii promovați sunt licențiați în România. Clasamentele și recomandările indică opinia noastră editorială și pot ține cont de parteneriatele comerciale.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Metodologie</h2>
      <ul className="mt-2 list-disc pl-6 text-sm">
        <li>Evaluăm ofertele în funcție de valoare, termeni (WR, min. depozit, plafon retragere), și experiența utilizatorului.</li>
        <li>Actualizăm conținutul și verificăm periodic termenele și condițiile.</li>
        <li>Marcăm „Sponsored” când poziționarea este influențată comercial.</li>
      </ul>
      <p className="mt-6 text-xs opacity-70">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
    </main>
  );
}
