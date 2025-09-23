import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import { compileMDX } from 'next-mdx-remote/rsc';

const CONTENT_DIR = path.join(process.cwd(), '../../packages/content/ghiduri');

export type GuideFrontmatter = {
  title: string;
  description?: string;
  date?: string;
  slug: string;
  faqs?: { q: string; a: string }[];
};

export async function getAllGuides(): Promise<Array<GuideFrontmatter & { file: string }>> {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      const { data } = matter(raw);
      const fm = data as GuideFrontmatter;
      return { ...fm, file };
    })
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

export async function getGuideBySlug(slug: string) {
  const file = fs.readdirSync(CONTENT_DIR).find((f) => f.endsWith('.mdx') && f.includes(slug));
  if (!file) return null;
  const source = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');

  function slugifyHeading(t: string) {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9ăâîșțĂÂÎȘȚ -]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  function extractHeadings(md: string) {
    const lines = md.split('\n');
    const hs: { level: 2 | 3; text: string; id: string }[] = [];
    for (const line of lines) {
      const m2 = /^##\s+(.+)$/.exec(line);
      const m3 = /^###\s+(.+)$/.exec(line);
      if (m2) {
        const text = m2[1].trim();
        hs.push({ level: 2, text, id: slugifyHeading(text) });
      }
      if (m3) {
        const text = m3[1].trim();
        hs.push({ level: 3, text, id: slugifyHeading(text) });
      }
    }
    return hs;
  }
  const headings = extractHeadings(source);

  const { content, frontmatter } = await compileMDX<GuideFrontmatter>({
    source,
    options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
    components: (await import('../app/mdx/components')).default,
  });

  return { content, frontmatter, headings };
}
