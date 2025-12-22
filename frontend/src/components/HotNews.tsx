import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getHotNewsArticles } from "../lib/store/slices/articleSlice";
import { HotNewsSkeleton } from "./Skeleton";

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
                    <Link
                        key={article.guid}
                        to={`/${article.category}/${article.slug}`}
                        className={`flex gap-4 py-4 ${index !== hotNewsArticles.length - 1 ? "border-b border-gray-200" : ""
                            } group`}
                    >
                        <div className="w-[200px] h-[120px] shrink-0 overflow-hidden">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-start">
                            <span className="text-[#cc0000] text-xs uppercase font-medium mb-1.5">
                                {article.category.replace("-", " ")}
                            </span>
                            <h3 className="text-[17px] font-bold font-heading leading-snug text-gray-800 transition-colors line-clamp-3">
                                {article.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
