import { useEffect, useState } from "react";
import { MessageSquare, ExternalLink, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../lib/store/hooks";

interface UserComment {
  id: number;
  content: string;
  articleSlug: string;
  articleTitle: string;
  categorySlug: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5;

export const UserComments = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/comments/user/${user.id}?limit=50`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError("Không thể tải lịch sử bình luận");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const displayedComments = showAll ? comments : comments.slice(0, ITEMS_PER_PAGE);
  const hasMore = comments.length > ITEMS_PER_PAGE;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <MessageSquare size={20} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Lịch sử bình luận
        </h2>
        {comments.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {comments.length} bình luận
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <MessageSquare className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Bạn chưa có bình luận nào
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Link
                  to={`/${comment.categorySlug}/${comment.articleSlug}`}
                  className="group block"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                    "{comment.content}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 group-hover:underline flex items-center gap-1 font-medium line-clamp-1 flex-1">
                      {comment.articleTitle}
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </span>
                    <span className="flex-shrink-0">•</span>
                    <span className="flex-shrink-0">{formatDate(comment.createdAt)}</span>
                  </div>
                </Link>
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
                  Xem thêm ({comments.length - ITEMS_PER_PAGE} bình luận)
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};