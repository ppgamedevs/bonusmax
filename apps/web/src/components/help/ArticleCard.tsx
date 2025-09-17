import { HelpArticle } from '../../lib/help-data';

export default function ArticleCard({ article }: { article: HelpArticle }) {
  return (
    <div className="border border-zinc-800 rounded p-4 hover:border-zinc-600 transition-all">
      <h4 className="font-semibold mb-2">
        <a href={`/help/${article.category}/${article.slug}`} className="hover:underline">
          {article.title}
        </a>
      </h4>
      <p className="text-zinc-400 mb-2">{article.excerpt}</p>
      <div className="text-sm text-zinc-500 flex items-center gap-2">
        <span>{article.readMins} min</span>
        <span>•</span>
        <span>{article.updatedAt}</span>
        <span>•</span>
        <span className="text-zinc-400">{article.kind}</span>
      </div>
    </div>
  );
}
