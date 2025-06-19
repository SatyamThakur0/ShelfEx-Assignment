import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Header from "./components/Header";
import PostList from "./components/PostList";
import UserSearch from "./components/UserSearch";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import FollowedPostList from "./components/FollowedPostList";

function App() {
    return (
        <>
            {" "}
            <Router>
                <Header />
                <Routes>
                    {/* Routes with sidebar */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<PostList />} />
                        <Route
                            path="/followed-feed"
                            element={<FollowedPostList />}
                        />

                        <Route path="/search" element={<UserSearch />} />
                        <Route path="/user/:id" element={<Profile />} />
                    </Route>

                    {/* Routes without sidebar */}
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
