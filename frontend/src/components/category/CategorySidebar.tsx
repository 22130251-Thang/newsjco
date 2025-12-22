import { Link } from "react-router-dom";
import type { Article } from "../../types/article.type";

interface CategorySidebarProps {
    trendingArticles: Article[];
    mostReadArticles: Article[];
}

export const CategorySidebar = ({ trendingArticles, mostReadArticles }: CategorySidebarProps) => {
    return (
        <aside className="flex flex-col gap-10">
            <section>
                <h3 className="text-lg font-extrabold text-gray-900 border-b-2 border-red-600 pb-2 mb-6 uppercase tracking-wider flex items-center justify-between">
                    <span>Tin Tiêu Điểm</span>
                    <span className="w-8 h-1 bg-red-600 inline-block"></span>
                </h3>
                <div className="space-y-4">
                    {trendingArticles.map((article, index) => (
                        <Link
                            key={article.slug || index}
                            to={`/${article.category}/${article.slug}`}
                            className="flex items-start gap-3"
                        >
                            <span className="text-2xl font-black text-gray-200 transition-colors leading-none">
                                {index + 1}
                            </span>
                            <h4 className="text-sm font-bold text-gray-800 transition-colors line-clamp-2 leading-snug">
                                {article.title}
                            </h4>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-gray-50 p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1.5 h-6 bg-red-600 inline-block" />
                    Đọc nhiều nhất
                </h3>
                <div className="flex flex-col gap-6">
                    {mostReadArticles.map((article, index) => (
                        <Link
                            key={article.slug || index}
                            to={`/${article.category}/${article.slug}`}
                            className="flex gap-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0 group"
                        >
                            <div className="w-24 h-16 shrink-0 overflow-hidden bg-gray-200">
                                <img
                                    src={article.image || "/placeholder-article.jpg"}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="flex flex-col justify-between py-0.5 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                                    {article.title}
                                </h4>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-extrabold tracking-tight">
                                    {article.category.replace("-", " ")}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </aside>
    );
};
