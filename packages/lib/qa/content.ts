import fs from "node:fs";
import path from "node:path";
import prisma from "../db/client";
import { OfferSchema, GuideSchema, type OfferDTO, type GuideDTO } from "../schemas";

export type Severity = "ERROR" | "WARN" | "INFO";
export type Issue = { ruleId: string; severity: Severity; message: string; meta?: any };
export type Rule<T> = { id: string; desc: string; apply: (item: T) => Issue[] };

const ROOT = process.cwd();
function findQaFile(file: string): string {
  const candidates = [
    path.join(ROOT, "packages/content/qa", file),
    path.join(ROOT, "../packages/content/qa", file),
    path.join(ROOT, "../../packages/content/qa", file),
    path.join(__dirname, "../../content/qa", file),
    path.join(__dirname, "../../../content/qa", file),
    path.join(__dirname, "../../../content/qa", file),
    path.join(__dirname, "../../../../packages/content/qa", file),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {}
  }
  return path.join(ROOT, "packages/content/qa", file);
}
function loadList(file: string): RegExp[] {
  const p = findQaFile(file);
  const raw = fs.readFileSync(p, "utf8");
  const arr = JSON.parse(raw) as string[];
  return arr.map((pat) => new RegExp(pat, "i"));
}

const RO_FORB = loadList("forbidden.ro.json");
const EN_FORB = loadList("forbidden.en.json");

function hasForbidden(text?: string | null): string[] {
  if (!text) return [];
  const hits = new Set<string>();
  for (const rx of [...RO_FORB, ...EN_FORB]) if (rx.test(text)) hits.add(rx.source);
  return Array.from(hits);
}

function len(s?: string | null) {
  return (s ?? "").trim().length;
}

function between(n: number, min: number, max: number) {
  return n >= min && n <= max;
}

// OFFER RULES
const offerRules: Rule<OfferDTO>[] = [
  {
    id: "FWD-001",
    desc: "Forbidden words in title/terms",
    apply(o) {
      const hits = [...hasForbidden(o.title), ...hasForbidden(o.termsShort)];
      return hits.length
        ? [{ ruleId: "FWD-001", severity: "ERROR", message: `Formulări interzise: ${hits.join(", ")}` }]
        : [];
    },
  },
  {
    id: "WR-001",
    desc: "WR out of sane bounds",
    apply(o) {
      const wr = o.wrMultiplier ?? null;
      if (wr == null) return [];
      if (wr > 70) return [{ ruleId: "WR-001", severity: "ERROR", message: `WR ${wr}x pare excesiv (>70x). Verifică sursa.` }];
      if (wr > 50) return [{ ruleId: "WR-001", severity: "WARN", message: `WR ${wr}x ridicat (>50x).` }];
      if (wr < 1) return [{ ruleId: "WR-001", severity: "WARN", message: `WR ${wr}x prea mic (<1x).` }];
      return [];
    },
  },
  {
    id: "DEP-001",
    desc: "Min deposit sanity",
    apply(o) {
      const md = o.minDeposit ?? null;
      const issues: Issue[] = [];
      if (md != null && md < 0) issues.push({ ruleId: "DEP-001", severity: "ERROR", message: `MinDeposit negativ (${md}).` });
      if (o.offerType === "FARA_DEPUNERE" && md && md > 0)
        issues.push({ ruleId: "DEP-001", severity: "WARN", message: `Bonus fără depunere dar minDeposit=${md}.` });
      return issues;
    },
  },
  {
    id: "DATE-001",
    desc: "Dates logic",
    apply(o) {
      const { startAt, endAt, isActive } = o;
      const issues: Issue[] = [];
      if (startAt && endAt && endAt < startAt) issues.push({ ruleId: "DATE-001", severity: "ERROR", message: "endAt < startAt" });
      const now = new Date();
      if (isActive && endAt && endAt < now)
        issues.push({ ruleId: "DATE-001", severity: "WARN", message: "Oferta e expirată dar încă marcată activă." });
      return issues;
    },
  },
  {
    id: "LIC-001",
    desc: "Operator must be licensed (RO)",
    apply(o) {
      if (!o.operator.isLicensedRO && o.country === "RO" && o.isActive) {
        return [
          { ruleId: "LIC-001", severity: "ERROR", message: `Operatorul ${o.operator.name} nu este licențiat RO.` },
        ];
      }
      return [];
    },
  },
  {
    id: "SEO-001",
    desc: "Title length",
    apply(o) {
      const L = o.title.trim().length;
      if (!between(L, 35, 66)) {
        return [{ ruleId: "SEO-001", severity: "WARN", message: `Titlu ${L} caractere (ideal 35–66).` }];
      }
      return [];
    },
  },
  {
    id: "SEO-002",
    desc: "Terms short length",
    apply(o) {
      const L = len(o.termsShort);
      if (L < 20) return [{ ruleId: "SEO-002", severity: "WARN", message: "termsShort prea scurt (<20)." }];
      if (L > 220) return [{ ruleId: "SEO-002", severity: "WARN", message: "termsShort prea lung (>220)." }];
      return [];
    },
  },
];

export async function validateOfferById(offerId: string): Promise<Issue[]> {
  const oRaw = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { operator: true },
  });
  if (!oRaw) return [{ ruleId: "SYS-NOTFOUND", severity: "ERROR", message: "Oferta nu există." }];
  const o = OfferSchema.parse(oRaw);
  return offerRules.flatMap((r) => r.apply(o));
}

// GUIDES RULES
function mdxHas(text: string, rx: RegExp) {
  return rx.test(text);
}
const guideRules: Rule<GuideDTO>[] = [
  {
    id: "FWD-002",
    desc: "Forbidden words in guide",
    apply(g) {
      const hits = hasForbidden(g.source);
      return hits.length
        ? [{ ruleId: "FWD-002", severity: "ERROR", message: `Formulări interzise în ghid: ${hits.join(", ")}` }]
        : [];
    },
  },
  {
    id: "DISC-001",
    desc: "Disclaimer required",
    apply(g) {
      const ok = mdxHas(g.source, /18\+\s*Joac[ăa] responsabil/i) && mdxHas(g.source, /Con[țt]inut comercial|Publicitate/i);
      return ok
        ? []
        : [
            {
              ruleId: "DISC-001",
              severity: "WARN",
              message: "Adaugă disclaimere: „18+ Joacă responsabil” și „Conținut comercial/Publicitate”.",
            },
          ];
    },
  },
  {
    id: "H1-001",
    desc: "H1 present",
    apply(g) {
      const ok = /^#\s+.+/m.test(g.source);
      return ok ? [] : [{ ruleId: "H1-001", severity: "WARN", message: "Lip­sește H1 (linie ce începe cu `# `)." }];
    },
  },
  {
    id: "SEO-101",
    desc: "Title length (guide)",
    apply(g) {
      const L = g.title.trim().length;
      if (!between(L, 35, 66)) return [{ ruleId: "SEO-101", severity: "WARN", message: `Titlu ghid ${L} caractere (ideal 35–66).` }];
      return [];
    },
  },
];

export async function validateGuide(slug: string): Promise<Issue[]> {
  const CONTENT_DIR = path.join(ROOT, "packages/content/guides");
  const file = fs.readdirSync(CONTENT_DIR).find((f) => f.endsWith(".mdx") && f.includes(slug));
  if (!file) return [{ ruleId: "SYS-NOTFOUND", severity: "ERROR", message: "Ghidul nu există." }];
  const source = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const title = (source.match(/^#\s+(.+)$/m)?.[1] ?? slug).trim();
  const g = GuideSchema.parse({ slug, title, source });
  return guideRules.flatMap((r) => r.apply(g));
}

export async function reconcileIssues(
  entityType: "OFFER" | "GUIDE" | "OPERATOR",
  entityId: string,
  newIssues: Issue[]
) {
  const open = await prisma.contentQaIssue.findMany({ where: { entityType, entityId, resolvedAt: null } });
  const key = (i: Issue) => `${i.ruleId}|${i.message}`;
  const openKeys = new Set(open.map((i) => `${i.ruleId}|${i.message}`));
  const newKeys = new Set(newIssues.map(key));

  const toResolve = open.filter((i) => !newKeys.has(`${i.ruleId}|${i.message}`)).map((i) => i.id);
  if (toResolve.length) {
    await prisma.contentQaIssue.updateMany({ where: { id: { in: toResolve } }, data: { resolvedAt: new Date() } });
  }
  const toAdd = newIssues.filter((i) => !openKeys.has(key(i)));
  if (toAdd.length) {
    await prisma.contentQaIssue.createMany({
      data: toAdd.map((i) => ({
        entityType,
        entityId,
        ruleId: i.ruleId,
        severity: i.severity as any,
        message: i.message,
        meta: i.meta ? JSON.stringify(i.meta) : null,
      })),
    });
  }
  return { resolved: toResolve.length, added: toAdd.length, unchanged: newIssues.length - toAdd.length };
}

export async function runOfferQaBatch(limit = 50) {
  const offers = await prisma.offer.findMany({ include: { operator: true }, orderBy: [{ updatedAt: "desc" }], take: limit });
  let total = 0,
    added = 0,
    resolved = 0;
  for (const o of offers) {
    const issues = offerRules.flatMap((r) => r.apply(OfferSchema.parse(o)));
    const res = await reconcileIssues("OFFER", o.id, issues);
    total += issues.length;
    added += res.added;
    resolved += res.resolved;
  }
  return { scanned: offers.length, total, added, resolved };
}
