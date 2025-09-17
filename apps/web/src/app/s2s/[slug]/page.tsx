export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>S2S: {slug}</h1>
      <p>Temporary stub page.</p>
    </main>
  );
}