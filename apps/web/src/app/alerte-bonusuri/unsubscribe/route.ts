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
  if (!token) return NextResponse.redirect("/alerte-bonusuri?status=missing-unsub");
  const hash = sha256(token);
  const sub = await prisma.subscriber.findFirst({ where: { unsubscribeTokenHash: hash } });
  if (!sub) return NextResponse.redirect("/alerte-bonusuri?status=invalid-unsub");

  await prisma.subscriber.update({ where: { id: sub.id }, data: { status: "UNSUBSCRIBED" as any } });
  await prisma.emailEvent.create({ data: { subscriberId: sub.id, type: "UNSUB" as any } });

  return NextResponse.redirect("/alerte-bonusuri?status=unsubscribed");
}
