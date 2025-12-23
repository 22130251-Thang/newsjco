import type { Article } from "../../types/article.type";
import { ArticleCard } from "../ArticleCard";

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
        <aside className="w-[350px] shrink-0 ">
            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                    <span className="w-1.5 h-6 bg-red-600" />
                    TIN LIÊN QUAN
                </h2>
                <div className="flex flex-col gap-2">
                    {articles.slice(0, maxItems).map((item) => (
                        <ArticleCard
                            key={item.slug}
                            article={item}
                            variant="horizontal"
                            showCategory={true}
                            imageClassName="w-24 h-16"
                        />
                    ))}
                </div>
            </div>
        </aside>
    );
};
