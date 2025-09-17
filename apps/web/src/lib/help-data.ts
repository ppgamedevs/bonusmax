import { ReactNode } from 'react';

export type HelpCategory = {
  id: string;
  title: string;
  slug: string;
  icon: ReactNode;
  description: string;
  topLinks: { title: string; href: string }[];
};

export type HelpArticle = {
  id: string;
  category: string;
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  readMins: number;
  kind: "FAQ" | "Ghid";
  content: string;
};

// Inline SVG icons for categories
const ContIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 20C14.76 20 17 17.76 17 15C17 12.24 14.76 10 12 10C9.24 10 7 12.24 7 15C7 17.76 9.24 20 12 20ZM12 8C15.31 8 18 10.69 18 14C18 15.01 17.75 15.97 17.3 16.8L12 22L6.7 16.8C6.25 15.97 6 15.01 6 14C6 10.69 8.69 8 12 8Z" />
  </svg>
);

const BonusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2ZM12 6.5L13.5 10L17 10.5L13.5 11L12 14.5L10.5 11L7 10.5L10.5 10L12 6.5ZM12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18ZM12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8Z" />
  </svg>
);

const DepuneriIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M21 7h-3V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H3a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM8 6h8v1H8V6zm11 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h6v1a1 1 0 0 0 2 0V9h2v10z" />
  </svg>
);

const TehnicIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.44 9.11-7 10.05-3.56-.94-7-5.22-7-10.05v-4.7l7-3.12zM12 6c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V13h2v-1.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3z" />
  </svg>
);

const LegalIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M12 2L3 7l9 5 9-5-9-5zM3 10v8l9 5 9-5v-8l-9 5-9-5z" />
  </svg>
);

const JocIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Categories
export const helpCategories: HelpCategory[] = [
  {
    id: '1',
    title: 'Cont & Preferințe',
    slug: 'cont-preferinte',
    icon: <ContIcon />,
    description: 'Gestionează contul tău, setările și preferințele.',
    topLinks: [
      { title: 'Cum mă înregistrez?', href: '/help/cont-preferinte/cum-ma-inregistrez' },
      { title: 'Setări notificări', href: '/help/cont-preferinte/setari-notificari' },
      { title: 'Ștergere cont', href: '/help/cont-preferinte/stergere-cont' }
    ]
  },
  {
    id: '2',
    title: 'Bonusuri & WR',
    slug: 'bonusuri-wr',
    icon: <BonusIcon />,
    description: 'Înțelege bonusurile, WR și cum să le folosești.',
    topLinks: [
      { title: 'Ce înseamnă WR?', href: '/help/bonusuri-wr/ce-este-wr' },
      { title: 'Cum revendic un bonus?', href: '/help/bonusuri-wr/cum-revendic-bonus' },
      { title: 'Bonusuri fără depunere', href: '/help/bonusuri-wr/bonusuri-fara-depunere' }
    ]
  },
  {
    id: '3',
    title: 'Depuneri & Retrageri',
    slug: 'depuneri-retrageri',
    icon: <DepuneriIcon />,
    description: 'Metode de plată, timpi și comisioane.',
    topLinks: [
      { title: 'Depuneri cu card', href: '/help/depuneri-retrageri/depuneri-card' },
      { title: 'Retrageri: timpi și limite', href: '/help/depuneri-retrageri/retrageri-timpi' },
      { title: 'Portofele electronice', href: '/help/depuneri-retrageri/portofele-electronice' }
    ]
  },
  {
    id: '4',
    title: 'Tehnic & Securitate',
    slug: 'tehnic-securitate',
    icon: <TehnicIcon />,
    description: 'Securitatea contului și suport tehnic.',
    topLinks: [
      { title: 'Verificarea contului (KYC)', href: '/help/tehnic-securitate/verificare-cont' },
      { title: 'Securitate: 2FA', href: '/help/tehnic-securitate/securitate-2fa' },
      { title: 'Probleme de conectare', href: '/help/tehnic-securitate/probleme-conectare' }
    ]
  },
  {
    id: '5',
    title: 'Legal & Conformitate',
    slug: 'legal-conformitate',
    icon: <LegalIcon />,
    description: 'Condiții legale, ONJN și GDPR.',
    topLinks: [
      { title: 'Condiții ONJN pentru jucători', href: '/help/legal-conformitate/conditii-onjn' },
      { title: 'GDPR și datele tale', href: '/help/legal-conformitate/gdpr' },
      { title: 'Termeni și condiții', href: '/help/legal-conformitate/termeni-conditii' }
    ]
  },
  {
    id: '6',
    title: 'Joc Responsabil',
    slug: 'joc-responsabil',
    icon: <JocIcon />,
    description: 'Joacă responsabil și resurse de ajutor.',
    topLinks: [
      { title: 'Limite de depunere', href: '/help/joc-responsabil/limite-depunere' },
      { title: 'Auto-excludere', href: '/help/joc-responsabil/auto-excludere' },
      { title: 'Resurse de ajutor', href: '/help/joc-responsabil/resurse-ajutor' }
    ]
  }
];

// Articles
export const helpArticles: HelpArticle[] = [
  {
    id: '1',
    category: 'bonusuri-wr',
    slug: 'ce-este-wr',
    title: 'Ce înseamnă WR și cum se calculează?',
    excerpt: 'Află ce reprezintă Wagering Requirement și cum îți afectează bonusurile.',
    updatedAt: '2024-09-10',
    readMins: 3,
    kind: 'Ghid',
    content: `# Ce înseamnă WR și cum se calculează?

## Introducere

WR (Wagering Requirement) este un termen important în lumea bonusurilor de jocuri de noroc. El reprezintă numărul de ori pe care trebuie să pariezi bonusul primit pentru a putea retrage câștigurile obținute din acesta.

## Cum se calculează

Formula de bază este: **WR = Valoarea bonusului × Multiplicatorul WR**

De exemplu, dacă primești un bonus de 100 RON cu WR 20x, trebuie să pariezi 2000 RON în total pentru a îndeplini condiția.

## Exemplu practic

Să spunem că ai un bonus de 100 RON cu WR 20x. Trebuie să pariezi 2000 RON. Dacă ai o cotă medie de 2.0, ai nevoie de 1000 pariuri pentru a îndeplini WR-ul.

## Note importante

- WR-ul se aplică doar bonusului, nu depunerii inițiale.
- Citește întotdeauna termenii și condițiile operatorului.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '2',
    category: 'bonusuri-wr',
    slug: 'cum-revendic-bonus',
    title: 'Cum revendic un bonus fără depunere?',
    excerpt: 'Ghid pas cu pas pentru a revendica bonusuri fără depunere.',
    updatedAt: '2024-09-08',
    readMins: 4,
    kind: 'Ghid',
    content: `# Cum revendic un bonus fără depunere?

## Pasul 1: Înregistrează-te

Înregistrează-te pe site-ul operatorului cu datele tale reale.

## Pasul 2: Confirmă contul

Confirmă adresa de email și numărul de telefon.

## Pasul 3: Revendică bonusul

În secțiunea bonusuri, selectează bonusul fără depunere și apasă pe "Revendică".

## Pasul 4: Joacă

Folosește bonusul în jocurile specificate.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '3',
    category: 'depuneri-retrageri',
    slug: 'depuneri-card',
    title: 'Depuneri cu card vs. portofel electronic',
    excerpt: 'Compară metodele de depunere disponibile.',
    updatedAt: '2024-09-05',
    readMins: 5,
    kind: 'Ghid',
    content: `# Depuneri cu card vs. portofel electronic

## Card bancar

Avantaje: Rapid, acceptat peste tot.
Dezavantaje: Comisioane mai mari, verificare suplimentară.

## Portofel electronic

Avantaje: Anonim, rapid, securizat.
Dezavantaje: Necesită înregistrare separată.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '4',
    category: 'depuneri-retrageri',
    slug: 'retrageri-timpi',
    title: 'Retrageri: timpi și comisioane',
    excerpt: 'Află cât durează retragerile și ce comisioane sunt.',
    updatedAt: '2024-09-03',
    readMins: 3,
    kind: 'FAQ',
    content: `# Retrageri: timpi și comisioane

## Timi de procesare

Card: 1-3 zile lucrătoare.
Portofel electronic: Instant sau 24h.

## Comisioane

Majoritatea operatorilor nu percep comisioane pentru retrageri, dar verifică termenii.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '5',
    category: 'tehnic-securitate',
    slug: 'verificare-cont',
    title: 'Verificarea contului (KYC)',
    excerpt: 'De ce trebuie să verifici contul și cum faci asta.',
    updatedAt: '2024-09-01',
    readMins: 4,
    kind: 'Ghid',
    content: `# Verificarea contului (KYC)

## De ce este necesară

Pentru a respecta reglementările ONJN și pentru securitatea ta.

## Cum se face

Încarcă copie după CI, dovadă de adresă, selfie.

## Cât durează

De obicei 24-48h.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '6',
    category: 'cont-preferinte',
    slug: 'setari-notificari',
    title: 'Setări notificări & alerte bonusuri',
    excerpt: 'Personalizează notificările pentru bonusuri noi.',
    updatedAt: '2024-08-30',
    readMins: 2,
    kind: 'FAQ',
    content: `# Setări notificări & alerte bonusuri

## Cum activez

În setările contului, bifează "Alerte bonusuri".

## Tipuri de notificări

Email, SMS, push.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '7',
    category: 'legal-conformitate',
    slug: 'conditii-onjn',
    title: 'Condiții ONJN pentru jucători',
    excerpt: 'Cerințele legale pentru jocurile de noroc în România.',
    updatedAt: '2024-08-28',
    readMins: 6,
    kind: 'Ghid',
    content: `# Condiții ONJN pentru jucători

## Licențiere

Toți operatorii trebuie să aibă licență ONJN.

## Vârsta minimă

18 ani.

## Joc responsabil

Operatorii trebuie să ofere instrumente pentru joc responsabil.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '8',
    category: 'tehnic-securitate',
    slug: 'securitate-2fa',
    title: 'Securitate: 2FA și sesiunile active',
    excerpt: 'Protejează-ți contul cu autentificare în doi pași.',
    updatedAt: '2024-08-25',
    readMins: 3,
    kind: 'Ghid',
    content: `# Securitate: 2FA și sesiunile active

## Ce este 2FA

Autentificare în doi pași pentru securitate suplimentară.

## Cum activez

În setările de securitate, activează 2FA cu app sau SMS.

## Sesiuni active

Poți vedea și închide sesiunile active din setări.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '9',
    category: 'joc-responsabil',
    slug: 'limite-depunere',
    title: 'Limite de depunere pentru joc responsabil',
    excerpt: 'Cum să setezi limite pentru a juca responsabil.',
    updatedAt: '2024-08-20',
    readMins: 4,
    kind: 'Ghid',
    content: `# Limite de depunere pentru joc responsabil

## De ce limite

Pentru a controla cheltuielile și a evita dependența.

## Cum setezi

În setările contului, stabilește limite zilnice/săptămânale/lunare.

## Modificare

Poți modifica limitele, dar cu perioadă de răcire.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  },
  {
    id: '10',
    category: 'joc-responsabil',
    slug: 'auto-excludere',
    title: 'Auto-excludere și resurse de ajutor',
    excerpt: 'Opțiuni pentru auto-excludere și ajutor profesional.',
    updatedAt: '2024-08-15',
    readMins: 5,
    kind: 'Ghid',
    content: `# Auto-excludere și resurse de ajutor

## Auto-excludere

Poți solicita auto-excludere temporară sau permanentă.

## Resurse de ajutor

JocResponsabil.ro, linie de ajutor 0800 123 456.

## Suport

Contactează operatorul pentru auto-excludere.

Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN. 18+. Joacă responsabil.`
  }
];
