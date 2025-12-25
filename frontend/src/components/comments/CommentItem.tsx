import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { Comment } from "../../types/comments.type";
import { getVietnameseFormattedDate } from "../../lib/utils/date-utils";
import { useState } from "react";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
    comment: Comment;
    replies?: Comment[];
    onReply: (parentId: number, content: string) => Promise<void>;
}

export const CommentItem = ({ comment, replies = [], onReply }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);

    const handleReply = async (content: string) => {
        await onReply(comment.id, content);
        setIsReplying(false);
    };

    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                        {comment.user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {comment.user?.displayName || `User #${comment.userId}`}
                            {comment.parentId && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal uppercase">Phản hồi</span>
                            )}
                        </h4>
                        <span className="text-sm text-gray-500 italic">
                            {getVietnameseFormattedDate(new Date(comment.createdAt))}
                        </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">{comment.content}</p>
                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-500 font-medium">
                        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-all group px-2 py-1 rounded-md hover:bg-blue-50">
                            <ThumbsUp size={16} className="group-hover:fill-blue-50" />
                            <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-red-600 transition-all group px-2 py-1 rounded-md hover:bg-red-50">
                            <ThumbsDown size={16} className="group-hover:fill-red-50" />
                            <span>{comment.dislikes}</span>
                        </button>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className={`flex items-center gap-1.5 transition-all px-2 py-1 rounded-md hover:bg-gray-100 ${isReplying ? 'text-blue-600 bg-blue-50' : 'hover:text-gray-900 text-gray-500'}`}
                        >
                            <MessageSquare size={16} />
                            <span>Phản hồi</span>
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-4 pb-2">
                            <CommentForm
                                onSubmit={handleReply}
                                onCancel={() => setIsReplying(false)}
                                placeholder={`Phản hồi bình luận của ${comment.user?.displayName || "người dùng"}...`}
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>

            {replies.length > 0 && (
                <div className="ml-14 mt-2 space-y-0 border-l-2 border-gray-50 pl-2">
                    {replies.map((reply: any) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={reply.replies}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

