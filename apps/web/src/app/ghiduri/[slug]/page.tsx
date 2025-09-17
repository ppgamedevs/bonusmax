import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'GDPR' });

export default function GDPRPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃ„Æ’', url: absoluteUrl('/') },
          { name: 'GDPR', url: absoluteUrl('/gdpr') }
        ])}
      />
      <h1 className="text-2xl font-semibold">GDPR</h1>
      <p>InformaÃˆâ€ºii privind protecÃˆâ€ºia datelor cu caracter personal vor fi publicate ÃƒÂ®n curÃƒÂ¢nd.</p>
      <p>Vom explica scopurile prelucrÃ„Æ’rii, temeiurile Ãˆâ„¢i drepturile tale.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
