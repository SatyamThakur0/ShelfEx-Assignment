import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
  } from 'react';
  import { mockPosts, mockUsers } from '../utils/mockData';
  import { useAuth } from './AuthContext';
  
  const AppContext = createContext();
  
  export const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState(mockPosts);
    const [notifications, setNotifications] = useState([]);
    const [followedCelebrities, setFollowedCelebrities] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
  
    useEffect(() => {
      if (user?.role === 'public' && user.following) {
        const followed = mockUsers.filter(u => user.following?.includes(u.id));
        setFollowedCelebrities(followed);
      }
    }, [user]);
  
    const addPost = useCallback((content, image) => {
      if (!user) return;
  
      const newPost = {
        id: Date.now().toString(),
        userId: user.id,
        content,
        image,
        timestamp: new Date(),
        likes: 0,
        author: user,
      };
  
      setPosts(prev => [newPost, ...prev]);
  
      if (user.role === 'celebrity') {
        const followers = mockUsers.filter(
          u => u.role === 'public' && u.following?.includes(user.id)
        );
  
        const newNotifications = followers.map(follower => ({
          id: `${Date.now()}-${follower.id}`,
          type: 'new_post',
          message: `${user.displayName} just posted something new!`,
          timestamp: new Date(),
          read: false,
          postId: newPost.id,
          userId: follower.id,
        }));
  
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    }, [user]);
  
    const followCelebrity = useCallback((celebrityId) => {
      if (!user || user.role !== 'public') return;
  
      const celebrity = mockUsers.find(u => u.id === celebrityId);
      if (celebrity) {
        setFollowedCelebrities(prev => [...prev, celebrity]);
        if (user.following) {
          user.following.push(celebrityId);
        } else {
          user.following = [celebrityId];
        }
      }
    }, [user]);
  
    const unfollowCelebrity = useCallback((celebrityId) => {
      if (!user || user.role !== 'public') return;
  
      setFollowedCelebrities(prev =>
        prev.filter(c => c.id !== celebrityId)
      );
  
      if (user.following) {
        user.following = user.following.filter(id => id !== celebrityId);
      }
    }, [user]);
  
    const markNotificationAsRead = useCallback((notificationId) => {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }, []);
  
    const markAllNotificationsAsRead = useCallback(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);
  
    const loadMorePosts = useCallback(() => {
      setTimeout(() => {
        const morePosts = [
          {
            id: `${Date.now()}-1`,
            userId: '2',
            content: 'Another great day on set! The chemistry between the cast is incredible.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            likes: 15200,
            author: mockUsers[1],
          },
          {
            id: `${Date.now()}-2`,
            userId: '3',
            content: 'Grateful for all the love and support! You guys make everything worth it. 💕',
            image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
            timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
            likes: 42300,
            author: mockUsers[2],
          },
        ];
  
        setPosts(prev => [...prev, ...morePosts]);
        setHasMorePosts(false);
      }, 1000);
    }, []);
  
    const unreadCount = notifications.filter(
      n => !n.read && n.userId === user?.id
    ).length;
  
    return (
      <AppContext.Provider
        value={{
          posts,
          notifications: notifications.filter(n => n.userId === user?.id),
          followedCelebrities,
          unreadCount,
          addPost,
          followCelebrity,
          unfollowCelebrity,
          markNotificationAsRead,
          markAllNotificationsAsRead,
          loadMorePosts,
          hasMorePosts,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  };
  
  export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useApp must be used within an AppProvider');
    }
    return context;
  };
  