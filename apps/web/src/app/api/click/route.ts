export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getOfferById, logClick, hashIp } from '@bonusmax/lib';

function getIp(h: Headers) {
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || '0.0.0.0';
}

export async function POST(req: Request) {
  try {
    const { offerId } = await req.json();
    if (!offerId) return NextResponse.json({ ok: false, error: 'offerId required' }, { status: 400 });

    const h = await headers();
    const ua = h.get('user-agent');
    const referer = h.get('referer');
    const ip = getIp(h as unknown as Headers);
    const offer = await getOfferById(offerId);
    if (!offer) return NextResponse.json({ ok: false, error: 'offer not found' }, { status: 404 });

    const ipHash = hashIp(ip, ua);

    await logClick({
      offerId: offer.id,
      operatorId: offer.operatorId,
      ipHash,
      userAgent: ua ?? undefined,
      referer: referer ?? undefined
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
