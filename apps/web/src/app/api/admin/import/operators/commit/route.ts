export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { NextResponse } from 'next/server';
import { commitPreview } from '@/lib/operator-import';

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get('key') === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => null)) as any;
  if (!body?.items || !Array.isArray(body.items))
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });

  const sanitized = body.items.filter((x: any) => x?.kind === 'CREATE' || x?.kind === 'UPDATE');
  const result = await commitPreview(sanitized);
  return NextResponse.json({ ok: true, ...result });
}
