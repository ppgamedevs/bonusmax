export function buildAffiliateUrl(offerId: string, base: string) {
  const url = new URL(base);
  url.searchParams.set('offer', offerId);
  return url.toString();
}
