import { userActions } from "@/store/userSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const FetchFollwedUsers = ({ select }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchFollowedUsers = async () => {
            try {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_BACKEND_URL
                    }/api/users/get-followed-users?select=${select}`,
                    {
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const data = await res.json();
                if (data.ok) {
                    dispatch(userActions.setfollowedUsers(data.followed));
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchFollowedUsers();
    }, []);
};

export default FetchFollwedUsers;
