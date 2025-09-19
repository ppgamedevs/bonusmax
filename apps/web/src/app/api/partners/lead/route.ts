export const dynamic = "force-static";
export const revalidate = false;
import { NextResponse } from "next/server";
import { prisma } from "@bonusmax/lib";
import { hashIp, scoreLead, verifyForm } from "@/lib/partners";
import { headers } from "next/headers";

async function notifySlack(payload: any) {
  const url = process.env.PARTNERS_SLACK_WEBHOOK;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `New B2B lead: ${payload.companyName} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${payload.email} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ budget: ${payload.monthlyBudget || "-"} RON ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ goal: ${payload.goal}`,
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const h = headers() as any;
  const ua = h.get("user-agent");
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "0.0.0.0";

  const body = (await req.json().catch(() => null)) as any;
  if (!body?.email || !body?.companyName)
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });

  // anti-spam
  if (!verifyForm(body.hp, body.ca, body.cb, body.cc))
    return NextResponse.json({ ok: false, error: "captcha" }, { status: 400 });

  const monthlyBudget = body.monthlyBudget ? Number(body.monthlyBudget) : null;
  const goal = String(body.goal || "SPONSORED");
  const score = scoreLead({ monthlyBudget, goal, website: body.website, onjnLicenseId: body.onjnLicenseId });

  const lead = await (prisma as any).partnerLead.create({
    data: {
      companyName: String(body.companyName),
      contactName: body.contactName || null,
      email: String(body.email),
      phone: body.phone || null,
      website: body.website || null,
      country: "RO",
      onjnLicenseId: body.onjnLicenseId || null,
      monthlyBudget: monthlyBudget || null,
      goal: goal as any,
      message: body.message || null,
      source: "landing",
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      score,
      stage: "NEW",
      priority: 100 - Math.min(score, 99),
      ipHash: hashIp(String(ip), ua),
      lastTouchAt: new Date(),
    },
  });

  if (body.slot && body.startAt && body.endAt) {
    await (prisma as any).slotReservation.create({
      data: {
        leadId: lead.id,
        slot: String(body.slot) as any,
        country: "RO",
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        quotedPrice: body.quotedPrice ? Number(body.quotedPrice) : null,
        status: "PENDING",
      },
    });
  }

  await notifySlack(lead);

  return NextResponse.json({ ok: true, id: lead.id, score });
}
