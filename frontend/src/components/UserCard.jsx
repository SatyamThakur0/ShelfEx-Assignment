import React from "react";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";
import { postActions } from "@/store/postSlice";
import { toast } from "sonner";
const UserCard = ({ user, followedUsers }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleFollowToggle = async (username) => {
        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/users/follow/${username}`,
                {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                    },
                    credentials: "include",
                }
            );
            const data = await res.json();
            console.log(data);

            if (data.ok) {
                if (data.type === "follow") {
                    dispatch(userActions.addFollowedUser(username));
                } else if (data.type === "unfollow") {
                    dispatch(userActions.removeFollowedUser(username));
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <div
            key={user.username}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
            <div
                onClick={() => {
                    dispatch(postActions.clearUserPosts());
                    localStorage.setItem("openedProfileId", user._id);
                    dispatch(userActions.setOpenedProfileId(user._id));
                    navigate(`/user/${user._id}`);
                }}
                className="flex items-center space-x-4"
            >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600 text-sm">@{user.username}</p>
                </div>
            </div>

            <button
                onClick={() => handleFollowToggle(user.username)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    followedUsers.includes(user.username)
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
                {followedUsers.includes(user.username) ? "Unfollow" : "Follow"}
            </button>
        </div>
    );
};

export default UserCard;
