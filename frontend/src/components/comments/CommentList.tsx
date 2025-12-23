import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchCommentsByArticle, addCommentToArticle } from "../../lib/store/slices/commentSlice";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
    slug: string;
}

export const CommentList = ({ slug }: CommentListProps) => {
    const dispatch = useAppDispatch();
    const { data: comments, loading } = useAppSelector((state) => state.comment.comments);
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (slug) {
            dispatch(fetchCommentsByArticle(slug));
        }
    }, [slug, dispatch]);

    const handleCreateComment = async (content: string) => {
        if (!user) return;

        dispatch(addCommentToArticle({
            slug,
            content,
            userId: user.id,
        }));
    };

    if (loading && comments.length === 0) {
        return <div className="py-8 text-center text-gray-500">Đang tải bình luận...</div>;
    }

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Bình luận ({comments.length})
            </h3>

            <CommentForm onSubmit={handleCreateComment} />

            <div className="space-y-0">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
                {comments.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </div>
                )}
            </div>
        </div>
    );
};
