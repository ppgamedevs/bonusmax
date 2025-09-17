export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>Go: {id}</h1>
      <p>Temporary stub page.</p>
    </main>
  );
}