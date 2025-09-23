export default function JsonLdFaq({ qa }: { qa: { q: string; a: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'ro-RO',
    mainEntity: qa.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  } as const;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
