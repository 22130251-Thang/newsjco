import type { Article } from "../../types/article.type";
import apiClient from "../api.config";

export const fetchThreeFeaturesArticles = async () => {
  const response = await apiClient.get<Article[]>("articles/top-3-articles");
  return response.data;
};
export const fetchTop10ThoiSuArticles = async () => {
  const response = await apiClient.get<Article[]>(
    "articles/top-10-thoi-su-articles",
  );
  return response.data;
};
