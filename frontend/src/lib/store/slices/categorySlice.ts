import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Category } from "../../../types/category.type";
import { fetchCategory } from "../../service/category-service";

interface categoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}
const initialState: categoryState = {
  categories: [],
  loading: false,
  error: null,
};
export const getCategories = createAsyncThunk<Category[], void>(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCategory();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message;
      });
  },
});
export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
