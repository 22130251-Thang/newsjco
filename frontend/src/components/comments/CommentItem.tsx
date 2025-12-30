import { ChevronDown, ChevronUp } from "lucide-react";
import type { CommentWithReplies } from "../../types/comments.type";
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CommentForm } from "./CommentForm";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { reactToCommentAsync } from "../../lib/store/slices/commentSlice";
import { CommentAvatar } from "./CommentAvatar";
import { CommentHeader } from "./CommentHeader";
import { CommentActions } from "./CommentActions";

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
    const { hash } = useLocation();
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hash === `#comment-${comment.id}` && commentRef.current) {
            setTimeout(() => {
                commentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [hash, comment.id]);

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
        <div
            id={`comment-${comment.id}`}
            ref={commentRef}
            className={`border-b border-gray-100 last:border-0 py-4 transition-colors duration-1000 ${hash === `#comment-${comment.id}` ? 'bg-yellow-50/50 -mx-4 px-4 rounded-lg' : ''}`}
        >
            <div className="flex gap-4">
                <CommentAvatar displayName={comment.user?.displayName} />
                <div className="flex-1 min-w-0 overflow-hidden">
                    <CommentHeader
                        user={comment.user}
                        userId={comment.userId}
                        createdAt={comment.createdAt}
                        isReply={!!comment.parentId}
                    />
                    <p className="text-gray-700 leading-relaxed text-base break-all whitespace-pre-wrap">{comment.content}</p>

                    <CommentActions
                        likes={comment.likes}
                        dislikes={comment.dislikes}
                        userReaction={comment.userReaction}
                        isReplying={isReplying}
                        onReact={handleReact}
                        onReplyClick={() => setIsReplying(!isReplying)}
                    />

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
