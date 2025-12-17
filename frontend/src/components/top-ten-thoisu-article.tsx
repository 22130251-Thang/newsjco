import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { useEffect } from "react";
import { getTop10ThoiSuArticles } from "../lib/store/slices/articleSlice";
import { Flame } from "lucide-react";

export const Top10ThoiSuArticles = () => {
  const dispatch = useAppDispatch();
  const { top10ThoiSuArticles, loadingTop10ThoiSuArticles, error } =
    useAppSelector((state) => state.article);

  useEffect(() => {
    dispatch(getTop10ThoiSuArticles());
  }, [dispatch]);

  if (loadingTop10ThoiSuArticles) {
    return (
      <div className="sidebar-section animate-pulse">
        <div className="hot-news-label flex items-center gap-2">
          <Flame size={16} />
          <span>TIN NÓNG</span>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-[80px] h-[50px] bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar-section">
        <div className="hot-news-label flex items-center gap-2">
          <Flame size={16} />
          <span>TIN NÓNG</span>
        </div>
        <div className="p-4 text-red-600 text-sm">
          Lỗi khi tải bài viết: {error}
        </div>
      </div>
    );
  }

  if (top10ThoiSuArticles.length === 0) {
    return (
      <div className="sidebar-section">
        <div className="hot-news-label flex items-center gap-2">
          <Flame size={16} />
          <span>TIN NÓNG</span>
        </div>
        <div className="p-4 text-gray-500 text-sm">
          Chưa có bài viết nổi bật.
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      {/* Section Header */}
      <div className="hot-news-label flex items-center gap-2">
        <Flame size={16} />
        <span>TIN NÓNG</span>
      </div>

      {/* Articles List */}
      <div className="divide-y divide-gray-100">
        {top10ThoiSuArticles.slice(0, 8).map((article, index) => (
          <Link
            to={article.slug}
            key={article.guid}
            className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
          >
            {/* Thumbnail */}
            <img
              className="w-[80px] h-[50px] object-cover rounded flex-shrink-0"
              src={article.image ? article.image : "https://placehold.co/80x50"}
              alt={article.title}
            />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#c02424] font-semibold uppercase">
                {article.category}
              </span>
              <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-[#c02424] transition-colors">
                {article.title}
              </h3>
            </div>
            {/* Index Number */}
            <span className="text-2xl font-bold text-gray-200 flex-shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
          </Link>
        ))}
      </div>

      {/* View More Link */}
      <div className="p-3 border-t border-gray-100">
        <Link
          to="/thoi-su"
          className="text-sm text-[#c02424] font-semibold hover:underline flex items-center justify-center gap-1"
        >
          Xem thêm →
        </Link>
      </div>
    </div>
  );
};
