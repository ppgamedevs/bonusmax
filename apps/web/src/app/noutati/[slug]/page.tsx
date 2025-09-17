export default async function Page({ params }: { params: { slug: string } }) {
  const __p = await params as any;

  const { slug } = __p;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1>Noutăți: {slug}</h1>
      <p>Temporary stub page.</p>
    </main>
  );
}