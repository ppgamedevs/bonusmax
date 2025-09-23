export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';
import BackHome from '@/components/BackHome';

export const metadata = defaultMetadata({ title: 'GDPR' });

export default function GDPRPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'GDPR', url: absoluteUrl('/gdpr') },
        ])}
      />

      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Protecția datelor • GDPR
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">GDPR</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Informații privind protecția datelor cu caracter personal. Mai jos găsești un rezumat
          clar despre scopurile prelucrării, temeiurile legale și drepturile tale.
        </p>
        <div className="mt-2 text-xs text-zinc-400">Ultima actualizare: {lastUpdated}</div>
      </header>

      <BackHome />

      <section className="prose prose-invert mt-6 max-w-none">
        <h2>Ce publicăm aici</h2>
        <p>
          Publicăm pe scurt informațiile esențiale despre modul în care prelucrăm datele tale,
          inclusiv categoriile de date, scopurile, temeiurile legale și perioadele de păstrare.
        </p>
        <h2>Drepturile tale</h2>
        <ul>
          <li>Acces, rectificare, ștergere, restricționare, opoziție și portabilitate.</li>
          <li>
            Ne poți contacta în orice moment la <a href="mailto:contact@bonusmax.ro">contact@bonusmax.ro</a>.
          </li>
        </ul>
        <p>
          Pentru informații detaliate, consultă și <a href="/politica-confidentialitate">Politica de
          confidențialitate</a>.
        </p>
      </section>
    </main>
  );
}
