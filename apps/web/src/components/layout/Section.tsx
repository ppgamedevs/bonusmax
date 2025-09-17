export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h2 className="text-xl font-bold u-underline-hover">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm opacity-70">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
