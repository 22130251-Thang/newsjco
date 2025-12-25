import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "../../../types/notifications.type";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead as markAllAsReadApi,
} from "../../service/notification-service";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    isOpen: boolean;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    isOpen: false,
};

export const fetchNotifications = createAsyncThunk<Notification[]>(
    "notification/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getNotifications();
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch notifications"
            );
        }
    }
);

export const fetchUnreadCount = createAsyncThunk<number>(
    "notification/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            return await getUnreadCount();
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch unread count"
            );
        }
    }
);

export const markNotificationAsRead = createAsyncThunk<Notification, number>(
    "notification/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            return await markAsRead(id);
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to mark as read"
            );
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk<void>(
    "notification/markAllAsRead",
    async (_, { rejectWithValue }) => {
        try {
            await markAllAsReadApi();
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to mark all as read"
            );
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        toggleNotificationPanel: (state) => {
            state.isOpen = !state.isOpen;
        },
        closeNotificationPanel: (state) => {
            state.isOpen = false;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter((n) => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(
                    (n) => n.id === action.payload.id
                );
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map((n) => ({
                    ...n,
                    isRead: true,
                }));
                state.unreadCount = 0;
            });
    },
});

export const {
    addNotification,
    toggleNotificationPanel,
    closeNotificationPanel,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
