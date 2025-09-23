// Lightweight MDX components map for RSC rendering
// Extend with custom components when needed.
function Callout({ type = 'info', title, children }: any) {
  const color =
    type === 'warning'
      ? 'border-amber-400/40 bg-amber-500/10 text-amber-200'
      : type === 'success'
      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
      : 'border-sky-400/40 bg-sky-500/10 text-sky-200';
  return (
    <div className={`my-4 rounded-xl border p-3 ${color}`}>
      {title ? <div className="mb-1 text-sm font-semibold">{title}</div> : null}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ProsCons({ pros = [], cons = [] }: any) {
  return (
    <div className="my-4 grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-sm font-semibold">Pro</div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {pros.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-sm font-semibold">Contra</div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {cons.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ButtonLink({ href, children }: any) {
  return (
    <a href={href} className="btn-accent inline-flex h-10 items-center justify-center px-4">
      {children}
    </a>
  );
}

function YouTube({ id }: any) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

const mdxComponents = {
  // Ensure links are rendered correctly
  a: (props: any) => <a {...props} className={['underline underline-offset-2', props.className].filter(Boolean).join(' ')} />,
  // Headings keep good contrast and ids can be provided in content
  h2: (props: any) => <h2 {...props} className={['mt-8 text-xl font-bold', props.className].filter(Boolean).join(' ')} />,
  h3: (props: any) => <h3 {...props} className={['mt-6 text-lg font-semibold', props.className].filter(Boolean).join(' ')} />,
  ul: (props: any) => <ul {...props} className={['list-disc pl-5', props.className].filter(Boolean).join(' ')} />,
  ol: (props: any) => <ol {...props} className={['list-decimal pl-5', props.className].filter(Boolean).join(' ')} />,
  table: (props: any) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
      <table {...props} className={['w-full text-sm', props.className].filter(Boolean).join(' ')} />
    </div>
  ),
  blockquote: (props: any) => (
    <blockquote {...props} className={['border-l-2 pl-4 opacity-90', props.className].filter(Boolean).join(' ')} />
  ),
  Callout,
  ProsCons,
  ButtonLink,
  YouTube,
} as any;

export default mdxComponents;
