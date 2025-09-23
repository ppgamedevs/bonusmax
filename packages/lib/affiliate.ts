import crypto from 'node:crypto';

export function buildAffiliateUrl(base: string, offerId: string, extras?: Record<string, string>) {
  const url = new URL(base);
  url.searchParams.set('offer_id', offerId);
  url.searchParams.set('utm_source', 'bonusmax');
  url.searchParams.set('utm_medium', 'cta');
  if (extras) {
    for (const [k, v] of Object.entries(extras)) if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

export function hashIp(ip: string, ua: string | null) {
  const salt = process.env.HASH_SALT || 'bonusmax';
  return crypto
    .createHash('sha256')
    .update(`${ip}|${ua ?? ''}|${salt}`)
    .digest('hex');
}
