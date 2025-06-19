import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./postSlice";
import userSlice from "./userSlice";
import notificationSlice from "./notificationSlice";

const store = configureStore({
    reducer: {
        post: postSlice.reducer,
        user: userSlice.reducer,
        notification: notificationSlice.reducer,
    },
});

export default store;
