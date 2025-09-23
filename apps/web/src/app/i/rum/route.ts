export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@bonusmax/lib';
import crypto from 'node:crypto';

function hashIp(ip: string, ua: string | null) {
  const salt = process.env.HASH_SALT || 'bonusmax';
  return crypto
    .createHash('sha256')
    .update(`${ip}|${ua ?? ''}|${salt}`)
    .digest('hex');
}

function getIp(h: any) {
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || '0.0.0.0';
}

// Simple in-memory rate limiter. For production, move to Redis/Upstash.
const buckets = new Map<string, { t: number; c: number }>();
function rateOk(key: string, limit = 120, windowMs = 10 * 60 * 1000) {
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
  try {
    const body = await req.json().catch(() => null);
    if (!body?.name) return NextResponse.json({ ok: false }, { status: 400 });

    const h = headers() as any;
    const ua = h.get('user-agent');
    const ip = getIp(h);
    const hash = hashIp(ip, ua);
    if (!rateOk(`rum:${hash}`)) return NextResponse.json({ ok: false }, { status: 429 });

    await prisma.rumEvent.create({
      data: {
        metric: String(body.name),
        value: Number(body.value ?? 0),
        idTag: String(body.id ?? ''),
        url: String(body.url ?? ''),
        ua: ua ?? undefined,
        ipHash: hash,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
