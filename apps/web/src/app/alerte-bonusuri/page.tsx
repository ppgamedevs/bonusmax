export const dynamic = 'force-dynamic';
export const revalidate = 60;
import EmailCaptureForm from '@/components/EmailCaptureForm';
import { absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = { title: 'Alerte bonusuri (email)' } as any;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams: Record<string, string | undefined> = searchParams
    ? await searchParams
    : {};
  const status = resolvedSearchParams.status;
  return (
    <main className="container mx-auto px-4 py-8">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'Alerte bonusuri', url: absoluteUrl('/alerte-bonusuri') },
        ])}
      />
      <h1 className="text-2xl font-bold">Alerte bonusuri pe email</h1>
      <p className="mt-2 text-sm opacity-80">
        Primești o dată pe săptămână top bonusuri noi și oferte limitate. Confirmă abonarea din
        emailul pe care ți-l trimitem.
      </p>
      <EmailCaptureForm />
      {status === 'confirmed' && (
        <p className="mt-4 text-emerald-600">Mulțumim! Abonarea a fost confirmată.</p>
      )}
      {status === 'unsubscribed' && (
        <p className="mt-4 text-amber-600">Ai fost dezabonat. Poți reveni oricând.</p>
      )}
      <p className="mt-6 text-xs opacity-60">
        Prin abonare, ești de acord cu politicile noastre și că acesta este conținut comercial. 18+
        Joacă responsabil.
      </p>
    </main>
  );
}
