import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getTop3FeaturesArticles } from "../lib/store/slices/articleSlice";
import { Link } from "react-router-dom";

export const MiniFeatured = () => {
    const dispatch = useAppDispatch();
    const { top3Articles, loadingTop3Articles } = useAppSelector(
        (state) => state.article,
    );

    useEffect(() => {
        dispatch(getTop3FeaturesArticles());
    }, [dispatch]);

    if (loadingTop3Articles) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-[120px] h-[70px] bg-gray-200 shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (top3Articles.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col">
            {top3Articles.slice(0, 3).map((article) => (
                <Link
                    key={article.guid}
                    to={article.guid}
                    className="flex gap-3 bg-gray-100 p-2 border-b border-gray-300"
                >
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-[120px] h-[70px] object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold leading-snug text-gray-800 group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};
