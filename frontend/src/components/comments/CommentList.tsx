import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
    fetchCommentsByArticle,
    addCommentToArticle,
    loadMoreComments,
    clearComments,
} from "../../lib/store/slices/commentSlice";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { LoadMoreButton } from "./LoadMoreButton";
import { EmptyComments } from "./EmptyComments";
import { CommentListLoading } from "./CommentListLoading";
import { COMMENTS_PER_PAGE } from "./constants";
import { useCommentTree } from "../../lib/hooks/useCommentTree";

interface CommentListProps {
    slug: string;
}

import { getSocket, joinArticleRoom, leaveArticleRoom } from "../../lib/socket";
import { addNewComment } from "../../lib/store/slices/commentSlice";

export const CommentList = ({ slug }: CommentListProps) => {
    const dispatch = useAppDispatch();
    const { data: comments, loading } = useAppSelector((state) => state.comment.comments);
    const { hasMore, page, total } = useAppSelector((state) => state.comment);
    const { user } = useAppSelector((state) => state.auth);
    const [aiTypingForComment, setAiTypingForComment] = useState<number | null>(null);

    const commentTree = useCommentTree(comments);

    useEffect(() => {
        if (slug) {
            dispatch(clearComments());
            dispatch(fetchCommentsByArticle({ slug, page: 1, limit: COMMENTS_PER_PAGE, userId: user?.id }));

            const socket = getSocket();

            const handleNewComment = (comment: any) => {
                dispatch(addNewComment(comment));
                // Clear AI typing indicator when AI reply arrives
                if (comment.user?.username === 'aibot') {
                    setAiTypingForComment(null);
                }
            };

            const handleAiTyping = (data: { parentId: number; isTyping: boolean }) => {
                if (data.isTyping) {
                    setAiTypingForComment(data.parentId);
                } else {
                    setAiTypingForComment(null);
                }
            };

            const setupSocketListeners = () => {
                if (socket) {
                    joinArticleRoom(slug);
                    socket.on('newComment', handleNewComment);
                    socket.on('aiTyping', handleAiTyping);
                }
            };

            if (socket?.connected) {
                setupSocketListeners();
            } else if (socket) {
                socket.once('connect', setupSocketListeners);
            }

            return () => {
                leaveArticleRoom(slug);
                if (socket) {
                    socket.off('newComment', handleNewComment);
                    socket.off('aiTyping', handleAiTyping);
                }
                dispatch(clearComments());
            };
        }
    }, [slug, dispatch, user?.id]);

    const handleLoadMore = () => {
        if (slug && !loading && hasMore) {
            dispatch(loadMoreComments({ slug, page: page + 1, limit: COMMENTS_PER_PAGE, userId: user?.id }));
        }
    };

    const handleCreateComment = async (content: string, parentId?: number) => {
        if (!user) return;

        await dispatch(
            addCommentToArticle({
                slug,
                content,
                userId: user.id,
                parentId,
            })
        ).unwrap();
    };

    if (loading && comments.length === 0) {
        return <CommentListLoading />;
    }

    const isEmpty = comments.length === 0 && !loading;

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl">
            <CommentListHeader total={total} />

            <div className="mb-10 bg-gray-50/50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                <CommentForm onSubmit={(content) => handleCreateComment(content)} />
            </div>

            <div className="space-y-2">
                {commentTree.map((comment) => (
                    <div key={comment.id}>
                        <CommentItem
                            comment={comment}
                            replies={comment.replies}
                            onReply={(parentId, content) => handleCreateComment(content, parentId)}
                        />
                        {aiTypingForComment === comment.id && (
                            <AiTypingIndicator />
                        )}
                    </div>
                ))}

                {hasMore && <LoadMoreButton loading={loading} onClick={handleLoadMore} />}

                {isEmpty && <EmptyComments />}
            </div>
        </div>
    );
};

const CommentListHeader = ({ total }: { total: number }) => (
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        Bình luận
        <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full font-medium">
            {total}
        </span>
    </h3>
);

const AiTypingIndicator = () => (
    <div className="ml-14 mt-2 py-4 border-l-2 border-gray-100 dark:border-gray-700 pl-4">
        <div className="flex gap-4">
            {/* AI Avatar - Gemini Logo */}
            <img
                src="https://static.vecteezy.com/system/resources/previews/055/687/065/non_2x/gemini-google-icon-symbol-logo-free-png.png"
                alt="AI Bot"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-white"
            />
            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">AI Bot</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-normal uppercase">Phản hồi</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span className="text-sm">Đang tóm tắt bài viết</span>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

