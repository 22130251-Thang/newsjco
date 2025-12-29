import { HotNews } from "./HotNews";
import { CategoryBlock } from "./CategoryBlock";
import type { Article } from "../../types/article.type";
import { CategoryBlockSkeleton } from "../shared/Skeleton";

interface NewsGridProps {
    loading: boolean;
    categories: { category: string; articles: Article[] }[];
}

export const NewsGrid = ({ loading, categories }: NewsGridProps) => {
    return (
        <div className="container-main py-6 bg-white dark:bg-gray-900">
            <div className="flex gap-8 items-start">
                <div className="w-[50%]">
                    <HotNews />
                </div>
                <div className="w-[50%] space-y-8">
                    {loading ? (
                        <CategoryBlockSkeleton count={3} />
                    ) : categories.length > 0 ? (
                        categories.map((cat, index) => (
                            <CategoryBlock
                                key={`${cat.category}-${index}`}
                                category={cat.category}
                                articles={cat.articles}
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400">Đang cập nhật nội dung...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
