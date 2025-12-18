import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Article } from "../types/article.type";

interface CategorySectionProps {
    title: string;
    slug: string;
    articles: Article[];
    loading?: boolean;
}

export const CategorySection = ({ title, slug, articles, loading }: CategorySectionProps) => {
    if (loading) {
        return (
            <div className="bg-white mb-4 animate-pulse">
                <div className="section-header">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex gap-4 p-4">
                    <div className="w-[300px] h-[180px] bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return null;
    }

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 5);

    return (
        <div className="bg-white mb-4">
            <div className="section-header px-4 pt-4">
                <h2>{title}</h2>
                <Link
                    to={`/${slug}`}
                    className="ml-auto text-xs text-gray-500 hover:text-[#c02424] flex items-center gap-1"
                >
                    Xem thêm <ChevronRight size={14} />
                </Link>
            </div>

            <div className="p-4">
                <div className="flex gap-4">
                    <Link
                        to={`/${mainArticle.category}/${mainArticle.slug}`}
                        className="w-[300px] flex-shrink-0 group"
                    >
                        <div className="relative overflow-hidden rounded">
                            <img
                                src={mainArticle.image}
                                alt={mainArticle.title}
                                className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 category-badge">
                                {mainArticle.category}
                            </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold font-heading leading-tight group-hover:text-[#c02424] transition-colors line-clamp-2">
                            {mainArticle.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {mainArticle.description}
                        </p>
                    </Link>

                    <div className="flex-1 space-y-3">
                        {sideArticles.map((article) => (
                            <Link
                                key={article.guid}
                                to={`/${article.category}/${article.slug}`}
                                className="flex gap-3 group"
                            >
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-[100px] h-[60px] object-cover rounded flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-[#c02424] transition-colors">
                                        {article.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                        {new Date(article.pubDate).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
