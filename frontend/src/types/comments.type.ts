import type { User } from "./users.type";

export interface Comment {
    id: number;
    articleSlug: string;
    userId: number;
    content: string;
    likes: number;
    dislikes: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    parentId?: number;
    userReaction?: 'like' | 'dislike' | null;
    isEdited?: boolean;
}

export interface CreateCommentRequest {
    slug: string;
    content: string;
    userId: number;
    parentId?: number;
}

export interface CommentWithReplies extends Comment {
    replies: CommentWithReplies[];
}

export interface PaginatedCommentResponse {
    data: Comment[];
    total: number;
    page: number;
    limit: number;
}
