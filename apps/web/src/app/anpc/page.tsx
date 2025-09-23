export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'ANPC' });

export default function ANPCPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          {
            name: 'AcasÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢',
            url: absoluteUrl('/'),
          },
          { name: 'ANPC', url: absoluteUrl('/anpc') },
        ])}
      />
      <h1 className="text-2xl font-semibold">ANPC</h1>
      <p>
        InformaÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºii privind Autoritatea
        NaÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂºionalÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢
        pentru ProtecÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Âºia Consumatorilor.
      </p>
      <p>
        Linkuri utile ÃƒÆ’Ã†â€™Ãƒâ€¹Ã¢â‚¬Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢i proceduri vor fi
        adÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ugate aici.
      </p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
