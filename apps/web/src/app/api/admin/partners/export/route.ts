export const dynamic = "force-static";
export const revalidate = false;
import { prisma } from "@bonusmax/lib";
import { NextResponse } from "next/server";

function ok(url: URL) {
  return !!process.env.ADMIN_KEY && url.searchParams.get("key") === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!ok(url)) return new NextResponse("Unauthorized", { status: 401 });
  const stage = url.searchParams.get("stage") || "";
  const rows = await (prisma as any).partnerLead.findMany({
    where: stage ? ({ stage } as any) : {},
    orderBy: [{ createdAt: "desc" }],
    take: 2000,
  });
  const head = [
    "companyName",
    "contactName",
    "email",
    "phone",
    "website",
    "goal",
    "monthlyBudget",
    "score",
    "stage",
    "message",
  ].join(",");
  const lines = rows.map(
    (r: any) =>
      [
        r.companyName,
        r.contactName || "",
        r.email,
        r.phone || "",
        r.website || "",
        r.goal,
        r.monthlyBudget ?? "",
        r.score,
        r.stage,
        String(r.message || "").replace(/[\r\n,]+/g, ";"),
      ].join(",")
  );
  return new NextResponse([head, ...lines].join("\n"), {
    headers: {
      "content-type": "text/csv",
      "content-disposition": "attachment; filename=partners.csv",
    },
  });
}
