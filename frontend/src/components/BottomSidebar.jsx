// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { CgClapperBoard } from "react-icons/cg";
import { FaRegCompass, FaRegHeart } from "react-icons/fa";
import { FiHome, FiSearch } from "react-icons/fi";
import { RiAddBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
// import CreatePostDialog from "./CreatePostDialog";
import { useDispatch, useSelector } from "react-redux";
// import { userActions } from "@/store/userSlice";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
// import { notificationAction } from "@/store/notificationSlice";
import NotificationDialog from "./NotificationDialog";
import CreatePostDialog from "./CreatePostDialog";
import { Badge } from "./ui/badge";
import { postActions } from "@/store/postSlice";

const BottomSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.user);
    const { notiCount } = useSelector((store) => store.post);
    const [activeTab, setActiveTab] = useState("Home");
    const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
    const [isOpenNotification, setIsOpenNotification] = useState(false);

    const sidebarItems = [
        {
            icon: <FiHome className="scale-150" />,
            name: "Home",
        },
        {
            icon: <FiSearch className="scale-150" />,
            name: "Search",
        },
        {
            icon: <RiAddBoxLine className="scale-150" />,
            name: "Create",
        },
        {
            icon: (
                <div className="relative">
                    <FaRegHeart className="scale-150" />
                    {notiCount > 0 && (
                        <Badge
                            className="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums absolute -top-2 -right-2"
                            variant="destructive"
                        >
                            {notiCount}
                        </Badge>
                    )}
                </div>
            ),
            name: "Notification",
        },
    ];
    // const getNotifications = async () => {
    //     const token = localStorage.getItem("token");
    //     const payload = { token };
    //     let res = await fetch(
    //         `${
    //             import.meta.env.VITE_BACKEND_URL
    //         }/api/notification/allnotificactions`,
    //         {
    //             method: "POST",
    //             credentials: "include",
    //             headers: { "content-type": "application/json" },
    //             body: JSON.stringify(payload),
    //         }
    //     );
    //     res = await res.json();
    //     console.log(res);
    //     dispatch(notificationAction.setNotifications(res.Notifications));
    // };
    // function handleTabChange(name) {
    //     setTab(name);
    //     if (name === "create") {
    //         setOpen(true);
    //     } else if (name === "profile") {
    //         // dispatch(userActions.setProfile(null));
    //         dispatch(userActions.setProfilePost([]));
    //         dispatch(userActions.setProfile(user));
    //         localStorage.setItem("profile", JSON.stringify(user));
    //         navigate(`/profile/${user?._id}`);
    //     } else if (name === "home") {
    //         navigate("/");
    //     } else if (name === "chat") {
    //         navigate("/chat");
    //     } else if (name === "notifications") {
    //         getNotifications();
    //         setOpenNotiPanel(true);
    //         dispatch(notificationAction.setNewNotificationEmpty());
    //     }
    // }

    const handleTabClick = (tab) => {
        if (tab !== "Notification" && tab !== "Create") setActiveTab(tab);
        if (tab === "Home") {
            navigate("/");
        } else if (tab === "Search") {
            navigate("/search");
            dispatch(postActions.clearPosts());
        } else if (tab === "Create") {
            setIsOpenCreatePost(true);
        } else if (tab === "Notification") {
            setIsOpenNotification(true);
        }
    };

    return (
        <>
            <CreatePostDialog
                open={isOpenCreatePost}
                setOpen={setIsOpenCreatePost}
            />
            <NotificationDialog
                open={isOpenNotification}
                setOpen={setIsOpenNotification}
            />
            <div
                className={`z-50 bg-white sm:hidden flex w-[100%] h-16 fixed bottom-0 justify-around items-center border-t border-gray-600`}
            >
                {sidebarItems.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => handleTabClick(item.name)}
                        className={`$ {
                            activeTab === item.name && "bg-gray-100"
                        } p-4 rounded-md hover:bg-gray-100 cursor-pointer relative`}
                    >
                        {item.icon}
                    </div>
                ))}
            </div>
        </>
    );
};

export default BottomSidebar;
