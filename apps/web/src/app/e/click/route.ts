export const dynamic = "force-dynamic";
export const revalidate = 60;
import { prisma } from "@bonusmax/lib";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sid = url.searchParams.get("sid");
  const oid = url.searchParams.get("oid");
  if (sid) await prisma.emailEvent.create({ data: { subscriberId: sid, type: "CLICK" as any, meta: oid ?? undefined, offerId: oid ?? undefined } });
  if (oid) redirect(`/go/${oid}`);
  redirect("/");
}
