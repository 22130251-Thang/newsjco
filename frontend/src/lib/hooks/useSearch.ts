import { useState, useEffect, useCallback } from "react";
import {
  searchArticles,
  searchSuggestions,
  type SearchResult,
} from "../service/search-service";
import type { Article } from "../../types/article.type";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseSearchOptions {
  debounceMs?: number;
  suggestionsLimit?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: Article[];
  searchResults: SearchResult | null;
  isLoadingSuggestions: boolean;
  isLoadingResults: boolean;
  error: string | null;
  search: (
    query: string,
    page?: number,
    limit?: number,
    category?: string
  ) => Promise<void>;
  clearSearch: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { debounceMs = 300, suggestionsLimit = 5 } = options;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      setError(null);

      try {
        const results = await searchSuggestions(
          debouncedQuery,
          suggestionsLimit
        );
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, suggestionsLimit]);

  const search = useCallback(
    async (
      searchQuery: string,
      page: number = 1,
      limit: number = 10,
      category?: string
    ) => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        setSearchResults(null);
        return;
      }

      setIsLoadingResults(true);
      setError(null);

      try {
        const results = await searchArticles(searchQuery, page, limit, category);
        setSearchResults(results);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tìm kiếm");
        setSearchResults(null);
      } finally {
        setIsLoadingResults(false);
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    searchResults,
    isLoadingSuggestions,
    isLoadingResults,
    error,
    search,
    clearSearch,
  };
};
