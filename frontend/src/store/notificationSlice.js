import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

export const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: JSON.parse(localStorage.getItem("notifications")),
    },
    reducers: {
        updateNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        clearNotificationsFromUser: (state, action) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.author._id !== action.payload
            );
        },
    },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice;
