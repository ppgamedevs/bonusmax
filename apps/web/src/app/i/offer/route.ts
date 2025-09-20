export const dynamic = "force-dynamic";
export const revalidate = 60;
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getOfferById, prisma, hashIp } from "@bonusmax/lib";

function getIp(h: Headers) {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") || "0.0.0.0";
}

// 1x1 transparent GIF bytes
const GIF_1x1 = Buffer.from(
  "47494638396101000100f00000ffffff0000002c00000000010001000002024401003b",
  "hex"
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const h = await headers();
  const ua = h.get("user-agent");
  const referer = h.get("referer");
  const ip = getIp(h as unknown as Headers);

  if (id) {
    const offer = await getOfferById(id);
    if (offer) {
      const ipHash = hashIp(ip, ua);
      await prisma.offerImpression.create({
        data: {
          offerId: offer.id,
          operatorId: offer.operatorId,
          ipHash,
          userAgent: ua ?? undefined,
          referer: referer ?? undefined
        }
      });
    }
  }

  return new NextResponse(GIF_1x1, {
    headers: {
      "content-type": "image/gif",
      "cache-control": "no-store, max-age=0"
    }
  });
}

