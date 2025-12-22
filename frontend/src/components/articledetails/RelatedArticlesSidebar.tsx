import type { Article } from "../../types/article.type";

interface RelatedArticlesSidebarProps {
    articles: Article[];
    maxItems?: number;
}

export const RelatedArticlesSidebar = ({
    articles,
    maxItems = 6,
}: RelatedArticlesSidebarProps) => {
    if (articles.length === 0) return null;

    return (
        <aside className="w-full lg:w-[350px] shrink-0 sticky top-24">
            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-600" />
                    TIN LIÊN QUAN
                </h2>
                <div className="flex flex-col gap-6">
                    {articles.slice(0, maxItems).map((item) => (
                        <RelatedArticleItem key={item.slug} article={item} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

interface RelatedArticleItemProps {
    article: Article;
}

const RelatedArticleItem = ({ article }: RelatedArticleItemProps) => (
    <div className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
        {article.image && (
            <div className="w-24 h-16 shrink-0 overflow-hidden rounded bg-gray-200">
                <img
                    src={article.image}
                    className="w-full h-full object-cover"
                    alt={article.title}
                />
            </div>
        )}
        <div className="flex flex-col justify-between py-0.5">
            <h3 className="text-sm font-bold leading-snug line-clamp-2 text-gray-900">
                {article.title}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-extrabold tracking-tight">
                {article.category}
            </p>
        </div>
    </div>
);
