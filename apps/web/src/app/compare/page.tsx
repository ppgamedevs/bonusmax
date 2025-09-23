export const dynamic = 'force-dynamic';
export const revalidate = 60;
import Link from 'next/link';

export const metadata = { title: 'ComparÃƒâ€žÃ†â€™ oferte' };

export default function Page() {
  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">ComparÃƒâ€žÃ†â€™ oferte</h1>

      <div className="mt-2 flex items-center justify-between">
        <a href="#main" className="text-sm underline">
          ÃƒÆ’Ã…Â½napoi sus
        </a>
        <Link href="/" className="text-sm underline">
          AcasÃƒâ€žÃ†â€™
        </Link>
      </div>
    </main>
  );
}
