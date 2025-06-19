import React, { useState } from "react";
import { Bell, X, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notificationActions } from "@/store/notificationSlice";

const NotificationDialog = ({ open, setOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = useSelector((store) => store.notification);
    const { notiCount } = useSelector((store) => store.post);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const NotificationCard = ({ notification }) => {
        const handleNotificationClick = () => {
            // Count notifications from this user
            const userNotiCount = notifications.filter(
                (n) => n.author._id === notification?.author._id
            ).length;
            dispatch(
                notificationActions.clearNotificationsFromUser(
                    notification?.author._id
                )
            );
            if (userNotiCount > 0) {
                dispatch({
                    type: "post/decrementNotiCount",
                    payload: userNotiCount,
                });
            }
            navigate(`/user/${notification?.author._id}`);
            setOpen(false);
        };
        return (
            <Card
                onClick={handleNotificationClick}
                className="mb-3 last:mb-0 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200"
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        {/* Left side - User info and action */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarImage
                                    src={notification?.author.profilePicture}
                                    alt={notification?.author.name}
                                />
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                                        {notification?.author.name}
                                    </h4>
                                    <span className="text-xs text-gray-500 truncate">
                                        @{notification?.author.username}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-700 mt-1">
                                    created a post
                                </p>

                                {/* <span className="text-xs text-gray-500 mt-2 block">
                                    {notification?.time}
                                </span> */}
                            </div>
                        </div>

                        {/* Right side - Post image */}
                        <div className="flex-shrink-0">
                            {notification?.image && (
                                <img
                                    src={notification?.image}
                                    alt="Post preview"
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="p-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-full max-w-md sm:max-w-lg mx-auto max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-lg font-semibold">
                                Notifications
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        {notifications?.length > 0 ? (
                            <div className="space-y-0">
                                {notifications.map((notification) => (
                                    <NotificationCard
                                        key={notification._id}
                                        notification={notification}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-12 w-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">
                                    No notifications yet
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                // Handle mark all as read
                                console.log("Mark all as read");
                            }}
                        >
                            Mark all as read
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NotificationDialog;
