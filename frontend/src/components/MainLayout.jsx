// layouts/MainLayout.jsx
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import BottomSidebar from "./BottomSidebar";
// import FetchFollwedUsers from "./custom/FetchFollwedUsers";

function MainLayout() {
    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Sidebar on the left (hidden on mobile) */}
            <Sidebar />
            {/* Bottom sidebar (only on mobile) */}
            <BottomSidebar />
            {/* Main content area */}
            <div className="flex-1 w-full max-w-full sm:px-6 md:px-10 py-2 sm:py-4 flex justify-center sm:ml-56">
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;
