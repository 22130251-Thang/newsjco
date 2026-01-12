import apiClient from '../api.config';
import type {
    ViewHistoryItem,
    AddViewResponse,
    ClearHistoryResponse,
} from '../../types/view-history.type';

export const addView = async (slug: string): Promise<AddViewResponse> => {
    const response = await apiClient.post<AddViewResponse>(`view-history/${slug}`);
    return response.data;
};

export const getViewHistory = async (limit: number = 20): Promise<ViewHistoryItem[]> => {
    const response = await apiClient.get<ViewHistoryItem[]>('view-history', {
        params: { limit },
    });
    return response.data;
};

export const clearViewHistory = async (): Promise<ClearHistoryResponse> => {
    const response = await apiClient.delete<ClearHistoryResponse>('view-history');
    return response.data;
};

export const removeView = async (slug: string): Promise<ClearHistoryResponse> => {
    const response = await apiClient.delete<ClearHistoryResponse>(`view-history/${slug}`);
    return response.data;
};

export const getViewCount = async (slug: string): Promise<{ viewCount: number }> => {
    const response = await apiClient.get<{ viewCount: number }>(`view-history/count/${slug}`);
    return response.data;
};
