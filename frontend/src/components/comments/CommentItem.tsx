import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { Comment } from "../../types/comments.type";
import { getVietnameseFormattedDate } from "../../lib/utils/date-utils";

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
    return (
        <div className="flex gap-4 p-4 border-b border-gray-100 last:border-0">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                    {comment.user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                        {comment.user?.displayName || `User #${comment.userId}`}
                    </h4>
                    <span className="text-sm text-gray-500">
                        {getVietnameseFormattedDate(new Date(comment.createdAt))}
                    </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group">
                        <ThumbsUp size={16} className="group-hover:fill-blue-50" />
                        <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors group">
                        <ThumbsDown size={16} className="group-hover:fill-red-50" />
                        <span>{comment.dislikes}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
