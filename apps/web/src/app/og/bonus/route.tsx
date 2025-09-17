export const runtime = 'nodejs';
import 'server-only';
import 'server-only';
import { ImageResponse } from "next/og";
import { getOfferById } from '@bonusmax/lib/offers';
export const alt = "Bonus OG";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });
  const offer = await getOfferById(id);
  const title = offer?.title ?? "Bonus";
  const op = offer?.operator?.name ?? "Operator";
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0b0b",
          color: "white",
          padding: "64px",
          fontSize: 48
        }}
      >
        <div style={{ opacity: 0.7, fontSize: 28 }}>Bonusmax</div>
        <div style={{ marginTop: 16, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 12, fontSize: 28, opacity: 0.85 }}>{op}</div>
      </div>
    ),
    { ...size }
  );
}
