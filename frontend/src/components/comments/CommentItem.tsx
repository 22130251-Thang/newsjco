import { ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import type { CommentWithReplies } from "../../types/comments.type";
import { getVietnameseFormattedDate } from "../../lib/utils/date-utils";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { CommentForm } from "./CommentForm";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { reactToCommentAsync } from "../../lib/store/slices/commentSlice";

const INITIAL_REPLIES_COUNT = 2;

interface CommentItemProps {
    comment: CommentWithReplies;
    replies?: CommentWithReplies[];
    onReply: (parentId: number, content: string) => Promise<void>;
}

export const CommentItem = ({ comment, replies = [], onReply }: CommentItemProps) => {
    const dispatch = useAppDispatch();
    const { slug } = useParams<{ slug: string }>();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isReplying, setIsReplying] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);

    const handleReply = async (content: string) => {
        await onReply(comment.id, content);
        setIsReplying(false);
    };

    const handleReact = async (type: 'like' | 'dislike') => {
        if (!isAuthenticated || !user || !slug) {
            alert("Vui lòng đăng nhập để thực hiện thao tác này");
            return;
        }

        const categorySlug = window.location.pathname.split('/')[1];

        await dispatch(reactToCommentAsync({
            commentId: comment.id,
            userId: user.id,
            type,
            articleSlug: slug,
            categorySlug
        }));
    };

    const hasMoreReplies = replies.length > INITIAL_REPLIES_COUNT;
    const visibleReplies = showAllReplies ? replies : replies.slice(0, INITIAL_REPLIES_COUNT);
    const hiddenRepliesCount = replies.length - INITIAL_REPLIES_COUNT;

    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                        {comment.user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
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
                    <p className="text-gray-700 leading-relaxed text-base break-all whitespace-pre-wrap">{comment.content}</p>
                    <div className="mt-3 flex items-center gap-6 text-sm text-gray-500 font-medium">
                        <button
                            onClick={() => handleReact('like')}
                            className={`flex items-center gap-1.5 transition-all group px-2 py-1 rounded-md ${comment.userReaction === 'like' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            <ThumbsUp size={16} className={comment.userReaction === 'like' ? 'fill-blue-600' : 'group-hover:fill-blue-50'} />
                            <span>{comment.likes}</span>
                        </button>
                        <button
                            onClick={() => handleReact('dislike')}
                            className={`flex items-center gap-1.5 transition-all group px-2 py-1 rounded-md ${comment.userReaction === 'dislike' ? 'text-red-600 bg-red-50' : 'hover:text-red-600 hover:bg-red-50'}`}
                        >
                            <ThumbsDown size={16} className={comment.userReaction === 'dislike' ? 'fill-red-600' : 'group-hover:fill-red-50'} />
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
                    {visibleReplies.map((reply: any) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={reply.replies}
                            onReply={onReply}
                        />
                    ))}

                    {hasMoreReplies && (
                        <button
                            onClick={() => setShowAllReplies(!showAllReplies)}
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-3 mt-2 rounded-lg hover:bg-blue-50 transition-all"
                        >
                            {showAllReplies ? (
                                <>
                                    <ChevronUp size={16} />
                                    <span>Thu gọn</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} />
                                    <span>Xem thêm {hiddenRepliesCount} phản hồi</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
