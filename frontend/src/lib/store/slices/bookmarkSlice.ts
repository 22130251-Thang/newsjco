import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { BookmarkWithArticle, ToggleBookmarkResponse } from '../../../types/bookmark.type';
import * as bookmarkService from '../../service/bookmark-service';

interface BookmarkState {
  bookmarks:  BookmarkWithArticle[];
  bookmarkedSlugs: Set<string>;
  loading: boolean;
  error: string | null;
  toggleLoading: { [slug: string]: boolean };
}

const initialState: BookmarkState = {
  bookmarks: [],
  bookmarkedSlugs:  new Set(),
  loading: false,
  error: null,
  toggleLoading: {},
};

export const fetchBookmarks = createAsyncThunk<BookmarkWithArticle[]>(
  'bookmarks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await bookmarkService.getBookmarks();
    } catch (error:  any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách lưu');
    }
  }
);

export const checkIsBookmarked = createAsyncThunk<
  { slug: string; isBookmarked:  boolean },
  string
>(
  'bookmarks/check',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await bookmarkService.checkBookmark(slug);
      return { slug, isBookmarked: response.isBookmarked };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi kiểm tra bookmark');
    }
  }
);

export const toggleArticleBookmark = createAsyncThunk<
  ToggleBookmarkResponse & { slug: string },
  string
>(
  'bookmarks/toggle',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await bookmarkService.toggleBookmark(slug);
      return { ...response, slug };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lưu bài viết');
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearBookmarks: (state) => {
      state.bookmarks = [];
      state.bookmarkedSlugs = new Set();
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookmarks
      .addCase(fetchBookmarks.pending, (state) => {
        state. loading = true;
        state. error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
        state.bookmarkedSlugs = new Set(
          action.payload.map((b) => b.bookmark.articleSlug)
        );
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state. loading = false;
        state. error = action.payload as string;
      })
      .addCase(checkIsBookmarked.fulfilled, (state, action) => {
        if (action.payload. isBookmarked) {
          state.bookmarkedSlugs.add(action.payload.slug);
        } else {
          state.bookmarkedSlugs.delete(action.payload.slug);
        }
      })
      .addCase(toggleArticleBookmark. pending, (state, action) => {
        state. toggleLoading[action.meta. arg] = true;
      })
      .addCase(toggleArticleBookmark.fulfilled, (state, action) => {
        const { slug, isBookmarked } = action. payload;
        state.toggleLoading[slug] = false;

        if (isBookmarked) {
          state.bookmarkedSlugs.add(slug);
        } else {
          state.bookmarkedSlugs. delete(slug);
          state.bookmarks = state.bookmarks.filter(
            (b) => b.bookmark.articleSlug !== slug
          );
        }
      })
      .addCase(toggleArticleBookmark.rejected, (state, action) => {
        state.toggleLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBookmarks, clearError } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;