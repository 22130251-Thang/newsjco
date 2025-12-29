import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import articleReducer from "./slices/articleSlice";
import commentReducer from "./slices/commentSlice";
import notificationReducer from "./slices/notificationSlice";
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    article: articleReducer,
    comment: commentReducer,
    notification: notificationReducer,
    bookmarks: bookmarkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['bookmarks.bookmarkedSlugs'],
        ignoredActions: ['bookmarks/fetchAll/fulfilled', 'bookmarks/check/fulfilled', 'bookmarks/toggle/fulfilled'],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

