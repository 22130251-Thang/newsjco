import type { Article } from "../../types/article.type";
import apiClient from "../api.config";

export interface SearchResult {
  data: Article[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface TrendingKeywordsResponse {
  keywords: string[];
}

export const searchArticles = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  category?: string
): Promise<SearchResult> => {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category) {
    params.append("category", category);
  }

  const response = await apiClient.get<SearchResult>(
    `articles/search?${params.toString()}`
  );
  return response.data;
};

export const searchSuggestions = async (
  query: string,
  limit: number = 5
): Promise<Article[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await apiClient.get<Article[]>(
    `articles/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data;
};

export const getTrendingKeywords = async (): Promise<string[]> => {
  const response = await apiClient.get<TrendingKeywordsResponse>(
    "articles/search/trending"
  );
  return response.data.keywords;
};
