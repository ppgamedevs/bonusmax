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
      html: `<h2>Ce este WR (Wagering Requirement)?</h2>
<p>Wagering Requirement (WR) reprezintă numărul de ori pe care trebuie să rulezi bonusul primit înainte să poți retrage câștigurile obținute din acesta. Este una dintre cele mai importante condiții pe care trebuie să le înțelegi când revendici un bonus de casino.</p>

<h3>Cum funcționează WR în practică</h3>
<p>Să luăm un exemplu concret: primești un bonus de 100 RON cu WR x20. Aceasta înseamnă că trebuie să pariezi în total 2.000 RON (100 RON × 20) înainte să poți retrage câștigurile.</p>

<h3>Tipuri de WR</h3>
<ul>
<li><strong>WR pe bonus</strong> - rulezi doar suma bonusului</li>
<li><strong>WR pe bonus + depunere</strong> - rulezi atât bonusul cât și depunerea ta</li>
<li><strong>WR progresiv</strong> - se reduce pe măsură ce joci</li>
</ul>

<h3>Contribuția jocurilor la WR</h3>
<p>Nu toate jocurile contribuie la fel la îndeplinirea WR:</p>
<ul>
<li><strong>Sloturi</strong>: 100% contribuție</li>
<li><strong>Blackjack</strong>: 10-20% contribuție</li>
<li><strong>Ruletă</strong>: 10-50% contribuție</li>
<li><strong>Baccarat</strong>: 10% contribuție</li>
</ul>

<h3>Sfaturi pentru gestionarea WR</h3>
<ol>
<li>Citește întotdeauna termenii și condițiile</li>
<li>Calculează timpul necesar pentru îndeplinire</li>
<li>Verifică contribuția jocurilor preferate</li>
<li>Nu depăși niciodată bugetul stabilit</li>
<li>Joacă responsabil și nu te grăbi</li>
</ol>

<h3>Capcane frecvente</h3>
<p>Atenție la aceste aspecte care pot complica îndeplinirea WR:</p>
<ul>
<li>Limita maximă de pariu pe rundă</li>
<li>Jocurile restricționate</li>
<li>Termenul limită pentru îndeplinire</li>
<li>Limita maximă de retragere din bonus</li>
</ul>

<p>Înțelegerea WR te ajută să faci alegeri informate și să te bucuri de bonusuri fără surprize neplăcute.</p>`,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.WR,
      publishedAt: daysAgo(2),
    },
    {
      slug: 'bonusuri-fara-depunere-septembrie',
      title: 'Bonusuri fără depunere – selecția lunii',
      excerpt: 'Rotiri gratuite și oferte verificate de la operatori licențiați.',
      html: `<h2>Ce sunt bonusurile fără depunere?</h2>
<p>Bonusurile fără depunere sunt oferte speciale prin care operatorii îți oferă bani sau rotiri gratuite fără să fie necesar să faci o depunere. Acestea reprezintă o modalitate excelentă de a testa un casino nou fără niciun risc financiar.</p>

<h3>Tipuri de bonusuri fără depunere</h3>
<ul>
<li><strong>Bani bonus fără depunere</strong> - între 10-50 RON</li>
<li><strong>Rotiri gratuite</strong> - de obicei 10-100 rotiri</li>
<li><strong>Timp de joc gratuit</strong> - 30-60 minute de joc</li>
<li><strong>Cashback fără depunere</strong> - returnarea unei părți din pierderi</li>
</ul>

<h3>Cum obții bonusuri fără depunere</h3>
<ol>
<li><strong>Înregistrare</strong> - majoritatea se oferă la crearea contului</li>
<li><strong>Verificare email/telefon</strong> - unii operatori cer confirmarea datelor</li>
<li><strong>Cod bonus</strong> - introdu codul special în cont</li>
<li><strong>Contact suport</strong> - uneori trebuie să contactezi echipa de suport</li>
</ol>

<h3>Selecția lunii septembrie 2024</h3>
<h4>🎰 Top 5 bonusuri fără depunere verificate:</h4>
<ol>
<li><strong>Betano</strong> - 50 RON bonus fără depunere (WR x30)</li>
<li><strong>Superbet</strong> - 40 rotiri gratuite la Book of Dead</li>
<li><strong>Netbet</strong> - 25 RON + 25 rotiri gratuite</li>
<li><strong>Unibet</strong> - 100 rotiri gratuite la Starburst</li>
<li><strong>Winbet</strong> - 30 RON bonus fără depunere</li>
</ol>

<h3>Termeni și condiții importante</h3>
<ul>
<li><strong>Wagering Requirement</strong> - de obicei între x20-x50</li>
<li><strong>Contribuția jocurilor</strong> - sloturi 100%, jocuri de masă 10-20%</li>
<li><strong>Limita maximă de retragere</strong> - între 100-500 RON</li>
<li><strong>Termenul de valabilitate</strong> - 7-30 zile</li>
<li><strong>Jocuri restricționate</strong> - unele sloturi pot fi excluse</li>
</ul>

<h3>Strategii pentru maximizarea câștigurilor</h3>
<ol>
<li>Alege bonusuri cu WR mic (sub x30)</li>
<li>Joacă pe sloturi cu RTP mare (peste 96%)</li>
<li>Respectă limita maximă de pariu</li>
<li>Citește întotdeauna termenii și condițiile</li>
<li>Nu depăși niciodată bugetul personal</li>
</ol>

<h3>Sfaturi pentru începători</h3>
<p>Dacă ești nou în lumea cazinourilor online, bonusurile fără depunere sunt perfecte pentru a începe. Îți permit să înveți regulile jocurilor, să testezi diferite strategii și să te familiarizezi cu platforma fără să riști banii tăi.</p>

<p><strong>Atenție:</strong> Toate ofertele sunt valabile doar pentru jucătorii noi, cu vârsta de minimum 18 ani, și sunt supuse termenilor și condițiilor operatorului.</p>`,
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
      tags: tagsets.Bonusuri,
      publishedAt: daysAgo(4),
    },
    {
      slug: 'retragere-rapida-ce-trebuie-sa-stii',
      title: 'Retragere rapidă: ce trebuie să știi',
      excerpt: 'Timpi tipici, verificări KYC și recomandări pentru plăți fără bătăi de cap.',
      html: `<h2>Ghid complet pentru retrageri rapide</h2>
<p>Retragerile rapide sunt unul dintre aspectele cele mai importante când alegi un casino online. Nimeni nu vrea să aștepte săptămâni întregi pentru a-și primi câștigurile. Iată tot ce trebuie să știi pentru retrageri fără probleme.</p>

<h3>Timpi de procesare pe metode de plată</h3>
<h4>🏦 Metode bancare tradiționale:</h4>
<ul>
<li><strong>Card bancar (Visa/Mastercard)</strong>: 1–3 zile lucrătoare</li>
<li><strong>Transfer bancar</strong>: 3–5 zile lucrătoare</li>
<li><strong>Virament SEPA</strong>: 1–2 zile lucrătoare</li>
</ul>

<h4>💳 Portofele electronice (recomandate):</h4>
<ul>
<li><strong>Skrill</strong>: Instant – 24 ore</li>
<li><strong>Neteller</strong>: Instant – 24 ore</li>
<li><strong>PayPal</strong>: Instant – 2 ore</li>
<li><strong>Revolut</strong>: Instant – 4 ore</li>
</ul>

<h4>🪙 Criptomonede:</h4>
<ul>
<li><strong>Bitcoin</strong>: 10-60 minute</li>
<li><strong>Ethereum</strong>: 5-30 minute</li>
<li><strong>Litecoin</strong>: 2-15 minute</li>
</ul>

<h3>Procesul de verificare KYC</h3>
<p>Înainte de prima retragere, majoritatea cazinourilor cer verificarea identității (KYC - Know Your Customer):</p>

<h4>Documente necesare:</h4>
<ol>
<li><strong>Carte de identitate sau pașaport</strong> - față și verso</li>
<li><strong>Dovada adresei</strong> - factură utilități (max 3 luni)</li>
<li><strong>Dovada metodei de plată</strong> - screenshot card/cont bancar</li>
<li><strong>Selfie cu documentul</strong> - în unele cazuri</li>
</ol>

<h4>Sfaturi pentru verificare rapidă:</h4>
<ul>
<li>Trimite poze clare, în rezoluție mare</li>
<li>Asigură-te că toate colțurile documentului sunt vizibile</li>
<li>Nu folosi flash-ul (poate crea reflexii)</li>
<li>Verifică că textul este lizibil</li>
</ul>

<h3>Factori care influențează viteza retragerilor</h3>
<h4>⚡ Accelerează procesul:</h4>
<ul>
<li>Cont verificat complet</li>
<li>Folosirea aceleiași metode ca la depunere</li>
<li>Retrageri în ore de program (9-17)</li>
<li>Sume sub limitele zilnice</li>
<li>Istoric de joc curat</li>
</ul>

<h4>🐌 Întârzie procesul:</h4>
<ul>
<li>Prima retragere (verificări suplimentare)</li>
<li>Sume mari (peste 5.000 RON)</li>
<li>Weekend-uri și sărbători</li>
<li>Documente incomplete sau neclare</li>
<li>Activitate suspectă pe cont</li>
</ul>

<h3>Limite de retragere</h3>
<table>
<tr><th>Operator</th><th>Limită zilnică</th><th>Limită lunară</th></tr>
<tr><td>Betano</td><td>10.000 RON</td><td>50.000 RON</td></tr>
<tr><td>Superbet</td><td>5.000 RON</td><td>25.000 RON</td></tr>
<tr><td>Unibet</td><td>15.000 RON</td><td>75.000 RON</td></tr>
</table>

<h3>Comisioane și taxe</h3>
<p>Majoritatea operatorilor licențiați ONJN nu percep comisioane pentru retrageri, dar verifică întotdeauna termenii:</p>
<ul>
<li><strong>Retrageri gratuite</strong>: 1-3 pe lună</li>
<li><strong>Comision după limită</strong>: 2-5% din sumă</li>
<li><strong>Taxe bancare</strong>: pot fi percepute de bancă</li>
</ul>

<h3>Probleme frecvente și soluții</h3>
<h4>🚫 Retragerea a fost refuzată:</h4>
<ul>
<li>Verifică dacă ai îndeplinit WR-ul bonusului</li>
<li>Confirmă că documentele sunt valide</li>
<li>Contactează suportul pentru detalii</li>
</ul>

<h4>⏰ Retragerea întârzie:</h4>
<ul>
<li>Verifică statusul în contul tău</li>
<li>Contactează suportul după 48 ore</li>
<li>Păstrează dovezile comunicării</li>
</ul>

<p><strong>Sfat important:</strong> Alege întotdeauna operatori licențiați ONJN pentru siguranța fondurilor tale și respectarea termenelor de plată.</p>`,
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
        html: (s as any).html || null,
        image: s.image || null,
        status: 'APPROVED',
        publishedAt: s.publishedAt,
        updatedAt: s.publishedAt,
        url: `/blog/${s.slug}`,
      },
      update: {
        title: s.title,
        excerpt: s.excerpt,
        html: (s as any).html || null,
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
