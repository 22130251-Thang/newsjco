import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, ExternalLink, Loader2, Image, ChevronDown, ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchViewHistory, removeViewItem, clearHistory } from "../../lib/store/slices/viewHistorySlice";
import { formatRelativeTime } from "../../utils/date";


const ITEMS_PER_PAGE = 5;

export const ViewHistory = () => {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state) => state.viewHistory);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        dispatch(fetchViewHistory(50)); // Fetch more items
    }, [dispatch]);



    const handleRemove = (slug: string) => {
        dispatch(removeViewItem(slug));
    };

    const handleClearAll = () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử xem?")) {
            dispatch(clearHistory());
        }
    };

    // Show limited items or all based on state
    const displayedItems = showAll ? items : items.slice(0, ITEMS_PER_PAGE);
    const hasMore = items.length > ITEMS_PER_PAGE;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Clock size={20} className="text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Lịch sử xem
                </h2>
                {items.length > 0 && (
                    <>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {items.length} bài viết
                        </span>
                        <button
                            onClick={handleClearAll}
                            className="ml-auto text-sm text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            Xóa tất cả
                        </button>
                    </>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="animate-spin text-red-500" size={32} />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : items.length === 0 ? (
                <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Clock className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        Chưa có lịch sử xem bài viết
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {displayedItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                                {/* Thumbnail */}
                                <div className="shrink-0">

                                    {item.article?.thumbnail ? (
                                        <img
                                            src={item.article.thumbnail}
                                            alt=""
                                            className="w-24 h-16 sm:w-32 sm:h-20 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-24 h-16 sm:w-32 sm:h-20 rounded-lg bg-linear-to-br from-red-100 to-red-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center ${item.article?.thumbnail ? 'hidden' : ''}`}>

                                        <Image className="text-red-400 dark:text-gray-500" size={24} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <Link
                                        to={`/${item.article?.category || "tin-tuc"}/${item.articleSlug}`}
                                        className="group/link"
                                    >
                                        <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover/link:text-red-600 dark:group-hover/link:text-red-400 transition-colors leading-snug">
                                            {item.article?.title || item.articleSlug.replace(/-/g, ' ')}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatRelativeTime(item.viewedAt)}
                                        </span>
                                        {item.article?.category && (
                                            <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                                                {item.article.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => handleRemove(item.articleSlug)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                                        title="Xóa khỏi lịch sử"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <Link
                                        to={`/${item.article?.category || "tin-tuc"}/${item.articleSlug}`}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer"
                                        title="Xem bài viết"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show More / Show Less Button */}
                    {hasMore && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                        >
                            {showAll ? (
                                <>
                                    <ChevronUp size={18} />
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={18} />
                                    Xem thêm ({items.length - ITEMS_PER_PAGE} bài viết)
                                </>
                            )}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
