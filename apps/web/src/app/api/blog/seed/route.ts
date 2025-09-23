import { NextResponse } from 'next/server';
import { prisma } from '@bonusmax/lib';

// Seed sample blog posts with dates spread over the last 30 days.
// Protect with a simple shared secret to avoid accidental public seeding.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const qp = (url.searchParams.get('key') || '').trim();
  const auth = (req.headers.get('authorization') || '').trim();
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const provided = qp || bearer;
  const secret = (process.env.BLOG_SEED_SECRET || process.env.NEXT_PUBLIC_BLOG_SEED_SECRET || '').trim();
  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const tagsets = {
    WR: ['WR'],
    Bonusuri: ['Bonusuri'],
    Retrageri: ['Retrageri'],
    Securitate: ['Securitate'],
    Joc: ['Joc responsabil'],
  } as const;

  const samples = [
    {
      slug: 'wr-explicat-pe-intelesul-tuturor',
      title: 'WR explicat pe înțelesul tuturor',
      excerpt: 'Ce este Wagering Requirement și cum îți influențează șansele la retragere.',
      html: `<h2>Ce este WR?</h2><p>WR înseamnă de câte ori trebuie rulat bonusul înainte de retragere.</p><p>Exemplu: bonus 100 RON cu WR x20 => rulat 2000 RON.</p>`,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.WR,
      publishedAt: daysAgo(2),
    },
    {
      slug: 'bonusuri-fara-depunere-septembrie',
      title: 'Bonusuri fără depunere – selecția lunii',
      excerpt: 'Rotiri gratuite și oferte verificate de la operatori licențiați.',
      html: `<p>Am strâns pentru tine cele mai bune oferte fără depunere, verificate și actualizate.</p>`,
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Bonusuri,
      publishedAt: daysAgo(4),
    },
    {
      slug: 'retragere-rapida-ce-trebuie-sa-stii',
      title: 'Retragere rapidă: ce trebuie să știi',
      excerpt: 'Timpi tipici, verificări KYC și recomandări pentru plăți fără bătăi de cap.',
      html: `<ul><li>Card: 1–3 zile</li><li>Portofel electronic: instant – 24h</li></ul>`,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Retrageri,
      publishedAt: daysAgo(6),
    },
    {
      slug: 'securitate-2fa-obligatoriu',
      title: 'Securitate: 2FA este obligatoriu',
      excerpt: 'Activează autentificarea în doi pași pentru a-ți proteja contul și fondurile.',
      html: `<p>2FA reduce semnificativ riscul de acces neautorizat. Activează-l din setările contului.</p>`,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Securitate,
      publishedAt: daysAgo(8),
    },
    {
      slug: 'ghid-limite-de-depunere',
      title: 'Ghid: limite de depunere pentru joc responsabil',
      excerpt: 'Setează-ți limite realiste și joacă în siguranță.',
      html: `<p>Limitele te ajută să îți controlezi bugetul. Alege zilnic/săptămânal/lunar.</p>`,
      image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Joc,
      publishedAt: daysAgo(10),
    },
    {
      slug: 'wr-cum-alegi-ofera-cu-wr-mic',
      title: 'Cum alegi oferte cu WR mic',
      excerpt: 'Criterii de selecție și capcane frecvente.',
      html: `<p>Uită-te la multiplicator, contribuția jocurilor și valabilitate.</p>`,
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.WR,
      publishedAt: daysAgo(12),
    },
    {
      slug: 'bonusuri-rotiri-gratuite-ghid',
      title: 'Rotiri gratuite: ghid esențial',
      excerpt: 'Cum funcționează, ce jocuri sunt eligibile și ce condiții apar.',
      html: `<p>Rotirile gratuite pot avea WR pe câștig. Vezi jocurile eligibile în T&C.</p>`,
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Bonusuri,
      publishedAt: daysAgo(14),
    },
    {
      slug: 'retragere-pe-card-vs-portofel',
      title: 'Retragere pe card vs. portofel electronic',
      excerpt: 'Comisioane, timp și situații în care merită fiecare.',
      html: `<table><tr><th>Metodă</th><th>Timp</th></tr><tr><td>Card</td><td>1–3 zile</td></tr><tr><td>Portofel</td><td>Instant–24h</td></tr></table>`,
      image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Retrageri,
      publishedAt: daysAgo(16),
    },
    {
      slug: 'securitate-parole-bune-2fa',
      title: 'Securitate: parole bune + 2FA',
      excerpt: 'Combinația care îți protejează contul.',
      html: `<p>Folosește parole unice și activează 2FA. Nu reutiliza parole.</p>`,
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Securitate,
      publishedAt: daysAgo(18),
    },
    {
      slug: 'joc-responsabil-ghid-rapid',
      title: 'Joc responsabil: ghid rapid',
      excerpt: 'Setează limite, urmărește-ți timpul, joacă pentru divertisment.',
      html: `<ul><li>Setează limite</li><li>Ține evidența</li><li>Evită să joci când ești supărat</li></ul>`,
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Joc,
      publishedAt: daysAgo(20),
    },
    {
      slug: 'wr-exemple-calcule',
      title: 'WR: exemple și calcule',
      excerpt: 'Cazuri concrete ca să înțelegi mai ușor.',
      html: `<p>Bonus 150 RON cu WR x25 => 3750 RON de rulat. Jocuri cu contribuție 20% cresc efortul.</p>`,
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.WR,
      publishedAt: daysAgo(22),
    },
    {
      slug: 'bonusuri-termeni-de-evitat',
      title: 'Bonusuri: termeni de evitat',
      excerpt: 'Ce condiții pot reduce valoarea bonusului.',
      html: `<p>Ferește-te de WR foarte mare, contribuție mică sau valabilitate scurtă.</p>`,
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Bonusuri,
      publishedAt: daysAgo(24),
    },
    {
      slug: 'retragere-prima-data-kyc',
      title: 'Prima retragere: KYC și verificări',
      excerpt: 'Ce documente se cer și de ce.',
      html: `<p>CI, dovadă adresă, uneori selfie. Procesează mai repede cu poze clare.</p>`,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Retrageri,
      publishedAt: daysAgo(26),
    },
  ];

  const created: string[] = [];

  for (const s of samples) {
    // Upsert by slug; set status APPROVED to show up on the blog list
    const item = await (prisma as any).feedItem.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        html: s.html,
        image: s.image || null,
        status: 'APPROVED',
        publishedAt: s.publishedAt,
        updatedAt: s.publishedAt,
        url: `/blog/${s.slug}`,
      },
      update: {
        title: s.title,
        excerpt: s.excerpt,
        html: s.html,
        image: s.image || null,
        status: 'APPROVED',
        publishedAt: s.publishedAt,
        updatedAt: s.publishedAt,
        url: `/blog/${s.slug}`,
      },
    });
    // Associate tags via Tag and FeedItemTag relations
    const tagNames: string[] = ((s as any).tags || []) as string[];
    for (const tagName of tagNames) {
      const slug = tagName.toString().trim().toLowerCase().replace(/\s+/g, '-');
      const tag = await (prisma as any).tag.upsert({
        where: { slug },
        create: { slug, name: tagName },
        update: {},
      });
      await (prisma as any).feedItemTag.upsert({
        where: { feedItemId_tagId: { feedItemId: item.id, tagId: tag.id } },
        create: { feedItemId: item.id, tagId: tag.id },
        update: {},
      });
    }
    created.push(s.slug);
  }

  return NextResponse.json({ ok: true, created });
}
