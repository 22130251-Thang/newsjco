import apiClient from "../api.config";
import type { Comment, CreateCommentRequest, PaginatedCommentResponse } from "../../types/comments.type";

export const getCommentsByArticle = async (
    slug: string,
    page: number = 1,
    limit: number = 5
): Promise<PaginatedCommentResponse> => {
    const response = await apiClient.get<PaginatedCommentResponse>(`comments/article/${slug}?page=${page}&limit=${limit}`);
    return response.data;
};

export const createComment = async (
    data: CreateCommentRequest
): Promise<Comment> => {
    const response = await apiClient.post<Comment>("comments", data);
    return response.data;
};
