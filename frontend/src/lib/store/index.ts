import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import articleReducer from "./slices/articleSlice";
import commentReducer from "./slices/commentSlice";
import notificationReducer from "./slices/notificationSlice";
import bookmarkReducer from './slices/bookmarkSlice';
import reactionReducer from './slices/reactionSlice';

enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    article: articleReducer,
    comment: commentReducer,
    notification: notificationReducer,
    bookmarks: bookmarkReducer,
    reactions:  reactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['bookmarks.bookmarkedSlugs'],
        ignoredActions: ['bookmarks/fetchAll/fulfilled', 'bookmarks/check/fulfilled', 'bookmarks/toggle/fulfilled'],
        ignoredActionPaths: ['payload.bookmarkedSlugs', 'meta.arg'],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;