import apiClient from "../api.config";
import type { Notification, UnreadCountResponse } from "../../types/notifications.type";

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("notifications");
    return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>("notifications/unread-count");
    return response.data.count;
};

export const markAsRead = async (id: number): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(`notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async (): Promise<void> => {
    await apiClient.patch("notifications/read-all");
};
