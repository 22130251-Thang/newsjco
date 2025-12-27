import axios from 'axios';
import type {
  BookmarkWithArticle,
  ToggleBookmarkResponse,
  CheckBookmarkResponse
} from '../../types/bookmark.type';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization:  `Bearer ${token}` } : {};
};

export const getBookmarks = async (): Promise<BookmarkWithArticle[]> => {
  const response = await axios.get(`${API_URL}/bookmarks`, {
    headers: getAuthHeader(),
  });
  return response. data;
};

export const checkBookmark = async (slug: string): Promise<CheckBookmarkResponse> => {
  const response = await axios.get(`${API_URL}/bookmarks/check/${slug}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const addBookmark = async (slug: string): Promise<BookmarkWithArticle> => {
  const response = await axios.post(
    `${API_URL}/bookmarks/${slug}`,
    {},
    { headers: getAuthHeader() }
  );
  return response. data;
};

export const removeBookmark = async (slug: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/bookmarks/${slug}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const toggleBookmark = async (slug: string): Promise<ToggleBookmarkResponse> => {
  const response = await axios.post(
    `${API_URL}/bookmarks/toggle/${slug}`,
    {},
    { headers:  getAuthHeader() }
  );
  return response.data;
};