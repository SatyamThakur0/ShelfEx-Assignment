import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "./PostCard";
import { postActions } from "@/store/postSlice";

const PostList = () => {
    const dispatch = useDispatch();
    const { posts, error, loading } = useSelector((store) => store.post);
    const { user } = useSelector((store) => store.user);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [bottomLoader, setBottomLoader] = useState(true);

    const fetchPosts = async () => {
        try {
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

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            const data = await response.json();
            if (data.posts.length === 0) {
                window.removeEventListener("scroll", handleInfiniteScroll);
                dispatch(postActions.setLoading(false));
                setHasMore(false);
                setBottomLoader(false);
            }

            dispatch(postActions.setPosts(data.posts));
        } catch (err) {
            dispatch(postActions.setError(err.message));
        }
    };

    useEffect(() => {
        hasMore && fetchPosts();
    }, [dispatch, page]);

    const handleInfiniteScroll = () => {
        if (
            document.documentElement.scrollTop + window.innerHeight + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
    }, []);

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">Error: {error}</div>
        );
    }

    if (loading && (!posts || posts.length === 0)) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 w-full max-w-2xl mx-auto px-4">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
                {bottomLoader && posts.length > 0 && (
                    <div className="flex justify-center items-center min-h-[60px] w-full">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PostList;
