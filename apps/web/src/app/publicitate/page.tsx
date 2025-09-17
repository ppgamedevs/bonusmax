import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "../../components/JsonLd";

export const metadata = { title: "Politica de publicitate" };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃ„Æ’", url: absoluteUrl("/") }, { name: "Politica de publicitate", url: absoluteUrl("/publicitate") }])} />
      <h1 className="text-2xl font-bold">Politica de publicitate</h1>
      <p className="mt-2 text-sm opacity-80">
        Bonusmax.ro publicÃ„Æ’ conÃˆâ€ºinut comercial. ÃƒÅ½n unele cazuri primim comisioane pentru ÃƒÂ®nscrieri realizate prin linkurile noastre marcate ca Publicitate/Sponsored.
        Operatorii promovaÃˆâ€ºi sunt licenÃˆâ€ºiaÃˆâ€ºi ÃƒÂ®n RomÃƒÂ¢nia. Clasamentele Ãˆâ„¢i recomandÃ„Æ’rile indicÃ„Æ’ opinia noastrÃ„Æ’ editorialÃ„Æ’ Ãˆâ„¢i pot Ãˆâ€ºine cont de parteneriatele comerciale.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Metodologie</h2>
      <ul className="mt-2 list-disc pl-6 text-sm">
        <li>EvaluÃ„Æ’m ofertele ÃƒÂ®n funcÃˆâ€ºie de valoare, termeni (WR, min. depozit, plafon retragere), Ãˆâ„¢i experienÃˆâ€ºa utilizatorului.</li>
        <li>ActualizÃ„Æ’m conÃˆâ€ºinutul Ãˆâ„¢i verificÃ„Æ’m periodic termenele Ãˆâ„¢i condiÃˆâ€ºiile.</li>
        <li>MarcÃ„Æ’m Ã¢â‚¬Å¾SponsoredÃ¢â‚¬Â cÃƒÂ¢nd poziÃˆâ€ºionarea este influenÃˆâ€ºatÃ„Æ’ comercial.</li>
      </ul>
      <p className="mt-6 text-xs opacity-70">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
    </main>
  );
}
