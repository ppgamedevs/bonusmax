import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma, hashIp, buildOutUrlSimple } from '@bonusmax/lib';
import { cookies } from 'next/headers';

function getIp(h: Headers) {
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || '0.0.0.0';
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const h = headers() as any;
  const ua = h.get('user-agent');
  const referer = h.get('referer');
  const ip = getIp(h as unknown as Headers);
  const url = new URL(req.url);
  const ab = url.searchParams.get('ab');

  const offer = await (prisma as any).offer.findUnique({
    where: { id: params.id },
    include: { operator: true, network: true }
  });
  if (!offer) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }

  const ipHash = hashIp(ip, ua);

  // Persist click to obtain clickId used as subid
  function pathOnly(u?: string | null) {
    if (!u) return null;
    try {
      return new URL(u).pathname || "/";
    } catch {
      return null;
    }
  }

  const cAny: any = (cookies as any)();
  const expCta = cAny?.get?.('exp__CTA_COPY_V1')?.value || 'A';
  const expOrder = cAny?.get?.('exp__OFFERS_ORDER_V1')?.value || 'A';

  const click = await (prisma as any).clickEvent.create({
    data: {
      offerId: offer.id,
      operatorId: offer.operatorId,
      ipHash,
      userAgent: ua ?? undefined,
      referer: referer ?? undefined,
      landingPath: pathOnly(referer) ?? undefined,
      utmSource: url.searchParams.get('utm_source') || 'bonusmax',
      utmMedium: url.searchParams.get('utm_medium') || 'cta',
      utmCampaign: url.searchParams.get('utm_campaign') || offer.operator.slug,
      utmContent: url.searchParams.get('utm_content') || (ab ? `cta-${ab}` : undefined),
      expCtaCopy: expCta === 'B' ? 'B' : 'A',
      expOffersOrder: expOrder === 'B' ? 'B' : 'A'
    },
    select: { id: true }
  });

  const finalUrl = buildOutUrlSimple(offer.ctaBaseUrl, click.id, url.searchParams);

  return NextResponse.redirect(finalUrl, { status: 307 });
}
