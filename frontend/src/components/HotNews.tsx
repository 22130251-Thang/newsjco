import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getHotNewsArticles } from "../lib/store/slices/articleSlice";
import { HotNewsSkeleton } from "./Skeleton";
import { ArticleCard } from "./ArticleCard";

export const HotNews = () => {
    const dispatch = useAppDispatch();
    const { data: hotNewsArticles, loading } = useAppSelector(
        (state) => state.article.hotNewsArticles
    );

    useEffect(() => {
        dispatch(getHotNewsArticles());
    }, [dispatch]);

    if (loading) {
        return <HotNewsSkeleton count={4} />;
    }

    if (hotNewsArticles.length === 0) return null;

    return (
        <div className="bg-white">
            <div className="mb-4">
                <span className="bg-[#cc0000] text-white font-bold px-3 py-1 text-sm uppercase inline-block">
                    TIN NÓNG
                </span>
            </div>

            <div className="flex flex-col">
                {hotNewsArticles.map((article, index) => (
                    <ArticleCard
                        key={`hotnews-${index}`}
                        article={article}
                        variant="horizontal"
                        showBorder={index !== hotNewsArticles.length - 1}
                        showCategory={true}
                    />
                ))}
            </div>
        </div>
    );
};
