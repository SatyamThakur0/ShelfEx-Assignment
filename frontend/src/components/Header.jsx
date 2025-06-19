import store from "@/store/store";
import { userActions } from "@/store/userSlice";
import { postActions } from "@/store/postSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
// import FetchFollowedPosts from "./custom/FetchFollowedPosts";

const Header = () => {
    const { user } = useSelector((store) => store.user);
    const { postTab } = useSelector((store) => store.post);
    const [fetchedFollowedPosts, setFetchedFollowedPosts] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
                {
                    headers: {
                        "content-type": "application/json",
                    },
                    credentials: "include",
                    method: "post",
                }
            );
            const data = await response.json();
            if (data.ok) {
                dispatch(userActions.logout());
                dispatch(postActions.clearPosts());
                navigate("/login");
                localStorage.removeItem("user");
            }
        } catch (error) {}
    };

    const handleOpenProfile = () => {
        const currentProfileId = localStorage.getItem("openedProfileId");
        if (user && user._id) {
            if (currentProfileId !== user._id) {
                dispatch(postActions.clearUserPosts());
                dispatch(postActions.setLoading(true));
            }
            navigate(`/user/${user._id}`);
            localStorage.setItem("openedProfileId", user._id);
            // If already on profile, scroll to top
            if (window.location.pathname === `/user/${user._id}`) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    return (
        <>
            <header className="bg-white border-b border-gray-400 sticky top-0 left-0 z-50 px-4 sm:px-8 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                <div className="flex flex-row items-center justify-between w-full sm:w-auto">
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="font-bold text-xl sm:text-2xl">
                            Shelf Execution
                        </div>
                        <div className="font-semibold text-sm sm:text-md">
                            Social Media
                        </div>
                    </div>
                    {/* Mobile: Avatar with popover menu aligned right */}
                    {user && (
                        <div className="sm:hidden ml-auto">
                            <Popover
                                open={avatarMenuOpen}
                                onOpenChange={setAvatarMenuOpen}
                            >
                                <Popover.Trigger asChild>
                                    <div
                                        onClick={() =>
                                            setAvatarMenuOpen((v) => !v)
                                        }
                                        className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer"
                                    >
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>
                                </Popover.Trigger>
                                <Popover.Content
                                    align="end"
                                    className="w-32 p-2 flex flex-col gap-2"
                                >
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setAvatarMenuOpen(false);
                                            handleOpenProfile();
                                        }}
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setAvatarMenuOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </Popover.Content>
                            </Popover>
                        </div>
                    )}
                </div>

                {user &&
                    ["/", "/followed-feed"].includes(
                        window.location.pathname
                    ) && (
                        <div className="sm:flex hidden bg-gray-200 px-2 py-1 rounded-sm gap-2 font-semibold items-center">
                            <div
                                className={`${
                                    postTab == "all" && "bg-white"
                                } rounded-sm py-1 px-2 cursor-pointer`}
                                onClick={() => {
                                    dispatch(postActions.setLoading(true));
                                    dispatch(postActions.setPostTab("all"));
                                    dispatch(postActions.clearFollowedPosts());
                                    navigate("./");
                                }}
                            >
                                All Posts
                            </div>
                            <div
                                className={`${
                                    postTab == "following" && "bg-white"
                                } rounded-sm py-1 px-2 cursor-pointer`}
                                onClick={() => {
                                    dispatch(postActions.setLoading(true));
                                    dispatch(
                                        postActions.setPostTab("following")
                                    );
                                    dispatch(postActions.clearPosts());
                                    navigate("/followed-feed");
                                }}
                            >
                                Following
                            </div>
                        </div>
                    )}

                {user && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        {/* Desktop: Show name, logout, avatar as before */}
                        <div className="hidden sm:flex items-center gap-3">
                            <button
                                onClick={handleLogout}
                                className="rounded-sm text-red-500 font-semibold bg-gray-200 px-3 sm:px-4 py-1 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
                            >
                                Logout
                            </button>
                            <span className="text-xs sm:text-base">
                                {user?.name}
                            </span>
                            <div
                                onClick={() => handleOpenProfile()}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 cursor-pointer"
                            >
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                ) : null}
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
