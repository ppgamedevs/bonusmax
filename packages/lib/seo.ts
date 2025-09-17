// Internal site configuration with sensible defaults; can be overridden from apps
type SiteConfig = {
  name: string;
  description: string;
  baseUrl: string;
  locale: string;
  twitter: string;
  email: string;
};

let SITE: SiteConfig = {
  name: 'Bonusmax',
  description:
    'Bonusuri de casino și pariuri din România — compară ofertele, termeni și condiții, și revendică bonusurile potrivite ție.',
  baseUrl: 'https://bonusmax.ro',
  locale: 'ro-RO',
  twitter: '@bonusmax',
  email: 'contact@bonusmax.ro'
};

export function configureSeo(cfg: Partial<SiteConfig>) {
  SITE = { ...SITE, ...cfg };
}

// Build an absolute URL from a path, based on siteConfig.baseUrl
export function absoluteUrl(path: string = '/'): string {
  const base = SITE.baseUrl.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

// Default metadata for pages, mergeable via overrides
type MetadataLike = Record<string, any>;

export function defaultMetadata(
  overrides: Partial<MetadataLike> = {}
): MetadataLike {
  const base: MetadataLike = {
    metadataBase: new URL(SITE.baseUrl),
    title: {
      default: SITE.name,
      template: '%s | Bonusmax'
    },
    description: SITE.description,
    alternates: {
      canonical: absoluteUrl('/')
    },
    openGraph: {
      type: 'website',
      url: SITE.baseUrl,
      siteName: SITE.name,
      title: SITE.name,
      description: SITE.description,
      locale: SITE.locale
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter,
      creator: SITE.twitter
    },
    // Placeholder for future verification codes
    verification: {}
  };

  return {
    ...base,
    ...overrides,
    // Merge nested objects we care about
    openGraph: { ...base.openGraph, ...overrides.openGraph },
    twitter: { ...base.twitter, ...overrides.twitter },
    alternates: { ...base.alternates, ...overrides.alternates }
  } as MetadataLike;
}

// JSON-LD generators
export function jsonLdOrganization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.baseUrl,
    email: SITE.email,
    sameAs: [] as string[]
  };
}

export function jsonLdWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.baseUrl,
    inLanguage: SITE.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.baseUrl}/cauta?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
