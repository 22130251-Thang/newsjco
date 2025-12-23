import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { Link } from "react-router-dom";
import { getMainTheGioiArticle } from "../lib/store/slices/articleSlice";
import { MainArticleSkeleton } from "./Skeleton";

export const MainSection = () => {
  const dispatch = useAppDispatch();
  const { data: mainTheGioiArticle, loading } = useAppSelector(
    (state) => state.article.mainTheGioiArticle
  );
  const error = useAppSelector((state) => state.article.error);

  useEffect(() => {
    dispatch(getMainTheGioiArticle());
  }, [dispatch]);

  if (loading) {
    return <MainArticleSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 text-red-600 border border-red-200 dark:border-red-900 rounded">
        Lỗi khi tải bài viết: {error}
      </div>
    );
  }

  if (!mainTheGioiArticle) {
    return (
      <div className="bg-white p-8 text-gray-500 text-center">
        Chưa có bài viết chính.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex flex-col">
        <Link
          to={`/${mainTheGioiArticle.category}/${mainTheGioiArticle.slug}`}
          className="relative block w-full h-[300px] overflow-hidden group"
        >
          <img
            src={mainTheGioiArticle.image}
            alt={mainTheGioiArticle.title}
            className="w-full h-full object-cover"
            width={540}
            height={338}
          />
          <div className="absolute top-4 left-4">
            <span className="category-badge">
              {mainTheGioiArticle.category}
            </span>
          </div>
        </Link>

        <div className="p-4">
          <Link to={`/${mainTheGioiArticle.category}/${mainTheGioiArticle.slug}`} className="group">
            <h2 className="article-title text-2xl font-bold mb-3 group-hover:text-primary dark:text-white dark:group-hover:text-orange-300 transition-colors leading-tight">
              {mainTheGioiArticle.title}
            </h2>
          </Link>
          <p className="article-description text-lg leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-5">
            {mainTheGioiArticle.description}
          </p>
        </div>
      </div>
    </div>
  );
};
