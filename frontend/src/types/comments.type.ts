import type { User } from "./users.type";

export interface Comment {
    id: number;
    articleGuid: string;
    userId: number;
    content: string;
    likes: number;
    dislikes: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    parentId?: number;
}

export interface CreateCommentRequest {
    slug: string;
    content: string;
    userId: number;
    parentId?: number;
}
