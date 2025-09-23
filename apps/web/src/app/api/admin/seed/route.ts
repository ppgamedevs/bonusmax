export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get('key') === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return new NextResponse('Unauthorized', { status: 401 });
  return NextResponse.json(
    {
      ok: false,
      message: 'Seed endpoint disabled',
    },
    { status: 410 }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return new NextResponse('Unauthorized', { status: 401 });
  return NextResponse.json(
    {
      ok: false,
      message: 'Seed endpoint disabled',
    },
    { status: 410 }
  );
}
