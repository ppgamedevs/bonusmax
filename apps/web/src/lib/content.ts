import React from 'react';
import remarkGfm from 'remark-gfm';
import { compileMDX } from 'next-mdx-remote/rsc';
import mdxComponents from '@/mdx/components';

export type GuideFrontmatter = {
  title: string;
  description?: string;
  date?: string;
  slug: string;
  faqs?: { q: string; a: string }[];
};

// Embedded guides data to avoid file system issues in production
const guidesData = [
  {
    slug: 'bonus-fara-depunere',
    title: 'Bonus fără depunere: cum funcționează + capcane',
    description: 'Ghid simplu despre bonusurile fără depunere: termeni, WR, capcane și cum alegi corect.',
    date: '2025-09-01',
    content: `---
title: 'Bonus fără depunere: cum funcționează + capcane'
description: 'Ghid simplu despre bonusurile fără depunere: termeni, WR, capcane și cum alegi corect.'
date: '2025-09-01'
slug: 'bonus-fara-depunere'
faqs:
  - q: 'Ce înseamnă WR?'
    a: 'Wagering Requirement — de câte ori trebuie rulate sumele înainte de retragere.'
  - q: 'Pot retrage imediat?'
    a: 'Nu. De obicei există WR, perioadă limitată și plafon de cashout.'
---

# Bonus fără depunere: cum funcționează + capcane

<Callout type="info" title="Verifică mereu">
Verifică mereu WR, contribuția jocurilor și plafonul de cashout.
</Callout>

## Ce sunt bonusurile fără depunere?

Bonusurile fără depunere sunt oferte prin care operatorii îți dau bani sau rotiri gratuite fără să depui nimic. Sună prea bine ca să fie adevărat? Ei bine, există câteva capcane importante.

## Lista scurtă de verificat:

- **WR mai mic = mai bine** (sub x30 este decent)
- **Min. depozit mic = accesibil** pentru majoritatea jucătorilor
- **Citește T&C complet** - nu te baza doar pe titlu

## Capcane frecvente

### 1. WR foarte mare
Unii operatori oferă 50 RON bonus cu WR x50. Asta înseamnă că trebuie să rulezi 2.500 RON pentru a putea retrage.

### 2. Contribuția jocurilor
Nu toate jocurile contribuie 100% la WR:
- Sloturi: 100%
- Blackjack: 10-20%
- Ruletă: 10-50%

### 3. Plafon de cashout
Multe bonusuri fără depunere au o limită maximă de retragere (ex. 100 RON), indiferent cât câștigi.

## Cum alegi corect

1. **Compară WR-ul** - sub x30 este rezonabil
2. **Verifică jocurile eligibile** - asigură-te că poți juca ce îți place
3. **Citește plafonul de cashout** - să nu ai surprize
4. **Verifică termenul limită** - de obicei 7-30 zile

<Callout type="warning" title="Atenție">
Bonusurile fără depunere sunt pentru testare, nu pentru câștiguri mari. Joacă responsabil!
</Callout>

<FAQList />`,
    faqs: [
      { q: 'Ce înseamnă WR?', a: 'Wagering Requirement — de câte ori trebuie rulate sumele înainte de retragere.' },
      { q: 'Pot retrage imediat?', a: 'Nu. De obicei există WR, perioadă limitată și plafon de cashout.' },
    ],
  },
  {
    slug: 'rotiri-gratuite',
    title: 'Rotiri gratuite: cum profiți legal',
    description: 'Tot ce trebuie să știi despre free spins: contribuții, RTP, limitări.',
    date: '2025-09-01',
    content: `---
title: 'Rotiri gratuite: cum profiți legal'
description: 'Tot ce trebuie să știi despre free spins: contribuții, RTP, limitări.'
date: '2025-09-01'
slug: 'rotiri-gratuite'
faqs:
  - q: 'Toate sloturile contribuie 100%?'
    a: 'Nu. Unele jocuri au contribuție redusă în WR.'
---

# Rotiri gratuite: cum profiți legal

<Callout type="warning" title="Regula de aur">
Nu urmări pierderile. Stabilește-ți un buget și respectă-l.
</Callout>

## Ce sunt rotirile gratuite?

Rotirile gratuite (free spins) sunt rotiri la sloturi pe care le primești fără să plătești. Pot veni ca bonus de bun venit, promoție sau parte dintr-o ofertă mai mare.

## Tipuri de rotiri gratuite

### 1. Fără depunere
- Primești rotiri doar pentru înregistrare
- De obicei 10-50 rotiri
- WR pe câștiguri: x20-x40

### 2. Cu depunere
- Parte din pachetul de bun venit
- 50-200 rotiri
- WR mai mic: x15-x30

### 3. Rotiri recurente
- Promoții săptămânale
- Pentru jucători activi
- Condiții variabile

## Aspecte importante

### RTP și volatilitate
- **RTP mare** (peste 96%) = șanse mai bune pe termen lung
- **Volatilitate mică** = câștiguri mici dar frecvente
- **Volatilitate mare** = câștiguri rare dar mari

### Contribuția la WR
Nu toate sloturile contribuie 100% la îndeplinirea WR:
- Sloturi populare: 100%
- Sloturi cu jackpot: 50-80%
- Sloturi excluse: 0%

### Valoarea rotirilor
- Rotiri de 0.10 RON = valoare mică
- Rotiri de 1 RON = valoare mare
- Verifică întotdeauna valoarea în T&C

## Strategii pentru maximizarea profitului

1. **Alege sloturi cu RTP mare** (NetEnt, Play'n GO)
2. **Respectă bugetul** - nu depune mai mult pentru rotiri
3. **Citește restricțiile** - unele rotiri sunt doar pe anumite jocuri
4. **Joacă când ai timp** - nu te grăbi să îndeplinești WR

<Callout type="success" title="Sfat pro">
Folosește rotirile gratuite pentru a testa jocuri noi fără risc financiar.
</Callout>

<FAQList />`,
    faqs: [
      { q: 'Toate sloturile contribuie 100%?', a: 'Nu. Unele jocuri au contribuție redusă în WR.' },
      { q: 'Pot alege eu slotul?', a: 'Depinde de ofertă. Unele rotiri sunt pe sloturi specifice.' },
    ],
  },
];

export async function getAllGuides(): Promise<Array<GuideFrontmatter & { file: string }>> {
  return guidesData
    .map((guide) => ({
      title: guide.title,
      description: guide.description,
      date: guide.date,
      slug: guide.slug,
      faqs: guide.faqs,
      file: `${guide.slug}.mdx`,
    }))
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

// Lightweight helper: only read frontmatter/meta without compiling MDX
export async function getGuideFrontmatterBySlug(slug: string) {
  const guideData = guidesData.find(g => g.slug === slug);
  if (!guideData) return null;
  return {
    title: guideData.title,
    description: guideData.description,
    slug: guideData.slug,
    date: guideData.date,
    faqs: guideData.faqs,
  } as GuideFrontmatter;
}

export async function getGuideBySlug(slug: string) {
  const guideData = guidesData.find(g => g.slug === slug);
  if (!guideData) return null;

  const source = guideData.content;

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

  // Strip YAML frontmatter and the first H1 to avoid duplicate page title
  const stripped = source
    .replace(/^---[\s\S]*?---\n?/m, '')
    .replace(/^#\s+.+\n?/, '');

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function simpleRender(md: string) {
    let work = md.trim();

    // Convert Callout blocks to styled divs, preserving inner content
    work = work.replace(/<Callout\s+type="?(\w+)"?\s+title="?([^">]+)"?\s*>([\s\S]*?)<\/Callout>/g,
      (_m, type, title, inner) => {
        const klass = String(type) === 'warning' ? 'border-yellow-300 bg-yellow-50 text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-100' :
                     String(type) === 'success' ? 'border-green-300 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/20 dark:text-green-100' :
                     String(type) === 'error' ? 'border-red-300 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/20 dark:text-red-100' :
                     'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-100';
        // Process inner content without escaping HTML to preserve formatting
        const innerProcessed = String(inner).trim()
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold text
          .replace(/\n\n+/g, '</p><p>') // Paragraph breaks
          .replace(/\n/g, '<br>'); // Line breaks
        const innerHtml = `<p>${innerProcessed}</p>`;
        return `<div class="rounded-xl border p-4 mb-6 ${klass}">`+
               `<div class="font-semibold mb-3 flex items-center gap-2">`+
               `<span class="inline-block w-2 h-2 rounded-full bg-current opacity-60"></span>`+
               `${escapeHtml(title)}</div>`+
               `<div class="text-sm leading-relaxed">${innerHtml}</div></div>`;
      }
    );

    // Remove FAQList component (render FAQs separately below if present)
    let html = work.replace(/<FAQList\s*\/>/g, '');

    // Headings with better styling
    html = html.replace(/^###\s+(.+)$/gm, (_m, t) => {
      const id = slugifyHeading(String(t).trim());
      return `<h3 id="${id}" class="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4 scroll-mt-20">${escapeHtml(String(t).trim())}</h3>`;
    });
    html = html.replace(/^##\s+(.+)$/gm, (_m, t) => {
      const id = slugifyHeading(String(t).trim());
      return `<h2 id="${id}" class="text-2xl font-bold text-neutral-900 dark:text-white mt-10 mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-700 scroll-mt-20">${escapeHtml(String(t).trim())}</h2>`;
    });

    // Lists with better styling
    html = html.replace(/(^-\s+.+(?:\n-\s+.+)*)/gm, (block) => {
      const items = block.split('\n').map(l => l.replace(/^-\s+/, '').trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
      return `<ul class="space-y-2 my-4 pl-6">${items.map(it => `<li class="relative"><span class="absolute -left-6 top-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>${it}</li>`).join('')}</ul>`;
    });

    // Bold text
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-neutral-900 dark:text-white">$1</strong>');

    // Paragraphs: wrap leftover lines into paragraphs with better styling
    html = html
      .split(/\n\n+/)
      .map(chunk => {
        if (/<h\d|<ul|<div/.test(chunk)) return chunk;
        const processed = chunk.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-neutral-900 dark:text-white">$1</strong>');
        return `<p class="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">${processed}</p>`;
      })
      .join('');

    return html;
  }

  // Prefer MDX for clean formatting; fall back to simple renderer on error
  const forceSimple = slug === 'rotiri-gratuite';
  try {
    if (forceSimple) throw new Error('force-simple-renderer');
    const { content, frontmatter } = await compileMDX<GuideFrontmatter>({
      source: stripped,
      options: { parseFrontmatter: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
      components: mdxComponents,
    });
    return { content, frontmatter: {
      title: guideData.title,
      description: guideData.description,
      date: guideData.date,
      slug: guideData.slug,
      faqs: guideData.faqs,
    }, headings };
  } catch (err) {
    console.error('[guides] MDX compile failed (fallback to simple renderer):', slug, err);
    const html = simpleRender(stripped);
    const contentEl = React.createElement('div', {
      className: 'prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-neutral-200 dark:prose-h2:border-neutral-700 prose-h3:text-xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4 prose-strong:font-semibold prose-strong:text-neutral-900 dark:prose-strong:text-white prose-ul:space-y-2 prose-ul:my-4 prose-li:relative',
      dangerouslySetInnerHTML: { __html: html },
    });
    const frontmatter: GuideFrontmatter = {
      title: guideData.title,
      description: guideData.description,
      date: guideData.date,
      slug: guideData.slug,
      faqs: guideData.faqs,
    };
    return { content: contentEl, frontmatter, headings };
  }
}
