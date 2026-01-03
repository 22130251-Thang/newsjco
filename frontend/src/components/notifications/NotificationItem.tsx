import { Check } from "lucide-react";
import { formatRelativeTime } from "../../utils/date";
import type { Notification } from "../../types/notifications.type";

interface NotificationItemProps {
    notification: Notification;
    onClick: (notification: Notification) => void;
}

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
    return (
        <button
            onClick={() => onClick(notification)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer ${!notification.isRead ? "bg-indigo-50/50" : ""
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notification.isRead ? "bg-transparent" : "bg-indigo-500"
                        }`}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                    </p>
                </div>
                {notification.isRead && (
                    <Check size={14} className="text-gray-300 shrink-0" />
                )}
            </div>
        </button>
    );
};
