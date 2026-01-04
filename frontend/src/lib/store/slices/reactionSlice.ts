import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ReactionCount, ReactionType } from '../../../types/reaction.type';
import * as reactionService from '../../service/reaction-service';

interface ReactionState {
  reactions: Record<string, ReactionCount>;
  loading: Record<string, boolean>;
  error: string | null;
}

const initialState:  ReactionState = {
  reactions: {},
  loading: {},
  error: null,
};

export const fetchReactionCount = createAsyncThunk(
  'reactions/fetchCount',
  async ({ slug, userId }: { slug: string; userId?:  number }) => {
    const data = await reactionService.getReactionCount(slug, userId);
    return { slug, data };
  }
);

export const toggleArticleReaction = createAsyncThunk(
  'reactions/toggle',
  async ({ slug, type }:  { slug: string; type: ReactionType }) => {
    const response = await reactionService.toggleReaction(slug, type);
    return { slug, counts: response.counts };
  }
);

const reactionSlice = createSlice({
  name:  'reactions',
  initialState,
  reducers: {
    clearReactionError: (state) => {
      state. error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReactionCount. pending, (state, action) => {
        state.loading[action.meta.arg. slug] = true;
      })
      .addCase(fetchReactionCount.fulfilled, (state, action) => {
        const { slug, data } = action.payload;
        state.reactions[slug] = data;
        state.loading[slug] = false;
        state.error = null;
      })
      .addCase(fetchReactionCount. rejected, (state, action) => {
        state.loading[action.meta.arg.slug] = false;
        state. error = action.error.message || 'Lỗi khi tải reactions';
      })
      .addCase(toggleArticleReaction.pending, (state, action) => {
        state.loading[action.meta.arg. slug] = true;
      })
      .addCase(toggleArticleReaction. fulfilled, (state, action) => {
        const { slug, counts } = action. payload;
        state.reactions[slug] = counts;
        state. loading[slug] = false;
        state.error = null;
      })
      .addCase(toggleArticleReaction.rejected, (state, action) => {
        state.loading[action.meta. arg.slug] = false;
        state.error = action. error.message || 'Lỗi khi cập nhật reaction';
      });
  },
});

export const { clearReactionError } = reactionSlice.actions;
export default reactionSlice.reducer;