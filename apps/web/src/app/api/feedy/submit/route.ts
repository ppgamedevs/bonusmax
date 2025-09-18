import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import { headers } from "next/headers";
import { hashIp, makeSlug, cleanExcerpt } from "@/lib/feedy";

export async function POST(req: Request) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
const xff = h.get("x-forwarded-for");
const realIp = h.get("x-real-ip");
const ipFromXff = (xff ?? "").split(",")[0]?.trim() ?? "";
const ip = ipFromXff || realIp || "0.0.0.0";
  const body = (await req.json().catch(() => null)) as any;
  const url = String(body?.url || "");
  if (!/^https?:\/\//i.test(url)) return NextResponse.json({ ok: false, error: "invalid_url" }, { status: 400 });

  await (prisma as any).userSubmission.create({
    data: {
      url,
      title: (body?.title || "").toString().slice(0, 180),
      note: (body?.note || "").toString().slice(0, 400),
      email: (body?.email || "").toString().slice(0, 160),
      ipHash: hashIp(String(ip), ua),
    },
  });

  await (prisma as any).feedItem.upsert({
    where: { url },
    create: {
      url,
      slug: makeSlug(body?.title || url),
      title: (body?.title || url).toString().slice(0, 180),
      excerpt: cleanExcerpt(body?.note || ""),
      status: "PENDING",
    },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
