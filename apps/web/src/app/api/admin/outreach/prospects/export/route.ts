export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';
import { NextResponse } from 'next/server';

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get('key') === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return new NextResponse('Unauthorized', { status: 401 });
  // During static export (build), avoid DB access and return an empty CSV.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new NextResponse('email,first_name,site,subject,body,asset_url,notes\n', {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': 'attachment; filename=prospects.csv',
      },
    });
  }
  const minScore = Number(url.searchParams.get('minScore') || 60);
  const rows = await (prisma as any).prospect.findMany({
    where: { score: { gte: minScore } },
    include: { domain: true },
    orderBy: { score: 'desc' },
    take: 5000,
  });
  const lines = [
    ['email', 'first_name', 'site', 'subject', 'body', 'asset_url', 'notes'].join(','),
    ...rows.map((r: any) => {
      const first = (r.name || '').split(' ')[0] || '';
      return [
        r.email || '',
        first,
        r.domain.host,
        '',
        '',
        '',
        String(r.notes || '').replace(/,/g, ';'),
      ].join(',');
    }),
  ].join('\n');
  return new NextResponse(lines, {
    headers: {
      'content-type': 'text/csv',
      'content-disposition': 'attachment; filename=prospects.csv',
    },
  });
}
