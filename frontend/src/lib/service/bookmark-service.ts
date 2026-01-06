import apiClient from '../api.config';
import type {
  BookmarkWithArticle,
  ToggleBookmarkResponse,
  CheckBookmarkResponse
} from '../../types/bookmark.type';

export const getBookmarks = async (): Promise<BookmarkWithArticle[]> => {
  const response = await apiClient.get<BookmarkWithArticle[]>('bookmarks');
  return response.data;
};

export const checkBookmark = async (slug: string): Promise<CheckBookmarkResponse> => {
  const response = await apiClient.get<CheckBookmarkResponse>(`bookmarks/check/${slug}`);
  return response.data;
};

export const addBookmark = async (slug: string): Promise<BookmarkWithArticle> => {
  const response = await apiClient.post<BookmarkWithArticle>(`bookmarks/${slug}`);
  return response.data;
};

export const removeBookmark = async (slug: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`bookmarks/${slug}`);
  return response.data;
};

export const toggleBookmark = async (slug: string): Promise<ToggleBookmarkResponse> => {
  const response = await apiClient.post<ToggleBookmarkResponse>(`bookmarks/toggle/${slug}`);
  return response.data;
};
