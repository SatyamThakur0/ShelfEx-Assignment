export const fetchPosts = async () => {
    try {
        // dispatch(setLoading(true));
        const response = await fetch(
            `${
                import.meta.env.VITE_BACKEND_URL
            }/api/posts/all?page=${page}&limit=5`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        // console.log(response);

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        if (data.posts.length === 0) {
            window.removeEventListener("scroll", handleInfiniteScroll);
            setLoading(false);
            setHasMore(false);
        }

        dispatch(postActions.setPosts(data.posts));
    } catch (err) {
        dispatch(postActions.setError(err.message));
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to delete post");
        }
        return true;
    } catch (err) {
        throw err;
    }
};
