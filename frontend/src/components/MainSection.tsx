import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getTop3FeaturesArticles } from "../lib/store/slices/articleSlice";
import { Link } from "react-router-dom";

export const MainSection = () => {
  const dispatch = useAppDispatch();
  const { top3Articles, loadingTop3Articles, error } = useAppSelector(
    (state) => state.article,
  );

  useEffect(() => {
    dispatch(getTop3FeaturesArticles());
  }, [dispatch]);

  if (loadingTop3Articles) {
    return (
      <div className="bg-white p-4 animate-pulse">
        <div className="flex gap-5">
          <div className="w-[400px] h-[240px] bg-gray-200 rounded shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 text-red-600 border border-red-200 rounded">
        Lỗi khi tải bài viết: {error}
      </div>
    );
  }

  if (top3Articles.length === 0) {
    return (
      <div className="bg-white p-8 text-gray-500 text-center">
        Chưa có bài viết nổi bật.
      </div>
    );
  }

  const mainArticle = top3Articles[0];
  const secondaryArticles = top3Articles.slice(1);

  return (
    <div className="bg-white">
      {/* Main Hero Article */}
      <div className="flex gap-5 p-4 border-b border-gray-100">
        {/* Large Image */}
        <Link
          to={mainArticle.guid}
          className="relative block w-[400px] h-[240px] overflow-hidden group shrink-0 rounded"
        >
          <img
            src={mainArticle.image}
            alt={mainArticle.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="category-badge">{mainArticle.category}</span>
          </div>
        </Link>

        {/* Article Info */}
        <div className="flex flex-col justify-center flex-1">
          <Link to={mainArticle.guid} className="group">
            <h2 className="article-title text-2xl mb-3 group-hover:text-primary transition-colors leading-tight">
              {mainArticle.title}
            </h2>
          </Link>
          <p className="article-description text-base leading-relaxed line-clamp-4">
            {mainArticle.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
            <span>
              {new Date(mainArticle.pubDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-primary font-medium">{mainArticle.source}</span>
          </div>
        </div>
      </div>

      {/* Secondary Articles */}
      {secondaryArticles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 p-4">
          {secondaryArticles.map((article) => (
            <Link
              key={article.guid}
              to={article.guid}
              className="flex gap-3 group hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-[120px] h-[75px] object-cover rounded shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs text-primary font-semibold mb-1">
                  {article.category}
                </span>
                <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <span className="text-xs text-gray-400 mt-auto">
                  {new Date(article.pubDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
