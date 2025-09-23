export function buildOutUrlSimple(baseUrl: string, subid: string, qs: URLSearchParams) {
  try {
    const u = new URL(baseUrl);
    u.searchParams.set('subid', subid);
    for (const [k, v] of qs.entries()) if (k.startsWith('utm_')) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    const sep = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${sep}subid=${encodeURIComponent(subid)}`;
  }
}
