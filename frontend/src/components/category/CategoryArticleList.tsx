import { ArticleCard } from "../ArticleCard";
import type { Article } from "../../types/article.type";

interface CategoryArticleListProps {
    articles: Article[];
}

export const CategoryArticleList = ({ articles }: CategoryArticleListProps) => {
    return (
        <div className="space-y-8">
            <h3 className="text-lg font-bold text-gray-900 border-l-4 border-primary pl-3 uppercase tracking-wider mb-6">
                Tin mới
            </h3>

            <div className="divide-y divide-gray-100">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={`catarticlelist-${index}`}
                        article={article}
                        variant="horizontal"
                        showDescription={true}
                        showBorder={index !== articles.length - 1}
                        imageClassName="w-1/3 md:w-1/4"
                    />
                ))}
            </div>
        </div>
    );
};
