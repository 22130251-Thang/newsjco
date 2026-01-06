import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Trash2, ExternalLink, Loader2, Image, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchBookmarks, toggleArticleBookmark } from "../../lib/store/slices/bookmarkSlice";
import { formatRelativeTime } from "../../utils/date";

const ITEMS_PER_PAGE = 5;

export const UserBookmarks = () => {
    const dispatch = useAppDispatch();
    const { bookmarks, loading, error, toggleLoading } = useAppSelector((state) => state.bookmarks);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        dispatch(fetchBookmarks());
    }, [dispatch]);

    const handleRemove = (slug: string) => {
        dispatch(toggleArticleBookmark(slug));
    };

    const displayedItems = showAll ? bookmarks : bookmarks.slice(0, ITEMS_PER_PAGE);
    const hasMore = bookmarks.length > ITEMS_PER_PAGE;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/30 rounded-lg">

                    <Bookmark size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Bài viết đã lưu
                </h2>
                {bookmarks.length > 0 && (
                    <span className="text-sm text-red-500 dark:text-red-400 bg-linear-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/20 px-3 py-1 rounded-full border border-red-200/50 dark:border-red-700/30">

                        {bookmarks.length} bài viết
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="relative">
                        <Loader2 className="animate-spin text-red-500" size={32} />
                        <div className="absolute inset-0 blur-xl bg-red-400/30 animate-pulse"></div>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-10 px-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="relative w-20 h-20 mx-auto mb-5">
                        <div className="absolute inset-0 bg-linear-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-900/20 rounded-2xl rotate-6"></div>

                        <div className="relative w-full h-full bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg border border-red-100 dark:border-red-800/30">
                            <Bookmark className="text-red-400 dark:text-red-500" size={32} />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                        Chưa có bài viết nào được lưu
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Nhấn vào biểu tượng bookmark để lưu bài viết yêu thích
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {displayedItems.map(({ bookmark }) => (
                            <div
                                key={bookmark.id}
                                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl group border border-gray-100 dark:border-gray-700"
                            >
                                <div className="shrink-0">

                                    {bookmark.articleImage ? (
                                        <img
                                            src={bookmark.articleImage}
                                            alt=""
                                            className="w-24 h-16 sm:w-32 sm:h-20 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg bg-linear-to-br from-red-100 to-red-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center ${bookmark.articleImage ? 'hidden' : ''}`}>

                                        <Image className="text-red-500 dark:text-gray-500" size={24} />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <Link
                                        to={`/${bookmark.articleCategory}/${bookmark.articleSlug}`}
                                        className="group/link"
                                    >
                                        <span className="inline-block text-xs font-medium text-red-600 dark:text-red-400 bg-red-100/80 dark:bg-red-900/30 px-2 py-0.5 rounded mb-1.5">
                                            {bookmark.articleCategory}
                                        </span>
                                        <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover/link:text-red-600 dark:group-hover/link:text-red-400 transition-colors leading-snug">
                                            {bookmark.articleTitle}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatRelativeTime(bookmark.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => handleRemove(bookmark.articleSlug)}
                                        disabled={toggleLoading[bookmark.articleSlug]}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Xóa khỏi danh sách lưu"
                                    >
                                        {toggleLoading[bookmark.articleSlug] ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                    <Link
                                        to={`/${bookmark.articleCategory}/${bookmark.articleSlug}`}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                                        title="Xem bài viết"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-linear-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-900/30 rounded-lg transition-all cursor-pointer border border-red-200/50 dark:border-red-700/30 hover:shadow-md"

                        >
                            {showAll ? (
                                <>
                                    <ChevronUp size={18} />
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={18} />
                                    Xem thêm ({bookmarks.length - ITEMS_PER_PAGE} bài viết)
                                </>
                            )}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
