export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { runOfferQaBatch, validateGuide, reconcileIssues } from "@bonusmax/lib";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as any;
  const type = String(body.type || url.searchParams.get("type") || "offer");
  const limit = Number(body.limit ?? url.searchParams.get("limit") ?? 50);

  if (type === "offer") {
    const res = await runOfferQaBatch(limit);
    return NextResponse.json({ ok: true, ...res });
  }
  if (type === "guide") {
    const slug = String(body.slug || "");
    if (!slug) return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    const issues = await validateGuide(slug);
    const r = await reconcileIssues("GUIDE", "guide:" + slug, issues);
    return NextResponse.json({ ok: true, issues: issues.length, ...r });
  }
  return NextResponse.json({ ok: false, error: "type invalid" }, { status: 400 });
}
