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
  loading?:  boolean;
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-red-600" />
          Bình luận gần đây
        </h2>
        <div className="space-y-4">
          {[1, 2, 3]. map((i) => (
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageSquare size={20} className="text-red-600" />
        Bình luận gần đây
      </h2>

      {comments.length === 0 ?  (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Bạn chưa có bình luận nào
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
            >
              <Link
                to={`/${comment.categorySlug}/${comment.articleSlug}`}
                className="group"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-1">
                  "{comment.content}"
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-red-600 dark:text-red-400 group-hover:underline flex items-center gap-1">
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