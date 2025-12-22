
import type { LoginRequest, LoginSuccessResponse, User } from "../../types/users.type";
import apiClient from "../api.config";

export const login = async (
  data: LoginRequest
): Promise<LoginSuccessResponse> => {
  const response = await apiClient.post<LoginSuccessResponse>("auth/login", {
    username: data.username,
    password: data.password,
  });
  return response.data
};

export const register = async (data: {
  username: string;
  useremail: string;
  password: string;
  displayName: string;
}): Promise<LoginSuccessResponse> => {
  const response = await apiClient.post<LoginSuccessResponse>("auth/register", data);
  return response.data
};

export const fetchUserByToken = async (): Promise<User> => {
  const response = await apiClient.get<User>("user/profile")
  return response.data
}