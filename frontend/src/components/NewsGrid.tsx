import { HotNews } from "./HotNews";
import { CategoryBlock } from "./CategoryBlock";
import type { Article } from "../types/article.type";

interface NewsGridProps {
    loading: boolean;
    categories: { category: string; articles: Article[] }[];
}

export const NewsGrid = ({ loading, categories }: NewsGridProps) => {
    return (
        <div className="container-main py-6">
            <div className="flex gap-8 items-start">
                <div className="w-[545px] shrink-0">
                    <HotNews />
                </div>
                <div className="w-[600px] shrink-0 space-y-8">
                    {loading ? (
                        <div className="animate-pulse space-y-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-gray-100 rounded"></div>
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        categories.map((cat, index) => (
                            <CategoryBlock
                                key={index}
                                category={cat.category}
                                articles={cat.articles}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500">Đang cập nhật nội dung...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
