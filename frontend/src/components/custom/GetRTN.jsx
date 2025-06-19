import { notificationActions } from "@/store/notificationSlice";
import { postActions } from "@/store/postSlice";
import { useSocket } from "@/store/SocketContext";
import { userActions } from "@/store/userSlice";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetRTN = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const notiCount = useSelector((store) => store.post.notiCount);

    // Use useCallback to keep the same function reference
    const handleNewPost = useCallback(
        (post) => {
            console.log(post);
            dispatch(postActions.incrementNotiCount());
            // Update notifications in localStorage
            const notifications =
                JSON.parse(localStorage.getItem("notifications")) || [];
            notifications.push(post);
            localStorage.setItem(
                "notifications",
                JSON.stringify(notifications)
            );

            localStorage.setItem("notiCount", notiCount + 1);
            dispatch(notificationActions.updateNotifications(notifications));
            dispatch(postActions.addPost(post));
        },
        [dispatch, notiCount]
    );

    useEffect(() => {
        if (!socket) return;
        socket.on("new-post", handleNewPost);
        return () => {
            socket.off("new-post", handleNewPost);
        };
    }, [socket, handleNewPost]);

    return null;
};

export default GetRTN;
