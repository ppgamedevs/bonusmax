import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'GDPR' });

export default function GDPRPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'GDPR', url: absoluteUrl('/gdpr') }
        ])}
      />
      <h1 className="text-2xl font-semibold">GDPR</h1>
      <p>Informații privind protecția datelor cu caracter personal vor fi publicate în curând.</p>
      <p>Vom explica scopurile prelucrării, temeiurile și drepturile tale.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
