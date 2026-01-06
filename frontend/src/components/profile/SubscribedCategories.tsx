import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, BellOff, Loader2, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { unsubscribeCategoryAction } from "../../lib/store/slices/authSlice";
import { ConfirmModal } from "../shared/ConfirmModal";

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

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    categorySlug: string;
    categoryName: string;
  }>({
    isOpen: false,
    categorySlug: "",
    categoryName: "",
  });

  const subscribedCategories = user?.subscribedCategories || [];

  const handleUnsubscribeClick = (categorySlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      categorySlug,
      categoryName: categoryNameMap[categorySlug] || categorySlug,
    });
  };

  const handleConfirmUnsubscribe = async () => {
    try {
      await dispatch(unsubscribeCategoryAction(confirmModal.categorySlug)).unwrap();
      setConfirmModal({ isOpen: false, categorySlug: "", categoryName: "" });
    } catch (error) {
      console.error("Unsubscribe error:", error);
    }
  };

  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, categorySlug: "", categoryName: "" });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Heart className="text-red-500" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Danh mục đang theo dõi
          </h2>
          {subscribedCategories.length > 0 && (
            <span className="ml-auto text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md cursor-pointer"
            >
              Khám phá các danh mục
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subscribedCategories.map((slug) => (
              <Link
                key={slug}
                to={`/${slug}`}
                className="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                {/* Icon */}
                <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <Bell size={18} className="text-red-500" />
                </div>

                {/* Category name */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                    {categoryNameMap[slug] || slug}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Đang theo dõi
                  </p>
                </div>

                {/* Unsubscribe button */}
                <button
                  onClick={(e) => handleUnsubscribeClick(slug, e)}
                  disabled={subscriptionLoading}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Hủy theo dõi"
                >
                  {subscriptionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <BellOff size={16} />
                  )}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUnsubscribe}
        title="Hủy theo dõi danh mục"
        message={`Bạn có chắc muốn hủy theo dõi danh mục "${confirmModal.categoryName}"?`}
        confirmText="Hủy theo dõi"
        cancelText="Giữ lại"
        isLoading={subscriptionLoading}
        variant="danger"
      />
    </>
  );
};