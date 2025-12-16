import type { Article } from "../../types/article.type";
import apiClient from "../api.config";

export const fetchThreeFeaturesArticles = async () => {
  const response = await apiClient.get<Article[]>("articles/top-3-articles");
  return response.data;
};
