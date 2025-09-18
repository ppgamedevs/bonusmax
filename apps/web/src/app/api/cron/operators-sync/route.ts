export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { buildPreview, parseCsv, commitPreview } from "@/lib/operator-import";

function ok(url: URL) {
  return !!process.env.CRON_KEY && url.searchParams.get("key") === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const src = process.env.OPERATORS_CSV_URL;
  if (!src) return NextResponse.json({ ok: false, error: "OPERATORS_CSV_URL missing" }, { status: 400 });

  const r = await fetch(src);
  if (!r.ok) return NextResponse.json({ ok: false, error: "Fetch failed" }, { status: 400 });
  const text = await r.text();
  const rows = parseCsv(text);
  const preview = await buildPreview(rows);
  const items = preview.filter((p) => p.kind === "CREATE" || p.kind === "UPDATE");
  const result = await commitPreview(items as any);
  return NextResponse.json({ ok: true, ...result, totalRows: rows.length });
}
