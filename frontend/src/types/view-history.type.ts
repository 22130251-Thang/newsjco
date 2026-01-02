export interface ViewHistoryItem {
    id: number;
    articleSlug: string;
    viewedAt: string;
    article: {
        title: string;
        category: string;
        thumbnail?: string;
    } | null;
}

export interface AddViewResponse {
    success: boolean;
    message: string;
}

export interface ClearHistoryResponse {
    success: boolean;
    message: string;
}
