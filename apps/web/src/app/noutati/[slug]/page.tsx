import type { Metadata } from "next";

type PageParams = Promise<{ slug: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const { slug } = await params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>Noutati: {slug}</h1>
    </main>
  );
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Noutati: ${slug}` };
}