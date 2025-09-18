export const dynamic = "force-dynamic";
export const revalidate = 60;
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>Go: {id}</h1>
    </main>
  );
}
