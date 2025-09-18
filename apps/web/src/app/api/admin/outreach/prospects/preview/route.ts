export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { parseProspectsCsv } from "@/lib/outreach";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return NextResponse.json({ ok: false }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file") as File | null;
  if (!file) return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  const text = await file.text();
  const items = parseProspectsCsv(text);
  return NextResponse.json({ ok: true, items, count: items.length });
}
