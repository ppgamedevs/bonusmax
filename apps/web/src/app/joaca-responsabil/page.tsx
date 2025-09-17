import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = { title: "JoacÃ„Æ’ responsabil" };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃ„Æ’", url: absoluteUrl("/") }, { name: "JoacÃ„Æ’ responsabil", url: absoluteUrl("/joaca-responsabil") }])} />
      <h1 className="text-2xl font-bold">JoacÃ„Æ’ responsabil</h1>
      <p className="mt-2 text-sm opacity-80">
        Jocurile de noroc implicÃ„Æ’ riscuri financiare Ãˆâ„¢i emoÃˆâ€ºionale. JoacÃ„Æ’ doar dacÃ„Æ’ ai peste 18 ani. StabileÃˆâ„¢te-Ãˆâ€ºi limite, nu urmÃ„Æ’ri pierderile, Ãˆâ„¢i ia pauze regulate.
      </p>
      <ul className="mt-4 list-disc pl-6 text-sm">
        <li>SeteazÃ„Æ’ limite de depozit Ãˆâ„¢i timp de joc.</li>
        <li>Nu juca pentru a recupera pierderile.</li>
        <li>Nu ÃƒÂ®mprumuta bani pentru jocuri de noroc.</li>
        <li>CautÃ„Æ’ ajutor dacÃ„Æ’ simÃˆâ€ºi cÃ„Æ’ pierzi controlul (consiliere de specialitate).</li>
      </ul>
      <p className="mt-4 text-sm">
        ÃƒÅ½n caz de nevoie, cautÃ„Æ’ servicii de consiliere Ãˆâ„¢i programe de auto-excludere oferite de operatorii licenÃˆâ€ºiaÃˆâ€ºi.
      </p>
      <p className="mt-6 text-xs opacity-70">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
    </main>
  );
}
