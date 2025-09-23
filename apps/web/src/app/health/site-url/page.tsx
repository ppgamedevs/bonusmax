export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { absoluteUrl } from '@bonusmax/lib';

export const metadata = { title: 'Health: Site URL' };

export default function Page() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || '(not set)';
  const absHome = absoluteUrl('/');
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Health: Site URL</h1>
      <div className="mt-4 space-y-2 text-sm">
        <div>
          <span className="font-semibold">process.env.NEXT_PUBLIC_SITE_URL:</span>{' '}
          <code className="rounded bg-white/10 px-2 py-1">{envUrl}</code>
        </div>
        <div>
          <span className="font-semibold">absoluteUrl('/')</span> (from @bonusmax/lib):{' '}
          <code className="rounded bg-white/10 px-2 py-1">{absHome}</code>
        </div>
      </div>
    </main>
  );
}
