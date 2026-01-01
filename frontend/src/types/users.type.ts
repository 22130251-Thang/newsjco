export interface User {
  id: number;
  username: string;
  useremail: string;
  password: string;
  displayName: string;
  role: string;
  avatar: string;
  bio: string;
  theme?: 'light' | 'dark';
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  address?: string;
  subscribedCategories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  useremail: string;
  password: string;
  displayName: string;
}

export interface LoginSuccessResponse {
  access_token: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile extends Omit<User, 'password'> {}

export interface SubscribeCategoryRequest {
  categorySlug: string;
}

export interface SubscribeCategoryResponse {
  message: string;
  subscribedCategories: string[];
  user: UserProfile;
}

export interface SubscribedCategoriesResponse {
  subscribedCategories: string[];
}

export interface CheckSubscriptionResponse {
  isSubscribed: boolean;
  categorySlug: string;
}
