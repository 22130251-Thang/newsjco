import apiClient from "../api.config";
import type { Comment, CreateCommentRequest, PaginatedCommentResponse } from "../../types/comments.type";

export const getCommentsByArticle = async (
    slug: string,
    page: number = 1,
    limit: number = 5,
    userId?: number
): Promise<PaginatedCommentResponse> => {
    const url = `comments/article/${slug}?page=${page}&limit=${limit}${userId ? `&userId=${userId}` : ""}`;
    const response = await apiClient.get<PaginatedCommentResponse>(url);
    return response.data;
};

export const createComment = async (
    data: CreateCommentRequest
): Promise<Comment> => {
    const response = await apiClient.post<Comment>("comments", data);
    return response.data;
};

export const reactToComment = async (
    commentId: number,
    userId: number,
    type: 'like' | 'dislike',
    articleSlug: string,
    categorySlug: string
): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`comments/${commentId}/react`, {
        userId,
        type,
        articleSlug,
        categorySlug
    });
    return response.data;
};

export const updateComment = async (
    commentId: number,
    userId: number,
    content: string
): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`comments/${commentId}`, {
        userId,
        content
    });
    return response.data;
};

export const deleteComment = async (
    commentId: number,
    userId: number
): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
        `comments/${commentId}`,
        { data: { userId } }
    );
    return response.data;
};

