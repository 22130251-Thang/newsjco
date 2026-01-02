import { MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Comment {
  id: number;
  content: string;
  articleTitle: string;
  articleSlug: string;
  categorySlug: string;
  createdAt: string;
}

interface UserCommentsProps {
  comments: Comment[];
  loading?: boolean;
}

export const UserComments = ({ comments, loading }: UserCommentsProps) => {
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <MessageSquare size={20} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Lịch sử bình luận
          </h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {comments.length} bình luận
          </span>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <MessageSquare className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Bạn chưa có bình luận nào
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Link
                to={`/${comment.categorySlug}/${comment.articleSlug}`}
                className="group block"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                  "{comment.content}"
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-red-600 dark:text-red-400 group-hover:underline flex items-center gap-1 font-medium">
                    {comment.articleTitle}
                    <ExternalLink size={12} />
                  </span>
                  <span>•</span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};