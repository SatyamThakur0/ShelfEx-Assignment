import React, { useState, useEffect } from "react";
import {
    User,
    Heart,
    MessageCircle,
    Calendar,
    Users,
    UserPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "@/store/postSlice";
import PostCard from "./PostCard";
import { userActions } from "@/store/userSlice";
import { useParams } from "react-router-dom";

const Profile = () => {
    // Mock user data - replace with actual data from your API
    const { user } = useSelector((store) => store.user);
    const { userPosts } = useSelector((store) => store.post);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState("posts");
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);

    const { openedProfile } = useSelector((store) => store.user);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/users/get-profile/${id}`,
                    {
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (data.ok) {
                    dispatch(userActions.setOpenedProfile(data.user));
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchUserDetails();
    }, [id]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/posts/${id}?page=${page}&limit=5`,
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
            console.log(data);

            if (data.posts.length === 0) {
                window.removeEventListener("scroll", handleInfiniteScroll);
                setLoading(false);
                setHasMore(false);
            }

            dispatch(postActions.setUserPosts(data.posts));
        } catch (err) {
            dispatch(postActions.setError(err.message));
        }
    };
    useEffect(() => {
        hasMore && fetchPosts();
    }, [page, id]);
    const handleInfiniteScroll = () => {
        if (
            document.documentElement.scrollTop + window.innerHeight + 1 >=
            document.documentElement.scrollHeight
        ) {
            // setPage((page) => page + 1);
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleInfiniteScroll);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPostDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && (!userPosts || userPosts.length === 0)) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-4 sm:py-8 px-2 sm:px-0">
            <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                        {/* Profile Picture */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0">
                            {openedProfile?.profilePicture ? (
                                <img
                                    src={openedProfile?.profilePicture}
                                    alt={openedProfile?.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                                />
                            ) : (
                                openedProfile?.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        {/* Profile Info */}
                        <div className="flex-1 text-center sm:text-left w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        {openedProfile?.name}
                                    </h1>
                                    <p className="text-gray-600 mb-1 text-sm sm:text-base">
                                        @{openedProfile?.username}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>
                                            Joined{" "}
                                            {formatDate(
                                                openedProfile?.createdAt
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-center sm:justify-end">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                            openedProfile?.role === "celeb"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {openedProfile?.role === "celeb"
                                            ? "⭐ Celebrity"
                                            : "👤 Public"}
                                    </span>
                                </div>
                            </div>
                            {/* Stats */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
                                <div className="text-center">
                                    <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                        {openedProfile?.following.length}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        Following
                                    </div>
                                </div>
                                {user.role === "celeb" && (
                                    <div className="text-center">
                                        <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                            {openedProfile?.followers.length}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Followers
                                        </div>
                                    </div>
                                )}
                                {user.role === "celeb" && (
                                    <div className="text-center">
                                        <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                            {openedProfile?.totalPosts}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            Posts
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border mb-6 sm:mb-8">
                    <div className="flex border-b overflow-x-auto">
                        {openedProfile?.role === "celeb" && (
                            <button
                                onClick={() => setActiveTab("posts")}
                                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                    activeTab === "posts"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Posts
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab("following")}
                            className={`px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                activeTab === "following"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Following
                        </button>
                        {openedProfile?.role === "celeb" && (
                            <button
                                onClick={() => setActiveTab("followers")}
                                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                                    activeTab === "followers"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Followers
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6 flex justify-center">
                        {activeTab === "following" && (
                            <div>
                                {openedProfile?.following.length > 0 ? (
                                    <div className="space-y-3">
                                        {openedProfile?.following.map(
                                            (followedUser) => (
                                                <UserCard
                                                    key={followedUser._id}
                                                    userData={followedUser}
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <Users
                                            size={40}
                                            className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4"
                                        />
                                        <p className="text-gray-500 text-sm sm:text-base">
                                            Not following anyone yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {openedProfile?.role === "celeb" &&
                            activeTab === "followers" && (
                                <div>
                                    {openedProfile?.followers.length > 0 ? (
                                        <div className="space-y-3">
                                            {openedProfile?.followers.map(
                                                (follower) => (
                                                    <UserCard
                                                        key={follower._id}
                                                        userData={follower}
                                                        showFollowBtn={true}
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <Users
                                                size={40}
                                                className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4"
                                            />
                                            <p className="text-gray-500 text-sm sm:text-base">
                                                No followers yet
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        {openedProfile?.role === "celeb" &&
                            activeTab === "posts" && (
                                <div>
                                    {userPosts.length > 0 ? (
                                        <div className="space-y-4 sm:space-y-6">
                                            {userPosts.map((post) => (
                                                <PostCard
                                                    key={post._id}
                                                    post={post}
                                                />
                                            ))}
                                            {loading && (
                                                <div className="flex justify-center items-center min-h-[100px] bord er border-red-500 w-full sm:w-[450px] md:w-[500px] max-w-full">
                                                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <MessageCircle
                                                size={40}
                                                className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4"
                                            />
                                            <p className="text-gray-500 text-sm sm:text-base">
                                                No posts yet
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
