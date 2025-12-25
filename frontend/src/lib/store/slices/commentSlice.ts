import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Comment, CreateCommentRequest, PaginatedCommentResponse } from "../../../types/comments.type";
import { getCommentsByArticle, createComment } from "../../service/comment-service";

interface AsyncState<T> {
    data: T;
    loading: boolean;
}

const createAsyncState = <T>(initialData: T): AsyncState<T> => ({
    data: initialData,
    loading: false,
});

interface CommentState {
    comments: AsyncState<Comment[]>;
    total: number;
    page: number;
    hasMore: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: createAsyncState([]),
    total: 0,
    page: 1,
    hasMore: false,
    error: null,
};



export const fetchCommentsByArticle = createAsyncThunk<PaginatedCommentResponse, { slug: string; page?: number; limit?: number }>(
    "comment/fetchByArticle",
    async ({ slug, page = 1, limit = 5 }, { rejectWithValue }) => {
        try {
            return await getCommentsByArticle(slug, page, limit);
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch comments");
        }
    }
);

export const loadMoreComments = createAsyncThunk<PaginatedCommentResponse, { slug: string; page: number; limit?: number }>(
    "comment/loadMore",
    async ({ slug, page, limit = 5 }, { rejectWithValue }) => {
        try {
            return await getCommentsByArticle(slug, page, limit);
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to load more comments");
        }
    }
);

export const addCommentToArticle = createAsyncThunk<Comment, CreateCommentRequest>(
    "comment/add",
    async (request, { rejectWithValue }) => {
        try {
            return await createComment(request);
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to add comment");
        }
    }
);

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        clearCommentError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsByArticle.pending, (state) => {
                state.comments.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentsByArticle.fulfilled, (state, action) => {
                state.comments.loading = false;
                state.comments.data = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;

                const currentRoots = action.payload.data.filter((c: Comment) => !c.parentId).length;
                state.hasMore = currentRoots < action.payload.total;
                state.error = null;
            })
            .addCase(fetchCommentsByArticle.rejected, (state, action) => {
                state.comments.loading = false;
                state.error = (action.payload as string) ?? action.error.message ?? null;
            })
            .addCase(loadMoreComments.pending, (state) => {
                state.comments.loading = true;
                state.error = null;
            })
            .addCase(loadMoreComments.fulfilled, (state, action) => {
                state.comments.loading = false;
                state.comments.data = [...state.comments.data, ...action.payload.data];
                state.page = action.payload.page;
                const currentRoots = state.comments.data.filter((c: Comment) => !c.parentId).length;
                state.hasMore = currentRoots < action.payload.total;
                state.error = null;
            })
            .addCase(loadMoreComments.rejected, (state, action) => {
                state.comments.loading = false;
                state.error = (action.payload as string) ?? action.error.message ?? null;
            })
            .addCase(addCommentToArticle.fulfilled, (state, action) => {
                state.comments.data = [action.payload, ...state.comments.data];
                if (!action.payload.parentId) {
                    state.total += 1;
                }
            });
    },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
