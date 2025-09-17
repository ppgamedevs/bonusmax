import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = { title: "Politica de publicitate" };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃƒâ€žÃ†â€™", url: absoluteUrl("/") }, { name: "Politica de publicitate", url: absoluteUrl("/publicitate") }])} />
      <h1 className="text-2xl font-bold">Politica de publicitate</h1>
      <p className="mt-2 text-sm opacity-80">
        Bonusmax.ro publicÃƒâ€žÃ†â€™ conÃƒË†Ã¢â‚¬Âºinut comercial. ÃƒÆ’Ã…Â½n unele cazuri primim comisioane pentru ÃƒÆ’Ã‚Â®nscrieri realizate prin linkurile noastre marcate ca Publicitate/Sponsored.
        Operatorii promovaÃƒË†Ã¢â‚¬Âºi sunt licenÃƒË†Ã¢â‚¬ÂºiaÃƒË†Ã¢â‚¬Âºi ÃƒÆ’Ã‚Â®n RomÃƒÆ’Ã‚Â¢nia. Clasamentele ÃƒË†Ã¢â€žÂ¢i recomandÃƒâ€žÃ†â€™rile indicÃƒâ€žÃ†â€™ opinia noastrÃƒâ€žÃ†â€™ editorialÃƒâ€žÃ†â€™ ÃƒË†Ã¢â€žÂ¢i pot ÃƒË†Ã¢â‚¬Âºine cont de parteneriatele comerciale.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Metodologie</h2>
      <ul className="mt-2 list-disc pl-6 text-sm">
        <li>EvaluÃƒâ€žÃ†â€™m ofertele ÃƒÆ’Ã‚Â®n funcÃƒË†Ã¢â‚¬Âºie de valoare, termeni (WR, min. depozit, plafon retragere), ÃƒË†Ã¢â€žÂ¢i experienÃƒË†Ã¢â‚¬Âºa utilizatorului.</li>
        <li>ActualizÃƒâ€žÃ†â€™m conÃƒË†Ã¢â‚¬Âºinutul ÃƒË†Ã¢â€žÂ¢i verificÃƒâ€žÃ†â€™m periodic termenele ÃƒË†Ã¢â€žÂ¢i condiÃƒË†Ã¢â‚¬Âºiile.</li>
        <li>MarcÃƒâ€žÃ†â€™m ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾SponsoredÃƒÂ¢Ã¢â€šÂ¬Ã‚Â cÃƒÆ’Ã‚Â¢nd poziÃƒË†Ã¢â‚¬Âºionarea este influenÃƒË†Ã¢â‚¬ÂºatÃƒâ€žÃ†â€™ comercial.</li>
      </ul>
      <p className="mt-6 text-xs opacity-70">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
    </main>
  );
}
