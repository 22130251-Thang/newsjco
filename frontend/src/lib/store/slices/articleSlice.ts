import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import type { Article } from "../../../types/article.type";
import {
  fetchArticleBySlug,
  fetchArticlesByCategory,
  fetchEconomicArticles,
  fetchHomePageCategories,
  fetchHotNewsArticles,
  fetchMainTheGioiArticle,
  fetchMediaArticles,
  fetchThreeFeaturesArticles,
} from "../../service/article-service";

interface AsyncState<T> {
  data: T;
  loading: boolean;
}

const createAsyncState = <T>(initialData: T): AsyncState<T> => ({
  data: initialData,
  loading: false,
});

interface ArticleState {
  top3Articles: AsyncState<Article[]>;
  mainTheGioiArticle: AsyncState<Article | null>;
  homePageCategories: AsyncState<{ category: string; articles: Article[] }[]>;
  hotNewsArticles: AsyncState<Article[]>;
  mediaArticles: AsyncState<Article[]>;
  economicArticles: AsyncState<Article[]>;
  articlesByCategory: AsyncState<Article[]>;
  selectedArticleBySlug: AsyncState<Article | null>;
  error: string | null;
}

const initialState: ArticleState = {
  top3Articles: createAsyncState([]),
  mainTheGioiArticle: createAsyncState(null),
  homePageCategories: createAsyncState([]),
  hotNewsArticles: createAsyncState([]),
  mediaArticles: createAsyncState([]),
  economicArticles: createAsyncState([]),
  articlesByCategory: createAsyncState([]),
  selectedArticleBySlug: createAsyncState(null),
  error: null,
};

function addAsyncThunkCases<TData, TArg>(
  builder: ActionReducerMapBuilder<ArticleState>,
  thunk: AsyncThunk<TData, TArg, object>,
  stateKey: keyof Omit<ArticleState, "error">
): void {
  builder
    .addCase(thunk.pending, (state) => {
      (state[stateKey] as AsyncState<TData>).loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      (state[stateKey] as AsyncState<TData>).loading = false;
      (state[stateKey] as AsyncState<TData>).data = action.payload;
      state.error = null;
    })
    .addCase(thunk.rejected, (state, action) => {
      (state[stateKey] as AsyncState<TData>).loading = false;
      state.error = (action.payload as string) ?? action.error.message ?? null;
    });
}

export const getTop3FeaturesArticles = createAsyncThunk<Article[], void>(
  "article/fetchTopThreeArticles",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchThreeFeaturesArticles();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getMainTheGioiArticle = createAsyncThunk<Article | null, void>(
  "article/fetchMainTheGioiArticle",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMainTheGioiArticle();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getHotNewsArticles = createAsyncThunk<Article[], void>(
  "article/fetchHotNewsArticles",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHotNewsArticles();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getHomePageCategories = createAsyncThunk<
  { category: string; articles: Article[] }[],
  void
>("article/fetchHomePageCategories", async (_, { rejectWithValue }) => {
  try {
    return await fetchHomePageCategories();
  } catch (error: unknown) {
    return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
  }
});

export const getMediaArticles = createAsyncThunk<Article[], void>(
  "article/fetchMediaArticles",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchMediaArticles();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getEconomicArticles = createAsyncThunk<Article[], void>(
  "article/fetchEconomicArticles",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchEconomicArticles();
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getArticleBySlug = createAsyncThunk<Article, string>(
  "article/fetchArticleBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      return await fetchArticleBySlug(slug);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const getArticlesByCategory = createAsyncThunk<Article[], string>(
  "article/fetchArticlesByCategory",
  async (category, { rejectWithValue }) => {
    try {
      return await fetchArticlesByCategory(category);
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
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
    addAsyncThunkCases(builder, getTop3FeaturesArticles, "top3Articles");
    addAsyncThunkCases(builder, getMainTheGioiArticle, "mainTheGioiArticle");
    addAsyncThunkCases(builder, getHotNewsArticles, "hotNewsArticles");
    addAsyncThunkCases(builder, getHomePageCategories, "homePageCategories");
    addAsyncThunkCases(builder, getMediaArticles, "mediaArticles");
    addAsyncThunkCases(builder, getEconomicArticles, "economicArticles");
    addAsyncThunkCases(builder, getArticleBySlug, "selectedArticleBySlug");
    addAsyncThunkCases(builder, getArticlesByCategory, "articlesByCategory");
  },
});

export const { clearError } = articleSlice.actions;
export default articleSlice.reducer;
