import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import { revalidatePath } from "next/cache";

function assertCronKey(url: URL) {
  return process.env.CRON_KEY && url.searchParams.get("key") === process.env.CRON_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!assertCronKey(url)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const now = new Date();

  const expired = await prisma.offer.updateMany({
    where: { isActive: true, endAt: { lt: now } },
    data: { isActive: false },
  });

  revalidatePath("/");
  revalidatePath("/bonusuri-fara-depunere");
  revalidatePath("/rotiri-gratuite");

  return NextResponse.json({ ok: true, expired: expired.count });
}
