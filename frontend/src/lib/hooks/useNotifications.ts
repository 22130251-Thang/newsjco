import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    closeNotificationPanel,
    toggleNotificationPanel,
    addNotification,
} from "../store/slices/notificationSlice";
import { getSocket } from "../socket";
import type { Notification } from "../../types/notifications.type";

export const useNotifications = () => {
    const dispatch = useAppDispatch();
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

    const togglePanel = () => {
        dispatch(toggleNotificationPanel());
    };

    const closePanel = () => {
        dispatch(closeNotificationPanel());
    };

    const markAsRead = (id: number) => {
        return dispatch(markNotificationAsRead(id));
    };

    const markAllAsRead = () => {
        return dispatch(markAllNotificationsAsRead());
    };

    return {
        notifications,
        unreadCount,
        loading,
        isOpen,
        isAuthenticated,
        user,
        togglePanel,
        closePanel,
        markAsRead,
        markAllAsRead,
    };
};