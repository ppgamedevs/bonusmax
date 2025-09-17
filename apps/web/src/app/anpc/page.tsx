import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'ANPC' });

export default function ANPCPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃƒâ€žÃ†â€™', url: absoluteUrl('/') },
          { name: 'ANPC', url: absoluteUrl('/anpc') }
        ])}
      />
      <h1 className="text-2xl font-semibold">ANPC</h1>
      <p>InformaÃƒË†Ã¢â‚¬Âºii privind Autoritatea NaÃƒË†Ã¢â‚¬ÂºionalÃƒâ€žÃ†â€™ pentru ProtecÃƒË†Ã¢â‚¬Âºia Consumatorilor.</p>
      <p>Linkuri utile ÃƒË†Ã¢â€žÂ¢i proceduri vor fi adÃƒâ€žÃ†â€™ugate aici.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
