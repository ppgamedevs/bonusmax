export const dynamic = "force-dynamic";
export const revalidate = 60;
import type { Metadata } from "next";

type PageParams = { slug: string };

export default async function Page({ params }: { params: PageParams }) {
  const { slug } = params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>S2S: {slug}</h1>
    </main>
  );
}