import type {
  SubscribeCategoryRequest,
  SubscribeCategoryResponse,
  SubscribedCategoriesResponse,
  CheckSubscriptionResponse,
} from "../../types/users.type";
import apiClient from "../api.config";

export const getSubscribedCategories = async (): Promise<SubscribedCategoriesResponse> => {
  const response = await apiClient.get<SubscribedCategoriesResponse>("user/subscriptions");
  return response.data;
};

export const subscribeCategory = async (
  categorySlug: string
): Promise<SubscribeCategoryResponse> => {
  const response = await apiClient.post<SubscribeCategoryResponse>("user/subscriptions", {
    categorySlug,
  });
  return response.data;
};

export const unsubscribeCategory = async (
  categorySlug: string
): Promise<SubscribeCategoryResponse> => {
  const response = await apiClient.delete<SubscribeCategoryResponse>(
    `user/subscriptions/${categorySlug}`
  );
  return response.data;
};

export const toggleSubscription = async (
  categorySlug: string
): Promise<SubscribeCategoryResponse> => {
  const response = await apiClient.patch<SubscribeCategoryResponse>(
    "user/subscriptions/toggle",
    { categorySlug }
  );
  return response.data;
};

export const checkSubscription = async (
  categorySlug: string
): Promise<CheckSubscriptionResponse> => {
  const response = await apiClient.get<CheckSubscriptionResponse>(
    `user/subscriptions/check/${categorySlug}`
  );
  return response.data;
};
