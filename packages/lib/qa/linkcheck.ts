import { prisma } from '..';

function timeoutFetch(url: string, opts: RequestInit & { timeout?: number } = {}) {
  const { timeout = 10000, ...rest } = opts as any;
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), timeout);
  return fetch(url, {
    ...(rest as any),
    signal: c.signal,
    redirect: 'follow' as RequestRedirect,
  }).finally(() => clearTimeout(id));
}

export type LinkCheckResult = {
  status: 'OK' | 'WARN' | 'ERROR';
  httpCode?: number;
  finalUrl?: string;
  redirects?: number;
  durationMs?: number;
  error?: string;
};

export async function checkAffiliateLink(url: string, timeoutMs = 10000): Promise<LinkCheckResult> {
  const start = Date.now();
  try {
    const res = await timeoutFetch(url, { method: 'GET', timeout: timeoutMs });
    const durationMs = Date.now() - start;
    const httpCode = (res as Response).status;
    const finalUrl = (res as Response).url;
    if (httpCode >= 200 && httpCode < 400) {
      return { status: 'OK', httpCode, finalUrl, redirects: undefined, durationMs };
    }
    if (httpCode >= 400 && httpCode < 500) {
      return { status: 'WARN', httpCode, finalUrl, durationMs, error: `4xx code` };
    }
    return { status: 'ERROR', httpCode, finalUrl, durationMs, error: `HTTP ${httpCode}` };
  } catch (e: any) {
    const durationMs = Date.now() - start;
    return { status: 'ERROR', error: e?.message ?? 'fetch failed', durationMs };
  }
}

export async function recordLinkCheck(offerId: string, result: LinkCheckResult) {
  await prisma.$transaction(async (tx: any) => {
    await tx.offerLinkCheck.create({
      data: {
        offerId,
        status: result.status,
        httpCode: result.httpCode ?? null,
        finalUrl: result.finalUrl ?? null,
        redirects: result.redirects ?? 0,
        durationMs: result.durationMs ?? null,
        error: result.error ?? null,
      },
    });
    await tx.offer.update({
      where: { id: offerId },
      data: {
        lastCheckedAt: new Date(),
        lastOkAt: result.status === 'OK' ? new Date() : undefined,
        lastHttpCode: result.httpCode ?? null,
        lastCheckStatus: result.status,
      },
    });
  });
}
