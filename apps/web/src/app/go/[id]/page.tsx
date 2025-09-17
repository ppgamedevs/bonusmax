export default async function Page({ params }: { params: { id: string } }) {
  const __p = await params as any;

  const { id } = __p;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>Go: {id}</h1>
      <p>Temporary stub page.</p>
    </main>
  );
}