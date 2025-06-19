import React, { useState } from "react";
import {
    Heart,
    MessageCircle,
    Share,
    MoreHorizontal,
    User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "@/store/postSlice";
import { deletePost as deletePostAPI } from "@/APIs/fetchPosts";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { user, openedProfile } = useSelector((store) => store.user);

    const formatTime = (date) => {
        const now = new Date();
        const diffInHours = Math.floor(
            (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
        );

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    const formatLikes = (likes) => {
        if (likes >= 1000000) return `${(likes / 1000000).toFixed(1)}M`;
        if (likes >= 1000) return `${(likes / 1000).toFixed(1)}K`;
        return likes.toString();
    };

    const canDelete =
        user && (post.author._id === user._id || user.role === "celeb");

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?"))
            return;
        try {
            await deletePostAPI(post._id);
            dispatch(postActions.deletePost(post._id));
            if (openedProfile && openedProfile._id === user._id) {
                dispatch({
                    type: "user/setOpenedProfile",
                    payload: {
                        ...openedProfile,
                        totalPosts: Math.max(
                            0,
                            (openedProfile.totalPosts || 1) - 1
                        ),
                    },
                });
            }
        } catch (err) {
            alert(err.message || "Failed to delete post");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-full sm:w-[450px] md:w-[500px]">
            {/* Header */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-3 sm:p-4 pb-2 sm:pb-3 relative gap-2 xs:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div
                        onClick={() => handleOpenProfile()}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer"
                    >
                        {user.profilePicture ? (
                            <img
                                src={post?.author.profilePicture}
                                alt={post?.author.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                        ) : null}
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {post.author.name}
                        </h3>
                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                @{post.author.username}
                            </p>
                            <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 hidden xs:block"></span>
                            <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0 hidden xs:block">
                                {formatTime(post.createdAt)}
                            </p>
                        </div>
                        {/* Show timestamp on separate line for very small screens */}
                        <p className="text-xs text-gray-500 xs:hidden">
                            {formatTime(post.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="absolute top-3 right-3">
                    {user._id === post.author._id && (
                        <button
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        >
                            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        </button>
                    )}
                    {menuOpen && canDelete && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-20">
                            <button
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-3 sm:px-4 pb-2 sm:pb-3">
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base break-words">
                    {post.caption}
                </p>
            </div>

            {/* Image */}
            {post.image && (
                <div className="relative bg-gray-100">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img
                        src={post.image}
                        alt="Post content"
                        className={`w-full h-auto max-h-[300px] sm:max-h-[400px] object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
};

export default PostCard;
