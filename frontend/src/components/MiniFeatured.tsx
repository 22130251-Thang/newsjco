import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getTop3FeaturesArticles } from "../lib/store/slices/articleSlice";
import { Link } from "react-router-dom";
import { ArticleCardSkeleton } from "./Skeleton";

export const MiniFeatured = () => {
  const dispatch = useAppDispatch();
  const { data: top3Articles, loading } = useAppSelector(
    (state) => state.article.top3Articles,
  );

  useEffect(() => {
    dispatch(getTop3FeaturesArticles());
  }, [dispatch]);

  if (loading) {
    return <ArticleCardSkeleton count={3} imageWidth="120px" imageHeight="70px" />;
  }

  if (top3Articles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {top3Articles.slice(0, 3).map((article) => (
        <Link
          key={article.guid}
          to={`/${article.category}/${article.slug}`}
          className="flex gap-3 bg-gray-100 p-2 border-b border-gray-300"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-[120px] h-[70px] object-cover"
          />
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold text-gray-800 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};
