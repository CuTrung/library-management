import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "./features/book/bookSlice";
import cartSlice from "./features/cart/cartSlice";
import historySlice from "./features/history/historySlice";
import categorySlice from "./features/category/categorySlice";
import statusSlice from "./features/status/statusSlice";
import groupRoleSlice from "./features/groupRole/groupRoleSlice";

// ...

export const store = configureStore({
    reducer: {
        book: bookSlice,
        cart: cartSlice,
        history: historySlice,
        category: categorySlice,
        status: statusSlice,
        groupRole: groupRoleSlice,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
