import { HelpCategory } from '../../lib/help-data';

export default function CategoryCard({ category }: { category: HelpCategory }) {
  return (
    <div className="group border border-zinc-800 rounded-lg p-6 hover:border-zinc-600 transition-all hover:shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="group">{category.icon}</div>
        <h3 className="text-lg font-semibold">{category.title}</h3>
      </div>
      <p className="text-zinc-400 mb-4">{category.description}</p>
      <ul className="space-y-2">
        {category.topLinks.map(link => (
          <li key={link.href}>
            <a href={link.href} className="text-blue-400 hover:underline text-sm">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
