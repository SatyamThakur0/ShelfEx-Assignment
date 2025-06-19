// import { postActions } from "@/store/postSlice";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

// const FetchFollowedPosts = () => {
//     const dispatch = useDispatch();
//     const { page, setPage } = useState(1);
//     const [loading, setLoading] = useState(true);
//     const [hasMore, setHasMore] = useState(true);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const res = await fetch(
//                     `${
//                         import.meta.env.VITE_BACKEND_URL
//                     }/api/posts/following-posts?page=${page}&limit=5`,
//                     {
//                         credentials: "include",
//                     }
//                 );
//                 const data = await res.json();
//                 console.log(data);

//                 if (data.ok) {
//                     dispatch(postActions.setFollowedPosts(data.posts));
//                 }
//             } catch (error) {}
//         };
//         fetchPosts();
//     }, []);
// };

// export default FetchFollowedPosts;
