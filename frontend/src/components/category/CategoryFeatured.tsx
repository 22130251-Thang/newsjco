import { Link } from "react-router-dom";
import type { Article } from "../../types/article.type";
import { ArticleCard } from "../ArticleCard";

interface CategoryFeaturedProps {
    articles: Article[];
}

export const CategoryFeatured = ({ articles }: CategoryFeaturedProps) => {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const subArticles = articles.slice(1, 4);

    return (
        <div className="flex mb-10">
            <div className="w-[842px] h-[552px]">
                <div className="mb-10">
                    <Link
                        to={`/${mainArticle.category}/${mainArticle.slug}`}
                        className="flex gap-3"
                    >
                        <div className="shrink-0">
                            <img
                                src={mainArticle.image}
                                alt={mainArticle.title}
                                className="w-[513.84px] h-[303px] object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[28px] font-extrabold text-gray-900 leading-tight mb-4 font-heading">
                                {mainArticle.title}
                            </h2>
                            <p className="text-[16px] text-gray-600 line-clamp-6 leading-relaxed">
                                {mainArticle.description}
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                    {subArticles.map((article) => (
                        <ArticleCard
                            key={article.slug}
                            article={article}
                            variant="vertical"
                        />
                    ))}
                </div>
            </div>
            <div></div>
        </div>

    );
};
