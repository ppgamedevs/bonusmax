export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma } from '@bonusmax/lib';

const GIF_1x1 = Buffer.from(
  '47494638396101000100f00000ffffff0000002c00000000010001000002024401003b',
  'hex'
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get('sid');
  if (sid) {
    await prisma.emailEvent.create({ data: { subscriberId: sid, type: 'OPEN' as any } });
  }
  return new Response(GIF_1x1, {
    headers: { 'content-type': 'image/gif', 'cache-control': 'no-store' },
  });
}
