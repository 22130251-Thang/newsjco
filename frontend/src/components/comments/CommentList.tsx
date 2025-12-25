import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchCommentsByArticle, addCommentToArticle, loadMoreComments } from "../../lib/store/slices/commentSlice";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import type { Comment } from "../../types/comments.type";

interface CommentListProps {
    slug: string;
}

export const CommentList = ({ slug }: CommentListProps) => {
    const dispatch = useAppDispatch();
    const { data: comments, loading } = useAppSelector((state) => state.comment.comments);
    const { hasMore, page, total } = useAppSelector((state) => state.comment);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (slug) {
            dispatch(fetchCommentsByArticle({ slug, page: 1, limit: 5 }));
        }
    }, [slug, dispatch]);

    const handleLoadMore = () => {
        if (slug && !loading && hasMore) {
            dispatch(loadMoreComments({ slug, page: page + 1, limit: 5 }));
        }
    };

    const commentTree = useMemo(() => {
        const commentMap: { [key: number]: Comment & { replies: Comment[] } } = {};
        const roots: (Comment & { replies: Comment[] })[] = [];

        comments.forEach(comment => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });

        comments.forEach(comment => {
            if (comment.parentId && commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies.push(commentMap[comment.id]);
            } else if (!comment.parentId) {
                roots.push(commentMap[comment.id]);
            }
        });

        return roots;
    }, [comments]);

    const handleCreateComment = async (content: string, parentId?: number) => {
        if (!user) return;

        await dispatch(addCommentToArticle({
            slug,
            content,
            userId: user.id,
            parentId,
        })).unwrap();
    };

    if (loading && comments.length === 0) {
        return <div className="py-8 text-center text-gray-500">Đang tải bình luận...</div>;
    }

    return (
        <div className="mt-8 bg-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                Bình luận
                <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
                    {total}
                </span>
            </h3>

            <div className="mb-10 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <CommentForm onSubmit={(content) => handleCreateComment(content)} />
            </div>

            <div className="space-y-2">
                {commentTree.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        replies={comment.replies}
                        onReply={(parentId, content) => handleCreateComment(content, parentId)}
                    />
                ))}

                {hasMore && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className={`px-8 py-3 rounded-xl font-bold transition-all border-2 ${loading
                                ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                : "border-indigo-100 text-indigo-600 cursor-pointer"
                                }`}
                        >
                            {loading ? "Đang tải..." : "Xem thêm bình luận"}
                        </button>
                    </div>
                )}

                {comments.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-lg">Chưa có bình luận nào.</p>
                        <p className="text-sm mt-1">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

