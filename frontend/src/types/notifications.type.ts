export interface Notification {
    id: number;
    userId: number;
    type: 'reply' | 'new_article' | 'system' | string;
    message: string;
    articleSlug: string;
    categorySlug: string;
    commentId?: number;
    isRead: boolean;
    createdAt: string;
}

export interface UnreadCountResponse {
    count: number;
}