export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { makeSlug, cleanExcerpt } from "@/lib/feedy";

function ok(url: URL) {
  return !!process.env.CRON_KEY && url.searchParams.get("key") === process.env.CRON_KEY;
}

async function upsertItem(data: {
  sourceId?: string | null;
  url: string;
  title: string;
  excerpt?: string;
  image?: string;
  publishedAt?: Date | null;
}) {
  const slugBase = makeSlug(data.title || data.url);
  const slug = slugBase;
  return (prisma as any).feedItem.upsert({
    where: { url: data.url },
    create: {
      sourceId: data.sourceId ?? null,
      url: data.url,
      slug,
      title: data.title,
      excerpt: cleanExcerpt(data.excerpt || ""),
      image: data.image || null,
      publishedAt: data.publishedAt || null,
      status: "PENDING",
    },
    update: {
      title: data.title,
      excerpt: cleanExcerpt(data.excerpt || ""),
      image: data.image || null,
      publishedAt: data.publishedAt || null,
    },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });

  const sources = await (prisma as any).source.findMany({ where: { isActive: true } });
  const parser = new Parser();

  let created = 0;
  for (const s of sources) {
    try {
      if (s.type === "RSS") {
        const feed = await parser.parseURL(s.url);
        for (const it of feed.items.slice(0, 20)) {
          const link = (it.link || "").trim();
          const title = (it.title || "").trim();
          if (!link || !title) continue;
          const date = (it.isoDate ? new Date(it.isoDate) : it.pubDate ? new Date(it.pubDate) : null) as Date | null;
          const img = (it.enclosure as any)?.url || (it as any)["media:content"]?.url;
          await upsertItem({ sourceId: s.id, url: link, title, excerpt: (it as any).contentSnippet || (it as any).content || "", image: img, publishedAt: date });
          created++;
        }
      } else {
        const r = await fetch(s.url, { headers: { "user-agent": "BonusmaxFeedy/1.0" } });
        const html = await r.text();
        const $ = cheerio.load(html);
        const sel = s.selector || "article a";
        const links: string[] = [];
        $(sel).each((_, el) => {
          const href = $(el).attr("href") || "";
          const title = ($(el).attr("title") || $(el).text() || "").trim();
          if (!href || !title) return;
          const abs = href.startsWith("http") ? href : new URL(href, s.url).toString();
          links.push(JSON.stringify({ url: abs, title }));
        });
        for (const raw of links.slice(0, 20)) {
          const { url: link, title } = JSON.parse(raw);
          await upsertItem({ sourceId: s.id, url: link, title, excerpt: "", image: undefined, publishedAt: null });
          created++;
        }
      }
    } catch (e) {
      // ignore this source failure
    }
  }
  return NextResponse.json({ ok: true, created });
}
