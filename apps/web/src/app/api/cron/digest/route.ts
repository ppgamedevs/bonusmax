export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { NextResponse } from 'next/server';
import { prisma, getTopTodayOffers, sendEmail } from '@bonusmax/lib';
import { sendWeeklyDigest } from '@/lib/email';

function assertCron(url: URL) {
  return !!process.env.CRON_KEY && url.searchParams.get('key') === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!assertCron(url))
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const limit = Number(url.searchParams.get('limit') || 200);

  const subs = await prisma.subscriber.findMany({
    where: { status: 'ACTIVE' as any, frequency: 'WEEKLY' as any },
    orderBy: { lastSentAt: 'asc' as any },
    take: limit,
  });

  const top = await getTopTodayOffers(8, 168);
  const offers = top.map((t: any) => t.offer);

  let sent = 0;
  for (const s of subs) {
    const { html, text } = await sendWeeklyDigest(s.email, s.id, offers as any);
    await sendEmail({
      to: s.email,
      subject:
        'Top bonusuri ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ SÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ptÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢na aceasta',
      html,
      text,
    });
    await prisma.emailEvent.create({
      data: { subscriberId: s.id, type: 'SENT' as any, meta: 'weekly' },
    });
    await prisma.subscriber.update({ where: { id: s.id }, data: { lastSentAt: new Date() } });
    sent++;
  }

  return NextResponse.json({ ok: true, sent, subscribers: subs.length });
}
