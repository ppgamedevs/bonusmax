export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { NextResponse } from 'next/server';
import { prisma } from '@bonusmax/lib';
import crypto from 'node:crypto';
import { headers } from 'next/headers';

function hashIp(ip: string, ua?: string | null) {
  const salt = process.env.HASH_SALT || 'bonusmax';
  return crypto
    .createHash('sha256')
    .update(`${ip}|${ua || ''}|${salt}`)
    .digest('hex');
}

// Simple in-memory rate limit (per process). For production, consider Redis/Upstash.
const buckets = new Map<string, { t: number; c: number }>();
function rateOk(key: string, limit = 60, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.t > windowMs) {
    buckets.set(key, { t: now, c: 1 });
    return true;
  }
  if (b.c < limit) {
    b.c++;
    return true;
  }
  return false;
}

export async function POST(req: Request) {
  const h = (headers as any)();
  const ua = h?.get?.('user-agent');
  const ip =
    (h?.get?.('x-forwarded-for') || '').split(',')[0].trim() || h?.get?.('x-real-ip') || '0.0.0.0';
  const body = (await req.json().catch(() => null)) as any;
  if (!body?.component || !body?.experimentKey || !body?.variant || !body?.path) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ipHash = hashIp(String(ip), ua || undefined);
  if (!rateOk(`ui:imp:${ipHash}`)) return NextResponse.json({ ok: false }, { status: 429 });
  await (prisma as any).uiImpression.create({
    data: {
      component: String(body.component),
      experimentKey: String(body.experimentKey),
      variant: String(body.variant) === 'B' ? 'B' : 'A',
      path: String(body.path),
      sessionId: (body.sessionId || '').toString().slice(0, 64),
      ipHash,
      userAgent: ua || undefined,
    },
  });
  return NextResponse.json({ ok: true });
}
