import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ViewHistoryItem } from '../../../types/view-history.type';
import * as viewHistoryService from '../../service/view-history-service';

interface ViewHistoryState {
    items: ViewHistoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: ViewHistoryState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchViewHistory = createAsyncThunk(
    'viewHistory/fetchViewHistory',
    async (limit: number = 20, { rejectWithValue }) => {
        try {
            return await viewHistoryService.getViewHistory(limit);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch view history');
        }
    }
);

export const addArticleView = createAsyncThunk(
    'viewHistory/addArticleView',
    async (slug: string, { rejectWithValue }) => {
        try {
            await viewHistoryService.addView(slug);
            return slug;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            return rejectWithValue(err.response?.data?.message || 'Failed to record view');
        }
    }
);

export const clearHistory = createAsyncThunk(
    'viewHistory/clearHistory',
    async (_, { rejectWithValue }) => {
        try {
            await viewHistoryService.clearViewHistory();
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            return rejectWithValue(err.response?.data?.message || 'Failed to clear history');
        }
    }
);

export const removeViewItem = createAsyncThunk(
    'viewHistory/removeViewItem',
    async (slug: string, { rejectWithValue }) => {
        try {
            await viewHistoryService.removeView(slug);
            return slug;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            return rejectWithValue(err.response?.data?.message || 'Failed to remove view');
        }
    }
);

const viewHistorySlice = createSlice({
    name: 'viewHistory',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch history
            .addCase(fetchViewHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchViewHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchViewHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Clear history
            .addCase(clearHistory.fulfilled, (state) => {
                state.items = [];
            })
            // Remove single view
            .addCase(removeViewItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.articleSlug !== action.payload);
            });
    },
});

export const { clearError } = viewHistorySlice.actions;
export default viewHistorySlice.reducer;
