import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type Guide = {
  slug: string;
  title: string;
  description?: string;
  updatedAt?: string;
  headings: { depth: number; text: string; id: string }[];
  source: string;
};

// Resolve from apps/web working directory to monorepo packages/content/ghiduri
const DIR = path.join(process.cwd(), '../../packages/content/ghiduri');

export function getAllGuidesMeta(): Array<
  Pick<Guide, 'slug' | 'title' | 'description' | 'updatedAt'>
> {
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')) : [];
  return files
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
      const { data } = matter(raw);
      return {
        slug,
        title: (data as any).title || slug,
        description: (data as any).description || '',
        updatedAt: (data as any).updatedAt || (data as any).date || '',
      };
    })
    .sort((a, b) => {
      const ad = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bd = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bd - ad;
    });
}

export function loadGuide(slug: string): Guide {
  const file = path.join(DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const headings = Array.from(content.matchAll(/^(\#{2,3})\s+(.+)$/gm)).map((m) => {
    const depth = (m[1] as string).length;
    const text = (m[2] as string).trim();
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return { depth, text, id };
  });
  // Add anchors to h2/h3
  const source = content.replace(/^(\#{2,3}\s+)(.+)$/gm, (_: string, h: string, t: string) => {
    const id = t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${h}<a id="${id}"></a>${t}`;
  });
  return {
    slug,
    title: (data as any).title || slug,
    description: (data as any).description || '',
    updatedAt: (data as any).updatedAt || (data as any).date || '',
    headings,
    source,
  };
}
