import { Link } from "react-router-dom";
import { Bell, BellOff, Loader2, FolderHeart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { unsubscribeCategoryAction } from "../../lib/store/slices/authSlice";

const categoryNameMap: Record<string, string> = {
  "khoa-hoc-cong-nghe": "Khoa học - Công nghệ",
  "doi-song":  "Đời sống",
  "giai-tri": "Giải trí",
  "giao-duc": "Giáo dục",
  "kinh-doanh": "Kinh doanh",
  "phap-luat": "Pháp luật",
  "suc-khoe": "Sức khỏe",
  "the-gioi": "Thế giới",
  "the-thao": "Thể thao",
  "thoi-su": "Thời sự",
  "dia-phuong": "Địa phương",
  "kinh-te": "Kinh tế",
  "van-hoa": "Văn hóa",
  "quan-su": "Quân sự",
  anh:  "Ảnh",
  infographics: "Infographics",
  "giai-ma-muon-mat": "Giải mã muôn mặt",
  "tin-moi-nhat": "Tin mới nhất",
};

export const SubscribedCategories = () => {
  const dispatch = useAppDispatch();
  const { user, subscriptionLoading } = useAppSelector((state) => state.auth);

  const subscribedCategories = user?.subscribedCategories || [];

  const handleUnsubscribe = async (categorySlug: string) => {
    if (confirm(`Bạn có chắc muốn hủy theo dõi danh mục này?`)) {
      try {
        await dispatch(unsubscribeCategoryAction(categorySlug)).unwrap();
      } catch (error) {
        console.error("Unsubscribe error:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FolderHeart className="text-red-500" size={24} />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Danh mục đang theo dõi
        </h2>
      </div>

      {subscribedCategories.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Bạn chưa theo dõi danh mục nào
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Khám phá các danh mục
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subscribedCategories.map((slug) => (
            <div
              key={slug}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Link
                to={`/${slug}`}
                className="flex items-center gap-2 flex-1 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
              >
                <Bell size={16} className="text-red-500" />
                <span className="font-medium">
                  {categoryNameMap[slug] || slug}
                </span>
              </Link>
              <button
                onClick={() => handleUnsubscribe(slug)}
                disabled={subscriptionLoading}
                className="p-1. 5 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                title="Hủy theo dõi"
              >
                {subscriptionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <BellOff size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {subscribedCategories.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Đang theo dõi {subscribedCategories.length} danh mục
        </p>
      )}
    </div>
  );
};