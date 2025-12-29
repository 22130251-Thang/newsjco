import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  LoginRequest,
  LoginSuccessResponse,
  User,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../../../types/users.type";
import { fetchUserByToken, login, register } from "../../service/auth-service";
import { updateProfile, changePassword, updateAvatar } from "../../service/user-service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

export const loginUser = createAsyncThunk<LoginSuccessResponse, LoginRequest>(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerUser = createAsyncThunk<LoginSuccessResponse, RegisterRequest>(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserByToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.status || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, UpdateProfileRequest>(
  "auth/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateProfile(data);
      return response as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changeUserPassword = createAsyncThunk<{ message: string }, ChangePasswordRequest>(
  "auth/changeUserPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await changePassword(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserAvatar = createAsyncThunk<User, string>(
  "auth/updateUserAvatar",
  async (avatarUrl, { rejectWithValue }) => {
    try {
      const response = await updateAvatar(avatarUrl);
      return response as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        if (action.payload === 401) {
          localStorage.removeItem("token");
        }
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.user = { ...state.user, ...action.payload } as User;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      .addCase(updateUserAvatar.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = { ...state.user, ...action.payload } as User;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { setUser, logout, clearError, setInitialized, clearUpdateStatus } = authSlice.actions;
export default authSlice.reducer;