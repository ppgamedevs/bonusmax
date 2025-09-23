import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@bonusmax/lib';
import { helpArticles, helpCategories } from '@/lib/help-data';
import { getAllGuides } from '@/lib/content';
import { prisma } from '@bonusmax/lib';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/help'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/ghiduri'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: absoluteUrl('/blog'), lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/politica-confidentialitate'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/termeni-si-conditii'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/noutati'), lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Help categories
  urls.push(
    ...helpCategories.map((c) => ({
      url: absoluteUrl(`/help/${c.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  // Help articles
  urls.push(
    ...helpArticles.map((a) => ({
      url: absoluteUrl(`/help/${a.category}/${a.slug}`),
      lastModified: new Date(a.updatedAt || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // MDX Guides (ghiduri)
  try {
    const guides = await getAllGuides();
    urls.push(
      ...guides.map((g) => ({
        url: absoluteUrl(`/ghiduri/${g.slug}`),
        lastModified: g.date ? new Date(g.date) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    );
  } catch {}

  // Blog posts (from DB)
  try {
    const posts = await (prisma as any).feedItem.findMany({
      where: { status: 'APPROVED' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    });
    urls.push(
      ...posts.map((p: any) => ({
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: new Date(p.updatedAt || p.publishedAt || now),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    );
  } catch {}

  return urls;
}
