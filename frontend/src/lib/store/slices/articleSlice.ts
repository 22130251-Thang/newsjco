import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Article } from "../../../types/article.type";
import {
  fetchThreeFeaturesArticles,
  fetchTop10ThoiSuArticles,
} from "../../service/article-service";
import { createSlice } from "@reduxjs/toolkit";

interface ArticleState {
  articles: Article[];
  top3Articles: Article[];
  top10ThoiSuArticles: Article[];
  loadingTop3Articles: boolean;
  loadingTop10ThoiSuArticles: boolean;
  error: string | null;
}
const initialState: ArticleState = {
  articles: [],
  top3Articles: [],
  top10ThoiSuArticles: [],
  loadingTop10ThoiSuArticles: false,
  loadingTop3Articles: false,
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

export const getTop10ThoiSuArticles = createAsyncThunk<Article[], void>(
  "article/fetchTop10Articles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTop10ThoiSuArticles();
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
        state.loadingTop3Articles = true;
        state.error = null;
      })
      .addCase(getTop3FeaturesArticles.fulfilled, (state, action) => {
        state.loadingTop3Articles = false;
        state.error = null;
        state.top3Articles = action.payload;
      })
      .addCase(getTop3FeaturesArticles.rejected, (state, action) => {
        state.loadingTop3Articles = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(getTop10ThoiSuArticles.pending, (state) => {
        state.loadingTop10ThoiSuArticles = true;
        state.error = null;
      })
      .addCase(getTop10ThoiSuArticles.fulfilled, (state, action) => {
        state.loadingTop10ThoiSuArticles = false;
        state.top10ThoiSuArticles = action.payload;
        state.error = null;
      })
      .addCase(getTop10ThoiSuArticles.rejected, (state, action) => {
        state.loadingTop10ThoiSuArticles = false;
        state.error = (action.payload as string) ?? action.error.message;
      });
  },
});
export const { clearError } = articleSlice.actions;
export default articleSlice.reducer;
