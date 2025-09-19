export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import crypto from "node:crypto";
import { headers } from "next/headers";

function hashIp(ip: string, ua?: string | null) {
  const salt = process.env.HASH_SALT || "bonusmax";
  return crypto.createHash("sha256").update(`${ip}|${ua || ""}|${salt}`).digest("hex");
}

export async function POST(req: Request) {
  const h = (headers as any)();
  const ua = h?.get?.("user-agent");
  const ip = (h?.get?.("x-forwarded-for") || "").split(",")[0].trim() || h?.get?.("x-real-ip") || "0.0.0.0";
  const body = (await req.json().catch(() => null)) as any;
  if (!body?.component || !body?.experimentKey || !body?.variant || !body?.path) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await (prisma as any).uiImpression.create({
    data: {
      component: String(body.component),
      experimentKey: String(body.experimentKey),
      variant: String(body.variant) === "B" ? "B" : "A",
      path: String(body.path),
      sessionId: (body.sessionId || "").toString().slice(0, 64),
      ipHash: hashIp(String(ip), ua),
      userAgent: ua || undefined,
    },
  });
  return NextResponse.json({ ok: true });
}
