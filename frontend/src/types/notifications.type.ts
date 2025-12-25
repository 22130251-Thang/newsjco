export interface Notification {
    id: number;
    userId: number;
    type: 'reply';
    message: string;
    articleSlug: string;
    categorySlug: string;
    commentId: number;
    isRead: boolean;
    createdAt: string;
}

export interface UnreadCountResponse {
    count: number;
}
