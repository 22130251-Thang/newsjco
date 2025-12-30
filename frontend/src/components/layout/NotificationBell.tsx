import { useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    closeNotificationPanel,
    toggleNotificationPanel,
    addNotification,
} from "../../lib/store/slices/notificationSlice";
import { getSocket } from "../../lib/socket";
import type { Notification } from "../../types/notifications.type";
import { NotificationItem } from "../notifications/NotificationItem";

export const NotificationBell = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const panelRef = useRef<HTMLDivElement>(null);

    const { notifications, unreadCount, loading, isOpen } = useAppSelector(
        (state) => state.notification
    );
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = getSocket();
        if (!socket) return;

        const handleNewNotification = (notification: Notification) => {
            dispatch(addNotification(notification));
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [isAuthenticated, user, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                dispatch(closeNotificationPanel());
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, dispatch]);

    const handleBellClick = () => {
        dispatch(toggleNotificationPanel());
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await dispatch(markNotificationAsRead(notification.id));
        }
        dispatch(closeNotificationPanel());
        navigate(`/${notification.categorySlug}/${notification.articleSlug}#comment-${notification.commentId}`);
    };

    const handleMarkAllAsRead = async () => {
        await dispatch(markAllNotificationsAsRead());
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={handleBellClick}
                className="relative p-1.5 text-gray-600 hover:text-primary transition-colors"
                title="Thông báo"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-100 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <CheckCheck size={14} />
                                Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">
                                Đang tải...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">
                                Không có thông báo nào
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={handleNotificationClick}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
