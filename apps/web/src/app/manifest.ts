import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Bonusmax", short_name: "Bonusmax", start_url: "/", display: "standalone",
           background_color: "#ffffff", theme_color: "#ffffff",
           icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] };
}
