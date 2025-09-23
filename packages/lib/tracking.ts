export function buildOutUrl(offer: any, clickId: string, qs: URLSearchParams) {
  // Prefer urlTemplate with {subid}
  if (offer.urlTemplate && offer.urlTemplate.includes('{subid}')) {
    const u = new URL(offer.urlTemplate.replace('{subid}', encodeURIComponent(clickId)));
    for (const [k, v] of qs.entries()) if (k.startsWith('utm_')) u.searchParams.set(k, v);
    return u.toString();
  }
  // Else if network configured, inject subidParam
  const param = offer.network?.subidParam || 'subid';
  try {
    const u = new URL(offer.ctaBaseUrl);
    u.searchParams.set(param, clickId);
    for (const [k, v] of qs.entries()) if (k.startsWith('utm_')) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    const sep = offer.ctaBaseUrl.includes('?') ? '&' : '?';
    return `${offer.ctaBaseUrl}${sep}${encodeURIComponent(param)}=${encodeURIComponent(clickId)}`;
  }
}

// Simple FX map (optional); can be extended to read from ENV or an external service
const FX: Record<string, number> = {
  EUR: Number(process.env.FX_EUR || 0) || (undefined as any),
  USD: Number(process.env.FX_USD || 0) || (undefined as any),
} as any;

export function toBaseCurrency(
  amount: number,
  currency: string,
  base = process.env.BASE_CURRENCY || 'RON'
) {
  if (!currency || currency.toUpperCase() === base.toUpperCase()) return amount;
  const rate = FX[currency.toUpperCase()];
  if (!rate) return amount;
  return amount * rate;
}
