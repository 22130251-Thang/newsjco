import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../../lib/hooks/useSearch";
import type { Article } from "../../types/article.type";

interface SearchBarProps {
  variant?: "default" | "expanded";
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({
  variant = "default",
  placeholder = "Tìm kiếm bài viết...",
  onSearch,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { query, setQuery, suggestions, isLoadingSuggestions, clearSearch } =
    useSearch({ debounceMs: 300, suggestionsLimit: 5 });

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (article: Article) => {
    saveRecentSearch(article.title);
    setIsFocused(false);
    navigate(`/${article.category}/${article.slug}`);
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    saveRecentSearch(searchTerm);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown =
    isFocused &&
    (suggestions.length > 0 ||
      recentSearches.length > 0 ||
      query.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center ${variant === "expanded" ? "w-full" : "w-[200px]"
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={`w-full pl-3 pr-16 py-1.5 text-sm border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              dark:bg-gray-800 dark:border-gray-600 dark:text-white
              ${variant === "expanded" ? "py-3 text-base" : ""}`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}

            {isLoadingSuggestions ? (
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            ) : (
              <button
                type="submit"
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Search size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                <Clock size={12} />
                Tìm kiếm gần đây
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700
                      text-gray-700 dark:text-gray-300 rounded group hover:bg-gray-200
                      dark:hover:bg-gray-600 transition-colors"
                  >
                    <button
                      onClick={() => handleRecentClick(term)}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      {term}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter((_, i) => i !== index);
                        setRecentSearches(updated);
                        localStorage.setItem("recentSearches", JSON.stringify(updated));
                      }}
                      className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSuggestionClick(article)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-1">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {article.description}
                  </p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30
                    text-red-600 dark:text-red-400 rounded"
                  >
                    {article.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 &&
            suggestions.length === 0 &&
            !isLoadingSuggestions && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không tìm thấy kết quả cho "{query}"
                </p>
                <button
                  onClick={handleSubmit}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Tìm kiếm "{query}" →
                </button>
              </div>
            )}

          {query && suggestions.length > 0 && (
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                saveRecentSearch(query);
                setIsFocused(false);
              }}
              className="block px-4 py-3 text-center text-sm text-red-600 dark:text-red-400
                hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Xem tất cả kết quả cho "{query}" →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
