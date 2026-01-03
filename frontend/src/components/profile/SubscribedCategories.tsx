import { Link } from "react-router-dom";
import { Bell, BellOff, Loader2, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { unsubscribeCategoryAction } from "../../lib/store/slices/authSlice";

const categoryNameMap: Record<string, string> = {
  "khoa-hoc-cong-nghe": "Khoa học - Công nghệ",
  "doi-song": "Đời sống",
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
  anh: "Ảnh",
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
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <Heart className="text-red-500" size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Danh mục đang theo dõi
        </h2>
        {subscribedCategories.length > 0 && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {subscribedCategories.length} danh mục
          </span>
        )}
      </div>

      {subscribedCategories.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Bell className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Bạn chưa theo dõi danh mục nào
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md cursor-pointer"
          >
            Khám phá các danh mục
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subscribedCategories.map((slug) => (
            <div
              key={slug}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Link
                to={`/${slug}`}
                className="flex items-center gap-3 flex-1 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
              >
                <Bell size={16} className="text-red-500" />
                <span className="font-medium text-sm">
                  {categoryNameMap[slug] || slug}
                </span>
              </Link>
              <button
                onClick={() => handleUnsubscribe(slug)}
                disabled={subscriptionLoading}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
    </div>
  );
};