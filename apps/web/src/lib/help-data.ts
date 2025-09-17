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
    title: 'Cont & PreferinÃˆâ€ºe',
    slug: 'cont-preferinte',
    icon: <ContIcon />,
    description: 'GestioneazÃ„Æ’ contul tÃ„Æ’u, setÃ„Æ’rile Ãˆâ„¢i preferinÃˆâ€ºele.',
    topLinks: [
      { title: 'Cum mÃ„Æ’ ÃƒÂ®nregistrez?', href: '/help/cont-preferinte/cum-ma-inregistrez' },
      { title: 'SetÃ„Æ’ri notificÃ„Æ’ri', href: '/help/cont-preferinte/setari-notificari' },
      { title: 'ÃˆËœtergere cont', href: '/help/cont-preferinte/stergere-cont' }
    ]
  },
  {
    id: '2',
    title: 'Bonusuri & WR',
    slug: 'bonusuri-wr',
    icon: <BonusIcon />,
    description: 'ÃƒÅ½nÃˆâ€ºelege bonusurile, WR Ãˆâ„¢i cum sÃ„Æ’ le foloseÃˆâ„¢ti.',
    topLinks: [
      { title: 'Ce ÃƒÂ®nseamnÃ„Æ’ WR?', href: '/help/bonusuri-wr/ce-este-wr' },
      { title: 'Cum revendic un bonus?', href: '/help/bonusuri-wr/cum-revendic-bonus' },
      { title: 'Bonusuri fÃ„Æ’rÃ„Æ’ depunere', href: '/help/bonusuri-wr/bonusuri-fara-depunere' }
    ]
  },
  {
    id: '3',
    title: 'Depuneri & Retrageri',
    slug: 'depuneri-retrageri',
    icon: <DepuneriIcon />,
    description: 'Metode de platÃ„Æ’, timpi Ãˆâ„¢i comisioane.',
    topLinks: [
      { title: 'Depuneri cu card', href: '/help/depuneri-retrageri/depuneri-card' },
      { title: 'Retrageri: timpi Ãˆâ„¢i limite', href: '/help/depuneri-retrageri/retrageri-timpi' },
      { title: 'Portofele electronice', href: '/help/depuneri-retrageri/portofele-electronice' }
    ]
  },
  {
    id: '4',
    title: 'Tehnic & Securitate',
    slug: 'tehnic-securitate',
    icon: <TehnicIcon />,
    description: 'Securitatea contului Ãˆâ„¢i suport tehnic.',
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
    description: 'CondiÃˆâ€ºii legale, ONJN Ãˆâ„¢i GDPR.',
    topLinks: [
      { title: 'CondiÃˆâ€ºii ONJN pentru jucÃ„Æ’tori', href: '/help/legal-conformitate/conditii-onjn' },
      { title: 'GDPR Ãˆâ„¢i datele tale', href: '/help/legal-conformitate/gdpr' },
      { title: 'Termeni Ãˆâ„¢i condiÃˆâ€ºii', href: '/help/legal-conformitate/termeni-conditii' }
    ]
  },
  {
    id: '6',
    title: 'Joc Responsabil',
    slug: 'joc-responsabil',
    icon: <JocIcon />,
    description: 'JoacÃ„Æ’ responsabil Ãˆâ„¢i resurse de ajutor.',
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
    title: 'Ce ÃƒÂ®nseamnÃ„Æ’ WR Ãˆâ„¢i cum se calculeazÃ„Æ’?',
    excerpt: 'AflÃ„Æ’ ce reprezintÃ„Æ’ Wagering Requirement Ãˆâ„¢i cum ÃƒÂ®Ãˆâ€ºi afecteazÃ„Æ’ bonusurile.',
    updatedAt: '2024-09-10',
    readMins: 3,
    kind: 'Ghid',
    content: `# Ce ÃƒÂ®nseamnÃ„Æ’ WR Ãˆâ„¢i cum se calculeazÃ„Æ’?

## Introducere

WR (Wagering Requirement) este un termen important ÃƒÂ®n lumea bonusurilor de jocuri de noroc. El reprezintÃ„Æ’ numÃ„Æ’rul de ori pe care trebuie sÃ„Æ’ pariezi bonusul primit pentru a putea retrage cÃƒÂ¢Ãˆâ„¢tigurile obÃˆâ€ºinute din acesta.

## Cum se calculeazÃ„Æ’

Formula de bazÃ„Æ’ este: **WR = Valoarea bonusului Ãƒâ€” Multiplicatorul WR**

De exemplu, dacÃ„Æ’ primeÃˆâ„¢ti un bonus de 100 RON cu WR 20x, trebuie sÃ„Æ’ pariezi 2000 RON ÃƒÂ®n total pentru a ÃƒÂ®ndeplini condiÃˆâ€ºia.

## Exemplu practic

SÃ„Æ’ spunem cÃ„Æ’ ai un bonus de 100 RON cu WR 20x. Trebuie sÃ„Æ’ pariezi 2000 RON. DacÃ„Æ’ ai o cotÃ„Æ’ medie de 2.0, ai nevoie de 1000 pariuri pentru a ÃƒÂ®ndeplini WR-ul.

## Note importante

- WR-ul se aplicÃ„Æ’ doar bonusului, nu depunerii iniÃˆâ€ºiale.
- CiteÃˆâ„¢te ÃƒÂ®ntotdeauna termenii Ãˆâ„¢i condiÃˆâ€ºiile operatorului.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '2',
    category: 'bonusuri-wr',
    slug: 'cum-revendic-bonus',
    title: 'Cum revendic un bonus fÃ„Æ’rÃ„Æ’ depunere?',
    excerpt: 'Ghid pas cu pas pentru a revendica bonusuri fÃ„Æ’rÃ„Æ’ depunere.',
    updatedAt: '2024-09-08',
    readMins: 4,
    kind: 'Ghid',
    content: `# Cum revendic un bonus fÃ„Æ’rÃ„Æ’ depunere?

## Pasul 1: ÃƒÅ½nregistreazÃ„Æ’-te

ÃƒÅ½nregistreazÃ„Æ’-te pe site-ul operatorului cu datele tale reale.

## Pasul 2: ConfirmÃ„Æ’ contul

ConfirmÃ„Æ’ adresa de email Ãˆâ„¢i numÃ„Æ’rul de telefon.

## Pasul 3: RevendicÃ„Æ’ bonusul

ÃƒÅ½n secÃˆâ€ºiunea bonusuri, selecteazÃ„Æ’ bonusul fÃ„Æ’rÃ„Æ’ depunere Ãˆâ„¢i apasÃ„Æ’ pe "RevendicÃ„Æ’".

## Pasul 4: JoacÃ„Æ’

FoloseÃˆâ„¢te bonusul ÃƒÂ®n jocurile specificate.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '3',
    category: 'depuneri-retrageri',
    slug: 'depuneri-card',
    title: 'Depuneri cu card vs. portofel electronic',
    excerpt: 'ComparÃ„Æ’ metodele de depunere disponibile.',
    updatedAt: '2024-09-05',
    readMins: 5,
    kind: 'Ghid',
    content: `# Depuneri cu card vs. portofel electronic

## Card bancar

Avantaje: Rapid, acceptat peste tot.
Dezavantaje: Comisioane mai mari, verificare suplimentarÃ„Æ’.

## Portofel electronic

Avantaje: Anonim, rapid, securizat.
Dezavantaje: NecesitÃ„Æ’ ÃƒÂ®nregistrare separatÃ„Æ’.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '4',
    category: 'depuneri-retrageri',
    slug: 'retrageri-timpi',
    title: 'Retrageri: timpi Ãˆâ„¢i comisioane',
    excerpt: 'AflÃ„Æ’ cÃƒÂ¢t dureazÃ„Æ’ retragerile Ãˆâ„¢i ce comisioane sunt.',
    updatedAt: '2024-09-03',
    readMins: 3,
    kind: 'FAQ',
    content: `# Retrageri: timpi Ãˆâ„¢i comisioane

## Timi de procesare

Card: 1-3 zile lucrÃ„Æ’toare.
Portofel electronic: Instant sau 24h.

## Comisioane

Majoritatea operatorilor nu percep comisioane pentru retrageri, dar verificÃ„Æ’ termenii.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '5',
    category: 'tehnic-securitate',
    slug: 'verificare-cont',
    title: 'Verificarea contului (KYC)',
    excerpt: 'De ce trebuie sÃ„Æ’ verifici contul Ãˆâ„¢i cum faci asta.',
    updatedAt: '2024-09-01',
    readMins: 4,
    kind: 'Ghid',
    content: `# Verificarea contului (KYC)

## De ce este necesarÃ„Æ’

Pentru a respecta reglementÃ„Æ’rile ONJN Ãˆâ„¢i pentru securitatea ta.

## Cum se face

ÃƒÅ½ncarcÃ„Æ’ copie dupÃ„Æ’ CI, dovadÃ„Æ’ de adresÃ„Æ’, selfie.

## CÃƒÂ¢t dureazÃ„Æ’

De obicei 24-48h.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '6',
    category: 'cont-preferinte',
    slug: 'setari-notificari',
    title: 'SetÃ„Æ’ri notificÃ„Æ’ri & alerte bonusuri',
    excerpt: 'PersonalizeazÃ„Æ’ notificÃ„Æ’rile pentru bonusuri noi.',
    updatedAt: '2024-08-30',
    readMins: 2,
    kind: 'FAQ',
    content: `# SetÃ„Æ’ri notificÃ„Æ’ri & alerte bonusuri

## Cum activez

ÃƒÅ½n setÃ„Æ’rile contului, bifeazÃ„Æ’ "Alerte bonusuri".

## Tipuri de notificÃ„Æ’ri

Email, SMS, push.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '7',
    category: 'legal-conformitate',
    slug: 'conditii-onjn',
    title: 'CondiÃˆâ€ºii ONJN pentru jucÃ„Æ’tori',
    excerpt: 'CerinÃˆâ€ºele legale pentru jocurile de noroc ÃƒÂ®n RomÃƒÂ¢nia.',
    updatedAt: '2024-08-28',
    readMins: 6,
    kind: 'Ghid',
    content: `# CondiÃˆâ€ºii ONJN pentru jucÃ„Æ’tori

## LicenÃˆâ€ºiere

ToÃˆâ€ºi operatorii trebuie sÃ„Æ’ aibÃ„Æ’ licenÃˆâ€ºÃ„Æ’ ONJN.

## VÃƒÂ¢rsta minimÃ„Æ’

18 ani.

## Joc responsabil

Operatorii trebuie sÃ„Æ’ ofere instrumente pentru joc responsabil.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '8',
    category: 'tehnic-securitate',
    slug: 'securitate-2fa',
    title: 'Securitate: 2FA Ãˆâ„¢i sesiunile active',
    excerpt: 'ProtejeazÃ„Æ’-Ãˆâ€ºi contul cu autentificare ÃƒÂ®n doi paÃˆâ„¢i.',
    updatedAt: '2024-08-25',
    readMins: 3,
    kind: 'Ghid',
    content: `# Securitate: 2FA Ãˆâ„¢i sesiunile active

## Ce este 2FA

Autentificare ÃƒÂ®n doi paÃˆâ„¢i pentru securitate suplimentarÃ„Æ’.

## Cum activez

ÃƒÅ½n setÃ„Æ’rile de securitate, activeazÃ„Æ’ 2FA cu app sau SMS.

## Sesiuni active

PoÃˆâ€ºi vedea Ãˆâ„¢i ÃƒÂ®nchide sesiunile active din setÃ„Æ’ri.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '9',
    category: 'joc-responsabil',
    slug: 'limite-depunere',
    title: 'Limite de depunere pentru joc responsabil',
    excerpt: 'Cum sÃ„Æ’ setezi limite pentru a juca responsabil.',
    updatedAt: '2024-08-20',
    readMins: 4,
    kind: 'Ghid',
    content: `# Limite de depunere pentru joc responsabil

## De ce limite

Pentru a controla cheltuielile Ãˆâ„¢i a evita dependenÃˆâ€ºa.

## Cum setezi

ÃƒÅ½n setÃ„Æ’rile contului, stabileÃˆâ„¢te limite zilnice/sÃ„Æ’ptÃ„Æ’mÃƒÂ¢nale/lunare.

## Modificare

PoÃˆâ€ºi modifica limitele, dar cu perioadÃ„Æ’ de rÃ„Æ’cire.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  },
  {
    id: '10',
    category: 'joc-responsabil',
    slug: 'auto-excludere',
    title: 'Auto-excludere Ãˆâ„¢i resurse de ajutor',
    excerpt: 'OpÃˆâ€ºiuni pentru auto-excludere Ãˆâ„¢i ajutor profesional.',
    updatedAt: '2024-08-15',
    readMins: 5,
    kind: 'Ghid',
    content: `# Auto-excludere Ãˆâ„¢i resurse de ajutor

## Auto-excludere

PoÃˆâ€ºi solicita auto-excludere temporarÃ„Æ’ sau permanentÃ„Æ’.

## Resurse de ajutor

JocResponsabil.ro, linie de ajutor 0800 123 456.

## Suport

ContacteazÃ„Æ’ operatorul pentru auto-excludere.

ConÃˆâ€ºinut comercial. Ofertele sunt doar pentru operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+. JoacÃ„Æ’ responsabil.`
  }
];
