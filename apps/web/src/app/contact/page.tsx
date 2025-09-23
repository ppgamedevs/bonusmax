export const dynamic = 'force-dynamic';
export const revalidate = 60;
export const metadata = { title: 'Contact | Bonusmax' };
import BackHome from '@/components/BackHome';
import ContactForm from '@/components/contact/ContactForm';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
          Contact
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Hai să vorbim</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Întrebări, feedback sau propuneri de parteneriat? Completează formularul și revenim în
          cel mai scurt timp.
        </p>
      </header>

      <BackHome />

      <ContactForm />
    </main>
  );
}
