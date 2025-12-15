import type { Category } from "../../types/category.type";
import apiClient from "../api.config";

export const fetchCategory = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
};
