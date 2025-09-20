export const dynamic = "force-dynamic";
export const revalidate = 60;
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@bonusmax/lib";
import { createOrRefreshPending, sendConfirmEmail } from "@/lib/email";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email } = bodySchema.parse(body);

  const { subscriber, token } = await createOrRefreshPending(email);
  await prisma.emailEvent.create({ data: { subscriberId: subscriber.id, type: "SENT" as any, meta: "confirm" } });
  await sendConfirmEmail(email, token, subscriber.id);

  return NextResponse.json({ ok: true });
}

