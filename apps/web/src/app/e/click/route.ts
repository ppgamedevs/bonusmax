export const dynamic = "force-static";
export const revalidate = false;
import { prisma } from "@bonusmax/lib";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  // During static export (build), return a placeholder response
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    redirect("/");
    return;
  }

  const url = new URL(req.url);
  const sid = url.searchParams.get("sid");
  const oid = url.searchParams.get("oid");
  if (sid) await prisma.emailEvent.create({ data: { subscriberId: sid, type: "CLICK" as any, meta: oid ?? undefined, offerId: oid ?? undefined } });
  if (oid) redirect(`/go/${oid}`);
  redirect("/");
}
