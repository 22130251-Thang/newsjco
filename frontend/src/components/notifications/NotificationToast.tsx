import { useEffect, useState } from "react";
import { X, Bell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../types/notifications.type";

interface ToastProps {
    notification: Notification;
    onClose: () => void;
    duration?: number;
}

export const NotificationToast = ({ notification, onClose, duration = 5000 }: ToastProps) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        // Auto close after duration
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    };

    const handleClick = () => {
        navigate(`/${notification.categorySlug}/${notification.articleSlug}#comment-${notification.commentId}`);
        handleClose();
    };

    return (
        <div
            className={`
                max-w-sm w-full
                transform transition-all duration-300 ease-out
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <div className="flex items-center gap-2">
                        <Bell size={16} />
                        <span className="font-medium text-sm">Thông báo mới</span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div
                    onClick={handleClick}
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle size={20} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Nhấn để xem</p>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-700">
                    <div
                        className="h-full bg-red-500 transition-all ease-linear"
                        style={{
                            width: '100%',
                            animation: `shrink ${duration}ms linear forwards`
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};
