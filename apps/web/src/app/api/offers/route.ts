import { NextResponse } from 'next/server';
import { getActiveOffers } from '@bonusmax/lib';

export const revalidate = 300; // 5 minutes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = Number(searchParams.get('offset') || '0');
    const limit = Number(searchParams.get('limit') || '24');

    const offers = await getActiveOffers('RO', {
      offset: Number.isFinite(offset) ? offset : 0,
      limit: Number.isFinite(limit) ? limit : 24,
    });

    return NextResponse.json({ ok: true, offers });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
  }
}
