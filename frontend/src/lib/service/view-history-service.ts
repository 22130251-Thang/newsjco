import axios from 'axios';
import type {
    ViewHistoryItem,
    AddViewResponse,
    ClearHistoryResponse,
} from '../../types/view-history.type';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addView = async (slug: string): Promise<AddViewResponse> => {
    const response = await axios.post(
        `${API_URL}/view-history/${slug}`,
        {},
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const getViewHistory = async (limit: number = 20): Promise<ViewHistoryItem[]> => {
    const response = await axios.get(`${API_URL}/view-history`, {
        headers: getAuthHeader(),
        params: { limit },
    });
    return response.data;
};

export const clearViewHistory = async (): Promise<ClearHistoryResponse> => {
    const response = await axios.delete(`${API_URL}/view-history`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const removeView = async (slug: string): Promise<ClearHistoryResponse> => {
    const response = await axios.delete(`${API_URL}/view-history/${slug}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
