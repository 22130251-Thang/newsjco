import apiClient from '../api.config';
import type { ReactionCount, ReactionType, ToggleReactionResponse } from '../../types/reaction.type';

export const getReactionCount = async (
  slug: string,
  userId?: number
): Promise<ReactionCount> => {
  const url = `reactions/article/${slug}${userId ? `?userId=${userId}` : ''}`;
  const response = await apiClient.get<ReactionCount>(url);
  return response.data;
};

export const toggleReaction = async (
  slug: string,
  type: ReactionType
): Promise<ToggleReactionResponse> => {
  const response = await apiClient. post<ToggleReactionResponse>(
    `reactions/article/${slug}/toggle`,
    { type }
  );
  return response.data;
};