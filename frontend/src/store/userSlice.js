import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")),
        followedUsers: [],
        openedProfile: null,
        openedProfileId: localStorage.getItem("openedProfileId"),
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.followedUsers = [];
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        setfollowedUsers: (state, action) => {
            state.followedUsers = action.payload.map((user) => user.username);
            state.loading = false;
            state.error = null;
        },
        setFollowingLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFollowedError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addFollowedUser: (state, action) => {
            state.followedUsers.push(action.payload);
        },
        removeFollowedUser: (state, action) => {
            state.followedUsers = state.followedUsers.filter(
                (username) => username !== action.payload
            );
        },
        setOpenedProfile: (state, action) => {
            state.openedProfile = action.payload;
        },
        setOpenedProfileId: (state, action) => {
            state.openedProfileId = action.payload;
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice;
