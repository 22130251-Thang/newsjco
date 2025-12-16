import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Article } from "../../../types/article.type";
import { fetchThreeFeaturesArticles } from "../../service/article-service";
import { createSlice } from "@reduxjs/toolkit";

interface articleState {
  articles: Article[];
  top3Articles: Article[];
  loading: boolean;
  error: string | null;
}
const initialState: articleState = {
  articles: [],
  top3Articles: [],
  loading: false,
  error: null,
};

export const getTop3FeaturesArticles = createAsyncThunk<Article[], void>(
  "article/fetchTopThreeArticles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchThreeFeaturesArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTop3FeaturesArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTop3FeaturesArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.top3Articles = action.payload;
      })
      .addCase(getTop3FeaturesArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message;
      });
  },
});
export const { clearError } = articleSlice.actions;
export default articleSlice.reducer;
