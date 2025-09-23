import { prisma } from '@bonusmax/lib';
import { parse } from 'csv-parse/sync';
import { distance as levenshtein } from 'fastest-levenshtein';
import { z } from 'zod';

export type Row = {
  name: string;
  slug?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  onjnLicenseId?: string | null;
  onjnLicenseExpiry?: string | null;
  isLicensed?: string | boolean | null;
};

export type CleanRow = {
  name: string;
  slug: string;
  website?: string | null;
  websiteHost?: string | null;
  logoUrl?: string | null;
  onjnLicenseId?: string | null;
  onjnLicenseExpiry?: Date | null;
  isLicensedRO: boolean;
};

const RowSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  onjnLicenseId: z.string().optional().nullable(),
  onjnLicenseExpiry: z.string().optional().nullable(),
  isLicensed: z.union([z.string(), z.boolean()]).optional().nullable(),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

function parseDateFlexible(s?: string | null): Date | null {
  if (!s) return null;
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return new Date(t + 'T00:00:00Z');
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(t);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
  }
  const d = new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

function toBool(v: any): boolean | null {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'da', 'yes', 'y'].includes(s)) return true;
  if (['0', 'false', 'nu', 'no', 'n'].includes(s)) return false;
  return null;
}

function hostFromUrl(u?: string | null): string | null {
  if (!u) return null;
  try {
    return new URL(u).host.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function parseCsv(text: string): Row[] {
  const recs = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, any>[];

  const mapKey = (k: string) => {
    const x = k.toLowerCase().trim();
    const dict: Record<string, string> = {
      name: 'name',
      operator: 'name',
      denumire: 'name',
      slug: 'slug',
      website: 'website',
      url: 'website',
      site: 'website',
      logo: 'logoUrl',
      logourl: 'logoUrl',
      onjn: 'onjnLicenseId',
      onjnlicenseid: 'onjnLicenseId',
      license: 'onjnLicenseId',
      licenseid: 'onjnLicenseId',
      onjnlicenseexpiry: 'onjnLicenseExpiry',
      expiry: 'onjnLicenseExpiry',
      expira: 'onjnLicenseExpiry',
      islicensed: 'isLicensed',
      licentiat: 'isLicensed',
    };
    return dict[x] || x;
  };

  return recs.map((r) => {
    const row: any = {};
    for (const [k, v] of Object.entries(r)) row[mapKey(k)] = v;
    const parsed = RowSchema.safeParse(row);
    if (!parsed.success) return row as Row;
    return parsed.data as Row;
  });
}

export function cleanRow(row: Row): CleanRow | { error: string; name?: string } {
  if (!row?.name) return { error: 'Missing name' };
  const slug = row.slug && row.slug.trim() ? slugify(row.slug) : slugify(row.name);
  const expiry = parseDateFlexible(row.onjnLicenseExpiry ?? null);
  const websiteHost = hostFromUrl(row.website ?? null);
  const explicit = toBool(row.isLicensed);
  const derived = !!(row.onjnLicenseId && expiry && expiry.getTime() >= Date.now());
  const isLicensedRO = explicit !== null ? explicit : derived;
  return {
    name: row.name.trim(),
    slug,
    website: row.website?.trim() || null,
    websiteHost,
    logoUrl: row.logoUrl?.trim() || null,
    onjnLicenseId: row.onjnLicenseId?.trim() || null,
    onjnLicenseExpiry: expiry,
    isLicensedRO,
  };
}

function findMatch(
  existing: Array<{ id: string; slug: string; name: string; website: string | null }>,
  inRow: CleanRow
) {
  const bySlug = existing.find((e) => e.slug === inRow.slug);
  if (bySlug) return bySlug;
  if (inRow.websiteHost) {
    const byHost = existing.find((e) => e.website && hostFromUrl(e.website) === inRow.websiteHost);
    if (byHost) return byHost;
  }
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  const target = norm(inRow.name);
  let best: any = null;
  let bestScore = Infinity;
  for (const e of existing) {
    const d = levenshtein(norm(e.name), target);
    if (d < bestScore) {
      bestScore = d;
      best = e;
    }
  }
  if (best && bestScore <= 2) return best;
  return null;
}

export type PreviewItem =
  | { kind: 'CREATE'; proposed: CleanRow }
  | { kind: 'UPDATE'; id: string; before: any; patch: Partial<CleanRow> }
  | { kind: 'SKIP'; reason: string; row: any }
  | { kind: 'INVALID'; reason: string; row: any };

export async function buildPreview(rows: Row[]): Promise<PreviewItem[]> {
  const existing = await prisma.operator.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      website: true,
      isLicensedRO: true,
      onjnLicenseId: true,
      onjnLicenseExpiry: true,
      logoUrl: true,
    },
  });

  const out: PreviewItem[] = [];
  for (const r of rows) {
    const c = cleanRow(r);
    if ('error' in c) {
      out.push({ kind: 'INVALID', reason: c.error, row: r });
      continue;
    }
    const match = findMatch(existing, c);
    if (!match) {
      out.push({ kind: 'CREATE', proposed: c });
      continue;
    }
    const before = existing.find((e) => e.id === match.id)!;
    const patch: any = {};
    const fields: (keyof CleanRow)[] = [
      'name',
      'slug',
      'website',
      'logoUrl',
      'onjnLicenseId',
      'onjnLicenseExpiry',
      'isLicensedRO',
    ];
    for (const f of fields) {
      const newVal: any = (c as any)[f] ?? null;
      const oldVal: any = (before as any)[f] ?? null;
      const same =
        f === 'onjnLicenseExpiry'
          ? (oldVal ? new Date(oldVal).getTime() : null) ===
            (newVal ? new Date(newVal).getTime() : null)
          : String(oldVal ?? '') === String(newVal ?? '');
      if (!same) patch[f] = newVal;
    }
    if (Object.keys(patch).length === 0) out.push({ kind: 'SKIP', reason: 'No changes', row: r });
    else out.push({ kind: 'UPDATE', id: match.id, before, patch });
  }
  return out;
}

export async function commitPreview(items: PreviewItem[]) {
  const creates = items.filter((i) => i.kind === 'CREATE') as Extract<
    PreviewItem,
    { kind: 'CREATE' }
  >[];
  const updates = items.filter((i) => i.kind === 'UPDATE') as Extract<
    PreviewItem,
    { kind: 'UPDATE' }
  >[];
  const result = await prisma.$transaction(async (tx) => {
    let created = 0,
      updated = 0;
    for (const it of creates) {
      await tx.operator.create({
        data: {
          slug: it.proposed.slug,
          name: it.proposed.name,
          website: it.proposed.website ?? null,
          logoUrl: it.proposed.logoUrl ?? null,
          isLicensedRO: it.proposed.isLicensedRO,
          onjnLicenseId: it.proposed.onjnLicenseId ?? null,
          onjnLicenseExpiry: it.proposed.onjnLicenseExpiry ?? null,
          rating: 0,
          pros: [],
          cons: [],
        },
      });
      created++;
    }
    for (const it of updates) {
      await tx.operator.update({
        where: { id: it.id },
        data: {
          ...it.patch,
        } as any,
      });
      updated++;
    }
    return { created, updated };
  });
  return result;
}
