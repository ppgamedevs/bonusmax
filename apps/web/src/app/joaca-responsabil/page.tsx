import { absoluteUrl, jsonLdBreadcrumb } from "@bonusmax/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata = { title: "JoacÃƒâ€žÃ†â€™ responsabil" };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLdBreadcrumb([{ name: "AcasÃƒâ€žÃ†â€™", url: absoluteUrl("/") }, { name: "JoacÃƒâ€žÃ†â€™ responsabil", url: absoluteUrl("/joaca-responsabil") }])} />
      <h1 className="text-2xl font-bold">JoacÃƒâ€žÃ†â€™ responsabil</h1>
      <p className="mt-2 text-sm opacity-80">
        Jocurile de noroc implicÃƒâ€žÃ†â€™ riscuri financiare ÃƒË†Ã¢â€žÂ¢i emoÃƒË†Ã¢â‚¬Âºionale. JoacÃƒâ€žÃ†â€™ doar dacÃƒâ€žÃ†â€™ ai peste 18 ani. StabileÃƒË†Ã¢â€žÂ¢te-ÃƒË†Ã¢â‚¬Âºi limite, nu urmÃƒâ€žÃ†â€™ri pierderile, ÃƒË†Ã¢â€žÂ¢i ia pauze regulate.
      </p>
      <ul className="mt-4 list-disc pl-6 text-sm">
        <li>SeteazÃƒâ€žÃ†â€™ limite de depozit ÃƒË†Ã¢â€žÂ¢i timp de joc.</li>
        <li>Nu juca pentru a recupera pierderile.</li>
        <li>Nu ÃƒÆ’Ã‚Â®mprumuta bani pentru jocuri de noroc.</li>
        <li>CautÃƒâ€žÃ†â€™ ajutor dacÃƒâ€žÃ†â€™ simÃƒË†Ã¢â‚¬Âºi cÃƒâ€žÃ†â€™ pierzi controlul (consiliere de specialitate).</li>
      </ul>
      <p className="mt-4 text-sm">
        ÃƒÆ’Ã…Â½n caz de nevoie, cautÃƒâ€žÃ†â€™ servicii de consiliere ÃƒË†Ã¢â€žÂ¢i programe de auto-excludere oferite de operatorii licenÃƒË†Ã¢â‚¬ÂºiaÃƒË†Ã¢â‚¬Âºi.
      </p>
      <p className="mt-6 text-xs opacity-70">Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</p>
    </main>
  );
}
