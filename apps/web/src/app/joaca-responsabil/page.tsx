export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = { title: 'Joacă responsabil' };

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'Joacă responsabil', url: absoluteUrl('/joaca-responsabil') },
        ])}
      />
      <h1 className="text-2xl font-bold">Joacă responsabil</h1>
      <p className="mt-2 text-sm opacity-80">
        Jocurile de noroc implică riscuri financiare și emoționale. Joacă doar dacă ai peste 18 ani.
        Stabilește-ți limite, nu urmări pierderile și ia pauze regulate.
      </p>
      <ul className="mt-4 list-disc pl-6 text-sm">
        <li>Setează limite de depozit și timp de joc.</li>
        <li>Nu juca pentru a recupera pierderile.</li>
        <li>Nu împrumuta bani pentru jocuri de noroc.</li>
        <li>Caută ajutor dacă simți că pierzi controlul (consiliere de specialitate).</li>
      </ul>
      <p className="mt-4 text-sm">
        În caz de nevoie, caută servicii de consiliere și programe de auto-excludere oferite de
        operatorii licențiați.
      </p>
      <p className="mt-6 text-xs opacity-70">
        Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
      </p>
    </main>
  );
}
