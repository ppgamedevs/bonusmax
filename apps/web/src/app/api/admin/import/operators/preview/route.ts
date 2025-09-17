import { NextResponse } from "next/server";
import { buildPreview, parseCsv, Row } from "@/lib/operator-import";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const ct = req.headers.get("content-type") || "";
  let rows: Row[] = [];
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    const text = await file.text();
    rows = parseCsv(text);
  } else {
    const body = (await req.json().catch(() => null)) as { url?: string } | null;
    if (!body?.url) return NextResponse.json({ ok: false, error: "No URL" }, { status: 400 });
    const res = await fetch(body.url);
    if (!res.ok) return NextResponse.json({ ok: false, error: "Fetch failed" }, { status: 400 });
    const text = await res.text();
    rows = parseCsv(text);
  }

  const preview = await buildPreview(rows);
  const summary = {
    create: preview.filter((p) => p.kind === "CREATE").length,
    update: preview.filter((p) => p.kind === "UPDATE").length,
    skip: preview.filter((p) => p.kind === "SKIP").length,
    invalid: preview.filter((p) => p.kind === "INVALID").length,
  };
  return NextResponse.json({ ok: true, summary, preview });
}
