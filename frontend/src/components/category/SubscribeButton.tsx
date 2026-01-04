import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { toggleSubscriptionAction } from "../../lib/store/slices/authSlice";

interface SubscribeButtonProps {
  categorySlug:  string;
  categoryName?:  string;
  variant?: "default" | "compact";
}

export const SubscribeButton = ({
  categorySlug,
  categoryName,
  variant = "default",
}: SubscribeButtonProps) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, subscriptionLoading } = useAppSelector(
    (state) => state.auth
  );

  const isSubscribed = user?.subscribedCategories?.includes(categorySlug) || false;

  const handleToggleSubscribe = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để theo dõi danh mục");
      return;
    }

    try {
      await dispatch(toggleSubscriptionAction(categorySlug)).unwrap();
    } catch (error) {
      console.error("Toggle subscription error:", error);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleToggleSubscribe}
        disabled={subscriptionLoading}
        className={`p-2 rounded-full transition-all duration-200 ${
          isSubscribed
            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        }`}
        title={isSubscribed ? "Hủy theo dõi" :  "Theo dõi danh mục"}
      >
        {subscriptionLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isSubscribed ? (
          <BellOff size={18} />
        ) : (
          <Bell size={18} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSubscribe}
      disabled={subscriptionLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isSubscribed
          ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          :  "bg-red-600 text-white hover: bg-red-700"
      }`}
    >
      {subscriptionLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isSubscribed ? (
        <>
          <BellOff size={18} />
          <span>Đang theo dõi</span>
        </>
      ) : (
        <>
          <Bell size={18} />
          <span>Theo dõi {categoryName || "danh mục"}</span>
        </>
      )}
    </button>
  );
};