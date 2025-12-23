import apiClient from "../api.config";
import type { Comment, CreateCommentRequest } from "../../types/comments.type";

export const getCommentsByArticle = async (slug: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`comments/article/${slug}`);
    return response.data;
};

export const createComment = async (
    data: CreateCommentRequest
): Promise<Comment> => {
    const response = await apiClient.post<Comment>("comments", data);
    return response.data;
};
