export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any;
  const email = String(body?.email || "").toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const token = crypto.randomBytes(24).toString("base64url");
  const sub = await (prisma as any).newsletterSubscriber.upsert({
    where: { email },
    create: { email, token, status: "PENDING" },
    update: { token, status: "PENDING" },
  });
  return NextResponse.json({ ok: true, verifyUrl: `/newsletter/verify?token=${token}` });
}
