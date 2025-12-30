import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Calendar, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { fetchBookmarks, toggleArticleBookmark } from '../../lib/store/slices/bookmarkSlice';

export const BookmarksPage = () => {
  const dispatch = useAppDispatch();
  const { bookmarks, loading, error, toggleLoading } = useAppSelector(
    (state) => state.bookmarks
  );

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  const handleRemoveBookmark = (slug: string) => {
    dispatch(toggleArticleBookmark(slug));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month:  '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container-main py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-main py-12">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container-main py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Bookmark className="w-6 h-6 text-orange-600 dark: text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark: text-white">
              Bài viết đã lưu
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {bookmarks.length} bài viết
            </p>
          </div>
        </div>

        {bookmarks. length === 0 ?  (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Chưa có bài viết nào được lưu
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Nhấn vào biểu tượng bookmark trên các bài viết để lưu lại đọc sau
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Khám phá tin tức
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map(({ bookmark, article }) => (
              <div
                key={bookmark.id}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <Link
                  to={`/${bookmark.articleCategory}/${bookmark.articleSlug}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={bookmark.articleImage || '/placeholder-image.jpg'}
                    alt={bookmark.articleTitle}
                    className="w-32 h-24 md:w-48 md:h-32 object-cover rounded-lg"
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/${bookmark.articleCategory}/${bookmark.articleSlug}`}
                    className="block"
                  >
                    <span className="inline-block px-2 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded mb-2">
                      {bookmark.articleCategory}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover: text-orange-600 dark: hover:text-orange-400 transition-colors line-clamp-2">
                      {bookmark.articleTitle}
                    </h3>
                  </Link>

                  {article?. description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                      {article.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark: text-gray-400">
                      <Calendar size={14} />
                      <span>Đã lưu {formatDate(bookmark.createdAt)}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveBookmark(bookmark.articleSlug)}
                      disabled={toggleLoading[bookmark.articleSlug]}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      {toggleLoading[bookmark.articleSlug] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};