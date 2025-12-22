import { HotNews } from "./HotNews";
import { CategoryBlock } from "./CategoryBlock";
import type { Article } from "../types/article.type";
import { CategoryBlockSkeleton } from "./Skeleton";

interface NewsGridProps {
    loading: boolean;
    categories: { category: string; articles: Article[] }[];
}

export const NewsGrid = ({ loading, categories }: NewsGridProps) => {
    return (
        <div className="container-main py-6">
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
