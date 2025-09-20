export const dynamic = "force-dynamic";
export const revalidate = 60;
export const runtime = 'nodejs';
import { ImageResponse } from "next/og";
import { getOfferById } from './../../../../../../packages/lib/db/queries';
const size = { width: 1200, height: 630 };
const contentType = "image/png";

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
