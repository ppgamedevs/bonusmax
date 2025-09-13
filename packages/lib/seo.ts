export type SeoInput = {
  title?: string;
  description?: string;
  canonical?: string;
};

export function buildSeo({ title, description, canonical }: SeoInput) {
  const ogTitle = title ?? 'Bonusmax – Top bonusuri';
  const ogDescription = description ?? 'Bonusuri și oferte – Coming soon';
  const canonicalUrl = canonical ?? 'https://www.bonusmax.ro';

  return { ogTitle, ogDescription, canonical: canonicalUrl };
}
