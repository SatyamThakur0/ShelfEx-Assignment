import { IoNotifications, IoHome } from "react-icons/io5";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreatePostDialog from "./CreatePostDialog";
import FetchFollwedUsers from "./custom/FetchFollwedUsers";
import GetRTN from "./custom/GetRTN";
import { Badge } from "./ui/badge";
import NotificationDialog from "./NotificationDialog";
import { postActions } from "@/store/postSlice";

const Sidebar = () => {
    const { user } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const { notiCount } = useSelector((store) => store.post);
    const navigate = useNavigate();
    if (!user) navigate("/login");
    GetRTN();
    const [activeTab, setActiveTab] = useState("Home");
    const [isOpenCreatePost, setIsOpenCreatePost] = useState(false);
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const { id } = useParams();
    // const { bgColor, hoverBgColor } = useSelector((store) => store.app);
    const sidebarItems = [
        {
            icon: <IoHome className="scale-150" />,
            itemName: "Home",
        },
        {
            icon: <FaSearch className="scale-150" />,
            itemName: "Search",
        },
        {
            icon: <FaPlusSquare className="scale-150" />,
            itemName: "Create",
        },
        {
            icon: (
                <>
                    <IoNotifications className="scale-150" />
                </>
            ),
            itemName: "Notification",
        },
    ];
    const handleTabClick = (tab) => {
        tab !== "Notification" && tab !== "Create" && setActiveTab(tab);
        console.log(tab);
        if (tab === "Home") {
            navigate("./");
        } else if (tab === "Search") {
            navigate("./search");
            dispatch(postActions.clearPosts());
        } else if (tab === "Create") {
            setIsOpenCreatePost(true);
        } else if (tab === "Notification") {
            setIsOpenNotification(true);
        }
    };
    useEffect(() => {
        if (id) {
            setActiveTab("");
        }
        if (window.location.pathname == "/search") {
            setActiveTab("Search");
        }
    }, [id, window]);
    useEffect(() => {
        console.log(window.location.pathname);
    }, [window]);

    return (
        <>
            <FetchFollwedUsers select={"username -_id"} />
            <CreatePostDialog
                open={isOpenCreatePost}
                setOpen={setIsOpenCreatePost}
            />
            <NotificationDialog
                open={isOpenNotification}
                setOpen={setIsOpenNotification}
            />
            <section className="fixed w-56 h-[100vh] border-r border-gray-300 hidden sm:flex flex-col gap-2 p-4 bg-white z-40">
                {sidebarItems.map(
                    (item) =>
                        (item.itemName == "Create" &&
                        user.role == "public") || (
                            <div key={item.itemName}>
                                <div
                                    onClick={() =>
                                        handleTabClick(item.itemName)
                                    }
                                    className={`flex relative  items-center gap-2 hover:hov-bg-color text-over-bg rounded-sm py-2 px-3 cursor-pointer transition-all ${
                                        activeTab === item.itemName &&
                                        `bg-color`
                                    }`}
                                >
                                    {item.icon}
                                    <span className="hidden sm:block">
                                        {item.itemName}
                                    </span>
                                    {notiCount > 0 &&
                                        item.itemName === "Notification" && (
                                            <Badge
                                                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                                                variant="destructive"
                                            >
                                                {notiCount}
                                            </Badge>
                                        )}
                                </div>
                            </div>
                        )
                )}
            </section>
        </>
    );
};
export default Sidebar;
