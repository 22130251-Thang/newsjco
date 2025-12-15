import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  LoginRequest,
  LoginSuccessResponse,
  User,
} from "../../../types/users.type";
import { fetchUserByToken, login } from "../../service/auth-service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<LoginSuccessResponse, LoginRequest>(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
export const fetchCurrentUser = createAsyncThunk<User>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserByToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
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
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        localStorage.removeItem("token");
      });
  },
});

export const { clearError, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
