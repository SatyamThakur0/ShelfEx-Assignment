import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        userPosts: [],
        followedPosts: [],
        postTab: "all",
        fetchedPosts: false,
        fetchedFollowedPost: false,
        loading: true,
        error: null,
        notiCount: Number(localStorage.getItem("notiCount")) || 0,
    },
    reducers: {
        setFetchedPosts: (state, action) => {
            state.fetchedPosts = action.payload;
        },
        setFetchedFollowedPosts: (state, action) => {
            state.fetchedFollowedPost = action.payload;
        },
        setPosts: (state, action) => {
            state.posts = [...state.posts, ...action.payload];
            state.loading = false;
            state.error = null;
        },
        setFollowedPosts: (state, action) => {
            state.followedPosts = [...state.followedPosts, ...action.payload];
            state.loading = false;
            state.error = null;
        },
        setUserPosts: (state, action) => {
            state.userPosts = [...state.userPosts, ...action.payload];
            state.loading = false;
            state.error = null;
        },
        clearUserPosts: (state, action) => {
            state.userPosts = [];
            state.loading = false;
            state.error = null;
        },
        clearFollowedPosts: (state, action) => {
            state.followedPosts = [];
            state.loading = false;
            state.error = null;
        },
        clearPosts: (state) => {
            state.posts = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setPostTab: (state, action) => {
            state.postTab = action.payload;
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(
                (post) => post._id === action.payload._id
            );
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(
                (post) => post._id !== action.payload
            );
            state.userPosts = state.userPosts.filter(
                (post) => post._id !== action.payload
            );
        },
        incrementNotiCount: (state) => {
            state.notiCount = state.notiCount + 1;
            localStorage.setItem("notiCount", state.notiCount);
        },
        decrementNotiCount: (state, action) => {
            const decrementBy = action.payload || 1;
            state.notiCount = Math.max(0, state.notiCount - decrementBy);
            localStorage.setItem("notiCount", state.notiCount);
        },
        resetNotiCount: (state) => {
            state.notiCount = 0;
        },
    },
});

// export const {
//     setPosts,
//     setLoading,
//     setError,
//     addPost,
//     updatePost,
//     deletePost,
// } = postSlice.actions;
export const postActions = postSlice.actions;
export default postSlice;
