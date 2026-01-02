import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, X, Loader2 } from "lucide-react";
import {
  searchArticles,
  getTrendingKeywords,
  type SearchResult,
} from "../../lib/service/search-service";
import { SearchBar } from "../../components/search/SearchBar";
import type { Article } from "../../types/article.type";

const categoryNameMap: Record<string, string> = {
  "khoa-hoc-cong-nghe": "Khoa học - Công nghệ",
  "doi-song": "Đời sống",
  "giai-tri": "Giải trí",
  "giao-duc": "Giáo dục",
  "kinh-doanh": "Kinh doanh",
  "phap-luat": "Pháp luật",
  "suc-khoe": "Sức khỏe",
  "the-gioi": "Thế giới",
  "the-thao": "Thể thao",
  "thoi-su": "Thời sự",
  "dia-phuong": "Địa phương",
  "kinh-te": "Kinh tế",
  "van-hoa": "Văn hóa",
  "quan-su": "Quân sự",
};

const categories = Object.keys(categoryNameMap);

const SearchResultItem = ({ article }: { article: Article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link
      to={`/${article.category}/${article.slug}`}
      className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm
        hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    >
      <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0
        flex items-center justify-center"
      >
        <span className="text-3xl">📰</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="text-lg font-semibold text-gray-800 dark:text-white
          line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span
            className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30
            text-red-600 dark:text-red-400 rounded"
          >
            {categoryNameMap[article.category] || article.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {formatDate(article.pubDate)}
          </span>
          {article.author && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {article.author}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300"
      >
        Trước
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors
            ${
              page === currentPage
                ? "bg-red-600 text-white border-red-600"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700
          text-gray-700 dark:text-gray-300"
      >
        Sau
      </button>
    </div>
  );
};

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const categoryParam = searchParams.get("category") || "";

  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  useEffect(() => {
    getTrendingKeywords().then(setTrendingKeywords).catch(console.error);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!queryParam) {
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchArticles(
          queryParam,
          pageParam,
          10,
          selectedCategory || undefined
        );
        setSearchResults(results);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tìm kiếm");
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [queryParam, pageParam, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchParams({
      q: query,
      page: "1",
      ...(selectedCategory && { category: selectedCategory }),
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      q: queryParam,
      page: page.toString(),
      ...(selectedCategory && { category: selectedCategory }),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({
      q: queryParam,
      page: "1",
      ...(category && { category }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-main max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Search className="text-red-600" />
            Tìm kiếm bài viết
          </h1>

          <SearchBar variant="expanded" onSearch={handleSearch} />

          {!queryParam && trendingKeywords.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Từ khóa phổ biến:
              </p>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(keyword)}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200
                      dark:border-gray-700 rounded-full hover:border-red-500 hover:text-red-600
                      dark:hover:text-red-400 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {queryParam && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Filter size={14} />
              Lọc theo:
            </span>

            <button
              onClick={() => handleCategoryChange("")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                !selectedCategory
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Tất cả
            </button>

            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {categoryNameMap[cat]}
              </button>
            ))}
          </div>
        )}

        {queryParam && searchResults && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy <strong>{searchResults.meta.totalItems}</strong> kết quả
              cho "{queryParam}"
              {selectedCategory && ` trong ${categoryNameMap[selectedCategory]}`}
            </p>

            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange("")}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X size={14} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-red-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Đang tìm kiếm...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
            rounded-lg p-4 text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {!isLoading && searchResults && searchResults.data.length > 0 && (
          <div className="space-y-4">
            {searchResults.data.map((article) => (
              <SearchResultItem key={article.id} article={article} />
            ))}
          </div>
        )}

        {!isLoading &&
          queryParam &&
          searchResults &&
          searchResults.data.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Không có bài viết nào phù hợp với "{queryParam}"
                {selectedCategory &&
                  ` trong ${categoryNameMap[selectedCategory]}`}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Gợi ý:</p>
                <ul className="list-disc list-inside text-left max-w-md mx-auto">
                  <li>Kiểm tra lỗi chính tả</li>
                  <li>Thử từ khóa khác</li>
                  <li>Sử dụng từ khóa ngắn gọn hơn</li>
                  {selectedCategory && <li>Thử tìm trong tất cả danh mục</li>}
                </ul>
              </div>
            </div>
          )}

        {!isLoading && searchResults && searchResults.meta.totalPages > 1 && (
          <Pagination
            currentPage={searchResults.meta.currentPage}
            totalPages={searchResults.meta.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {!queryParam && (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm bài viết
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Nhập từ khóa để tìm kiếm trong hàng ngàn bài viết
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
