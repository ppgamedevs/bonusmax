import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'ANPC' });

export default function ANPCPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'ANPC', url: absoluteUrl('/anpc') }
        ])}
      />
      <h1 className="text-2xl font-semibold">ANPC</h1>
      <p>Informații privind Autoritatea Națională pentru Protecția Consumatorilor.</p>
      <p>Linkuri utile și proceduri vor fi adăugate aici.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
