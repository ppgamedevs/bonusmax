import Link from 'next/link';

export const metadata = { title: 'Compară oferte' };

export default function Page() {
  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Compară oferte</h1>

      <div className="mt-2 flex items-center justify-between">
        <a href="#main" className="text-sm underline">Înapoi sus</a>
        <Link href="/" className="text-sm underline">Acasă</Link>
      </div>
    </main>
  );
}