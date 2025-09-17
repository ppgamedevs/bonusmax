import { parse } from "csv-parse/sync";
import { prisma } from "@bonusmax/lib";

export function parseProspectsCsv(text: string) {
  const recs = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as any[];
  return recs.map((r) => ({
    email: (r.email || "").trim().toLowerCase() || null,
    name: (r.name || "").trim() || null,
    role: (r.role || "").trim() || null,
    site: (r.site || "").trim() || null,
    dr: r.dr ? Number(r.dr) : null,
    topic: (r.topic || "").trim() || null,
    notes: (r.notes || "").trim() || null,
  }));
}

export function scoreProspect(dr?: number | null, topic?: string | null) {
  let s = Math.max(0, Math.min(100, dr ?? 0));
  const t = (topic || "").toLowerCase();
  if (/(gambling|casino|cazino|pariuri|sloturi|igaming)/i.test(t)) s += 20;
  return Math.min(120, s);
}

export async function upsertProspect(item: ReturnType<typeof parseProspectsCsv>[number]) {
  if (!item.site) throw new Error("Missing site");
  const host = item.site.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0].toLowerCase();
  const domain = await (prisma as any).domain.upsert({
    where: { host },
    create: { host, dr: item.dr ?? undefined, topics: item.topic ? [item.topic] : [], notes: item.notes ?? undefined },
    update: {
      dr: item.dr ?? undefined,
      topics: item.topic ? { push: item.topic } : undefined,
      notes: item.notes ?? undefined,
    },
  });
  if (!item.email) return { domain, prospect: null, skipped: "no_email" };
  const score = scoreProspect(item.dr, item.topic);
  const prospect = await (prisma as any).prospect.upsert({
    where: { email: item.email },
    create: { email: item.email, name: item.name ?? undefined, role: item.role ?? undefined, domainId: domain.id, score, notes: item.notes ?? undefined },
    update: { name: item.name ?? undefined, role: item.role ?? undefined, domainId: domain.id, score, notes: item.notes ?? undefined },
  });
  return { domain, prospect };
}

export function renderTemplate(tpl: { subject: string; body: string }, vars: Record<string, string>) {
  const rep = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_: any, k: string) => vars[k] ?? "");
  return { subject: rep(tpl.subject), body: rep(tpl.body) };
}
