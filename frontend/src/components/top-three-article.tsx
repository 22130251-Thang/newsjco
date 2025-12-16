import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getTop3FeaturesArticles } from "../lib/store/slices/articleSlice";
import { Link } from "react-router-dom";

export const TopThreeArticles = () => {
  const dispatch = useAppDispatch();
  const { top3Articles, loading, error } = useAppSelector(
    (state) => state.article,
  );

  useEffect(() => {
    dispatch(getTop3FeaturesArticles());
  }, [dispatch]);
  if (loading) {
    return <p>Đang tải các bài viết</p>;
  }
  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-300 rounded">
        Lỗi khi tải bài viết: {error}
      </div>
    );
  }
  if (top3Articles.length === 0) {
    return <p>Chưa có bài viết nổi bật.</p>;
  }
  const firstArticle = top3Articles[0];

  const remainingArticles = top3Articles.slice(1);
  return (
    <div className="flex flex-col w-[780px] border-b border-gray-200 pb-5 space-y-5">
      <div className="flex justify-center items-start space-x-5 border-b border-gray-200 pb-5">
        <img src={firstArticle.image} width={520} height={312}></img>
        <Link
          to={firstArticle.guid}
          className="flex flex-col space-y-2 cursor-pointer"
        >
          <h2 className="font-bold text-xl hover:text-red-500">
            {firstArticle.title}
          </h2>
          <p>{firstArticle.description}</p>
        </Link>
      </div>
      <div className="flex justify-start items-center space-x-5">
        {remainingArticles.map((article) => (
          <Link
            key={article.guid}
            to={article.guid}
            className="flex flex-col w-[250px] h-[228px]"
          >
            <h3 className="font-bold leading-snug text-base mb-1 hover:text-red-500 h-[4.5rem]">
              {article.title}
            </h3>
            <img
              src={article.image}
              width={250}
              alt={article.title}
              className="mt-1 w-full object-cover flex-grow"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
