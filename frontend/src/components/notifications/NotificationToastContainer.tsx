import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../lib/store/hooks";
import { getSocket } from "../../lib/socket";
import { NotificationToast } from "./NotificationToast";
import type { Notification } from "../../types/notifications.type";

interface ToastItem {
    id: number;
    notification: Notification;
}

export const NotificationToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const socket = getSocket();
        if (!socket) return;

        const handleNewNotification = (notification: Notification) => {
            const newToast: ToastItem = {
                id: Date.now(),
                notification,
            };

            setToasts((prev) => {
                // Limit to 3 toasts at a time
                const updated = [...prev, newToast];
                if (updated.length > 3) {
                    return updated.slice(-3);
                }
                return updated;
            });
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [isAuthenticated, user]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] space-y-3">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{
                        transform: `translateY(${index * 8}px)`,
                        zIndex: 9999 - index,
                    }}
                >
                    <NotificationToast
                        notification={toast.notification}
                        onClose={() => removeToast(toast.id)}
                        duration={5000}
                    />
                </div>
            ))}
        </div>
    );
};
