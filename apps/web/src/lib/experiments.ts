import fs from 'node:fs';
import path from 'node:path';
import { cookies, headers } from 'next/headers';

type Variant = { name: 'A' | 'B'; weight: number };
export type Experiment = {
  key: 'CTA_COPY_V1' | 'OFFERS_ORDER_V1' | 'STICKY_BAR_V1' | 'EXIT_INTENT_V1';
  status: 'ACTIVE' | 'PAUSED';
  paths: string[];
  variants: Variant[];
};

function loadConfig(): Experiment[] {
  const p = path.join(process.cwd(), 'packages/content/experiments.json');
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as Experiment[];
  } catch {
    return [];
  }
}

function matchesPath(paths: string[], pathname: string) {
  return paths.some(
    (p) => p === pathname || (p.endsWith('*') && pathname.startsWith(p.slice(0, -1)))
  );
}

function pickWeighted(vs: Variant[]) {
  const total = vs.reduce((s, v) => s + v.weight, 0);
  let r = Math.random() * total;
  for (const v of vs) {
    if ((r -= v.weight) <= 0) return v.name;
  }
  return vs[0].name;
}

export function getVariant(expKey: Experiment['key']): 'A' | 'B' {
  const cAny: any = (cookies as any)();
  const cookieName = `exp__${expKey}`;
  let val = cAny?.get?.(cookieName)?.value as 'A' | 'B' | undefined;
  if (!val) {
    const cfg = loadConfig().find((e) => e.key === expKey && e.status === 'ACTIVE');
    const hAny: any = (headers as any)();
    const proto = (hAny?.get?.('x-forwarded-proto') || 'http').replace(/[^a-z]/gi, '');
    const host = hAny?.get?.('host') || 'localhost';
    const pathHdr = hAny?.get?.('x-invoke-path') || '/';
    const pathname = new URL(`${proto}://${host}${pathHdr}`).pathname;
    if (cfg && matchesPath(cfg.paths, pathname)) {
      val = pickWeighted(cfg.variants);
    } else {
      val = 'A';
    }
    cAny?.set?.(cookieName, val, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    });
  }
  return val === 'B' ? 'B' : 'A';
}

export function getCtaLabel(): string {
  return getVariant('CTA_COPY_V1') === 'A' ? 'Vezi bonus' : 'Deschide oferta';
}

export function orderOffersWithExperiment<T extends { priority?: number }>(list: T[]): T[] {
  const v = getVariant('OFFERS_ORDER_V1');
  if (v === 'A') return [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const arr = [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  const top = arr.slice(0, 5);
  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top.concat(arr.slice(5));
}

export function isStickyOn() {
  return getVariant('STICKY_BAR_V1') === 'B';
}

export function isExitOn() {
  return getVariant('EXIT_INTENT_V1') === 'B';
}

export function ensureSessionIdClient(): string {
  if (typeof document === 'undefined') return '';
  const name = 'bm_sid=';
  const found = document.cookie.split('; ').find((x) => x.startsWith(name));
  if (found) return found.slice(name.length);
  const sid = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  const exp = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
  document.cookie = `bm_sid=${sid}; Path=/; SameSite=Lax; Expires=${exp}`;
  return sid;
}
