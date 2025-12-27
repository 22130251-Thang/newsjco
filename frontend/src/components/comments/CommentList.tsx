import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
    fetchCommentsByArticle,
    addCommentToArticle,
    loadMoreComments,
} from "../../lib/store/slices/commentSlice";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { LoadMoreButton } from "./LoadMoreButton";
import { EmptyComments } from "./EmptyComments";
import { CommentListLoading } from "./CommentListLoading";
import { useCommentTree } from "./hooks/useCommentTree";
import { COMMENTS_PER_PAGE } from "./constants";

interface CommentListProps {
    slug: string;
}

export const CommentList = ({ slug }: CommentListProps) => {
    const dispatch = useAppDispatch();
    const { data: comments, loading } = useAppSelector((state) => state.comment.comments);
    const { hasMore, page, total } = useAppSelector((state) => state.comment);
    const { user } = useAppSelector((state) => state.auth);

    const commentTree = useCommentTree(comments);

    useEffect(() => {
        if (slug) {
            dispatch(fetchCommentsByArticle({ slug, page: 1, limit: COMMENTS_PER_PAGE }));
        }
    }, [slug, dispatch]);

    const handleLoadMore = () => {
        if (slug && !loading && hasMore) {
            dispatch(loadMoreComments({ slug, page: page + 1, limit: COMMENTS_PER_PAGE }));
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
        <div className="mt-8 bg-white p-8 rounded-2xl">
            <CommentListHeader total={total} />

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

                {hasMore && <LoadMoreButton loading={loading} onClick={handleLoadMore} />}

                {isEmpty && <EmptyComments />}
            </div>
        </div>
    );
};

const CommentListHeader = ({ total }: { total: number }) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        Bình luận
        <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
            {total}
        </span>
    </h3>
);
