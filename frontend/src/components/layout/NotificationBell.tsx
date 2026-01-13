import { useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationItem } from "../notifications/NotificationItem";
import { useNotifications } from "../../lib/hooks/useNotifications";
import type { Notification } from "../../types/notifications.type";

export const NotificationBell = () => {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    isOpen,
    isAuthenticated,
    togglePanel,
    closePanel,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closePanel]);

  const handleBellClick = () => {
    togglePanel();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    closePanel();

    if (notification.type === "new_article" || notification.type === "system") {
      navigate(`/${notification.categorySlug}/${notification.articleSlug}`);
    } else {
      navigate(
        `/${notification.categorySlug}/${notification.articleSlug}#comment-${notification.commentId}`
      );
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleBellClick}
        className="relative p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
        title="Thông báo"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden origin-top-right transition-all">

          {/* Header của Panel */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium cursor-pointer transition-colors"
              >
                <CheckCheck size={14} />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                Đang tải thông báo...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Bạn chưa có thông báo nào
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
             <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                  onClick={closePanel}
                >
                  Đóng
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};