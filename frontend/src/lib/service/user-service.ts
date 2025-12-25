import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserProfile
} from "../../types/users. type";
import apiClient from "../api.config";

export const updateProfile = async (
  data:  UpdateProfileRequest
): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>("user/profile", data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ message:  string }> => {
  const response = await apiClient.patch<{ message: string }>("user/password", data);
  return response.data;
};

export const updateAvatar = async (
  avatar:  string
): Promise<UserProfile> => {
  const response = await apiClient.patch<UserProfile>("user/avatar", { avatar });
  return response.data;
};