import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { getTop3FeaturesArticles } from "../lib/store/slices/articleSlice";

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
  console.log(top3Articles);
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center"></div>
    </div>
  );
};
