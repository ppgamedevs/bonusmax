export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import crypto from "node:crypto";

function sha256(s: string) {
  const salt = process.env.HASH_SALT || "bonusmax";
  return crypto.createHash("sha256").update(s + "|" + salt).digest("hex");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const baseUrl = url.origin;
  
  if (!token) return NextResponse.redirect(new URL('/alerte-bonusuri?status=missing-unsub', baseUrl));
  const hash = sha256(token);
  const sub = await prisma.subscriber.findFirst({ where: { unsubscribeTokenHash: hash } });
  if (!sub) return NextResponse.redirect(new URL('/alerte-bonusuri?status=invalid-unsub', baseUrl));

  await prisma.subscriber.update({ where: { id: sub.id }, data: { status: "UNSUBSCRIBED" as any } });
  await prisma.emailEvent.create({ data: { subscriberId: sub.id, type: "UNSUB" as any } });

  return NextResponse.redirect(new URL('/alerte-bonusuri?status=unsubscribed', baseUrl));
}
