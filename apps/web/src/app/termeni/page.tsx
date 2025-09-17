import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'Termeni Ãˆâ„¢i CondiÃˆâ€ºii' });

export default function TermeniPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃ„Æ’', url: absoluteUrl('/') },
          { name: 'Termeni Ãˆâ„¢i CondiÃˆâ€ºii', url: absoluteUrl('/termeni') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Termeni Ãˆâ„¢i CondiÃˆâ€ºii</h1>
      <p>Acesta este un rezumat al termenilor Ãˆâ„¢i condiÃˆâ€ºiilor. Versiunea completÃ„Æ’ va fi disponibilÃ„Æ’ curÃƒÂ¢nd.</p>
      <p>Te rugÃ„Æ’m sÃ„Æ’ verifici periodic aceastÃ„Æ’ paginÃ„Æ’ pentru actualizÃ„Æ’ri.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
