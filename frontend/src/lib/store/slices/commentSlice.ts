import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import type { Comment, CreateCommentRequest } from "../../../types/comments.type";
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
    error: string | null;
}

const initialState: CommentState = {
    comments: createAsyncState([]),
    error: null,
};

function addAsyncThunkCases<TData, TArg>(
    builder: ActionReducerMapBuilder<CommentState>,
    thunk: AsyncThunk<TData, TArg, object>,
    stateKey: keyof Omit<CommentState, "error">
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

export const fetchCommentsByArticle = createAsyncThunk<Comment[], string>(
    "comment/fetchByArticle",
    async (slug, { rejectWithValue }) => {
        try {
            const data = await getCommentsByArticle(slug);
            return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (error: unknown) {
            return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch comments");
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
        addAsyncThunkCases(builder, fetchCommentsByArticle, "comments");
        builder.addCase(addCommentToArticle.fulfilled, (state, action) => {
            state.comments.data = [action.payload, ...state.comments.data];
        });
    },
});

export const { clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;
