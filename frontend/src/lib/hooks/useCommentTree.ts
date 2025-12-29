import { useMemo } from "react";
import type { Comment, CommentWithReplies } from "../../types/comments.type";

export const useCommentTree = (comments: Comment[]): CommentWithReplies[] => {
    return useMemo(() => {
        const commentMap: Record<number, CommentWithReplies> = {};

        comments.forEach((comment) => {
            commentMap[comment.id] = { ...comment, replies: [] };
        });

        const roots: CommentWithReplies[] = [];

        comments.forEach((comment) => {
            const node = commentMap[comment.id];
            if (comment.parentId && commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies.push(node);
            } else if (!comment.parentId) {
                roots.push(node);
            }
        });

        return roots;
    }, [comments]);
};
