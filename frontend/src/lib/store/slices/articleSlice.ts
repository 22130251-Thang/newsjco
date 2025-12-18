import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Article } from "../../../types/article.type";
import {
  fetchMainTheGioiArticle,
  fetchThreeFeaturesArticles,
} from "../../service/article-service";
import { createSlice } from "@reduxjs/toolkit";

interface ArticleState {
  articles: Article[];
  top3Articles: Article[];
  mainTheGioiArticle: Article | null;
  homePageCategories: { category: string; articles: Article[] }[];
  loadingHomePageCategories: boolean;
  loadingTop3Articles: boolean;
  loadingMainTheGioiArticle: boolean;
  hotNewsArticles: Article[];
  loadingHotNewsArticles: boolean;
  mediaArticles: Article[];
  loadingMediaArticles: boolean;
  economicArticles: Article[];
  loadingEconomicArticles: boolean;
  error: string | null;
}
const initialState: ArticleState = {
  articles: [],
  top3Articles: [],
  mainTheGioiArticle: null,
  homePageCategories: [],
  loadingTop3Articles: false,
  loadingMainTheGioiArticle: false,
  hotNewsArticles: [],
  loadingHotNewsArticles: false,
  loadingHomePageCategories: false,
  mediaArticles: [],
  loadingMediaArticles: false,
  economicArticles: [],
  loadingEconomicArticles: false,
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

export const getMainTheGioiArticle = createAsyncThunk<Article | null, void>(
  "article/fetchMainTheGioiArticle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMainTheGioiArticle();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getHotNewsArticles = createAsyncThunk<Article[], void>(
  "article/fetchHotNewsArticles",
  async (_, { rejectWithValue }) => {
    try {
      const { fetchHotNewsArticles } =
        await import("../../service/article-service");
      const response = await fetchHotNewsArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getHomePageCategories = createAsyncThunk<
  { category: string; articles: Article[] }[],
  void
>("article/fetchHomePageCategories", async (_, { rejectWithValue }) => {
  try {
    const { fetchHomePageCategories } =
      await import("../../service/article-service");
    const response = await fetchHomePageCategories();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getMediaArticles = createAsyncThunk<Article[], void>(
  "article/fetchMediaArticles",
  async (_, { rejectWithValue }) => {
    try {
      const { fetchMediaArticles } =
        await import("../../service/article-service");
      const response = await fetchMediaArticles();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const getEconomicArticles = createAsyncThunk<Article[], void>(
  "article/fetchEconomicArticles",
  async (_, { rejectWithValue }) => {
    try {
      const { fetchEconomicArticles } =
        await import("../../service/article-service");
      const response = await fetchEconomicArticles();
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
      .addCase(getMainTheGioiArticle.pending, (state) => {
        state.loadingMainTheGioiArticle = true;
        state.error = null;
      })
      .addCase(getMainTheGioiArticle.fulfilled, (state, action) => {
        state.loadingMainTheGioiArticle = false;
        state.mainTheGioiArticle = action.payload;
        state.error = null;
      })
      .addCase(getMainTheGioiArticle.rejected, (state, action) => {
        state.loadingMainTheGioiArticle = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(getHotNewsArticles.pending, (state) => {
        state.loadingHotNewsArticles = true;
        state.error = null;
      })
      .addCase(getHotNewsArticles.fulfilled, (state, action) => {
        state.loadingHotNewsArticles = false;
        state.hotNewsArticles = action.payload;
        state.error = null;
      })
      .addCase(getHotNewsArticles.rejected, (state, action) => {
        state.loadingHotNewsArticles = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(getHomePageCategories.pending, (state) => {
        state.loadingHomePageCategories = true;
        state.error = null;
      })
      .addCase(getHomePageCategories.fulfilled, (state, action) => {
        state.loadingHomePageCategories = false;
        state.homePageCategories = action.payload;
        state.error = null;
      })
      .addCase(getHomePageCategories.rejected, (state, action) => {
        state.loadingHomePageCategories = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(getMediaArticles.pending, (state) => {
        state.loadingMediaArticles = true;
        state.error = null;
      })
      .addCase(getMediaArticles.fulfilled, (state, action) => {
        state.loadingMediaArticles = false;
        state.mediaArticles = action.payload;
        state.error = null;
      })
      .addCase(getMediaArticles.rejected, (state, action) => {
        state.loadingMediaArticles = false;
        state.error = (action.payload as string) ?? action.error.message;
      })
      .addCase(getEconomicArticles.pending, (state) => {
        state.loadingEconomicArticles = true;
        state.error = null;
      })
      .addCase(getEconomicArticles.fulfilled, (state, action) => {
        state.loadingEconomicArticles = false;
        state.economicArticles = action.payload;
        state.error = null;
      })
      .addCase(getEconomicArticles.rejected, (state, action) => {
        state.loadingEconomicArticles = false;
        state.error = (action.payload as string) ?? action.error.message;
      });
  },
});
export const { clearError } = articleSlice.actions;
export default articleSlice.reducer;
