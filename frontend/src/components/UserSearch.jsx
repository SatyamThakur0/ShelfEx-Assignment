import React, { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { useSelector } from "react-redux";
import { userActions } from "@/store/userSlice";
import UserCard from "./UserCard";

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { followedUsers } = useSelector((store) => store.user);

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/users/search?username=${query}`,
                {
                    headers: {
                        "content-type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            console.log(data);

            setUsers(data.celebs || []);
        } catch (err) {
            setError("Failed to search users. Please try again.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchUsers(searchTerm);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleFollowToggle = (username) => {
        if (followedUsers.includes(username)) {
            dispatch(userActions.removeFollowedUser(username));
        } else {
            dispatch(userActions.addFollowedUser(username));
        }
    };

    return (
        <div className="w-full sm:w-3/5 border border-gray-300 sm:ml-60 md:ml-80 lg:ml-110  md:w-100 max-w-2xl mx-auto p-6 bg-white">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Search Users
                </h1>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {!loading && searchTerm && users.length === 0 && !error && (
                <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No users found matching "{searchTerm}"</p>
                </div>
            )}

            {users.length > 0 && (
                <div className="space-y-4">
                    {users.map((user) => (
                        <UserCard
                            key={user.username}
                            user={user}
                            followedUsers={followedUsers}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
