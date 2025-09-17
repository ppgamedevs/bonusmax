export default function Breadcrumbs({ items }: { items: { title: string; href: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-zinc-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <a href={item.href} className="hover:text-white transition-colors">
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
