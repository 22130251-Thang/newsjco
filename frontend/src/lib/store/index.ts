import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import articleReducer from "./slices/articleSlice";
import commentReducer from "./slices/commentSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    article: articleReducer,
    comment: commentReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
