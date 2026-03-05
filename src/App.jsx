import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./auth/authSlice";
import axios from "./utils/axios";
import {
  setLikedVideos,
  setVideos,
  setWatchHistory,
  setWatchLater,
} from "./auth/videoSlice.js";
import { formatVideoData } from "./utils/helpers";
import Loading from "./components/Loading.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/video", "/channel", "/tweets", "/login", "/signup"];
  const isPublicRoute = publicRoutes.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // Get current user (optional - doesn't redirect if fails)
  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/users/get-user");

      if (data?.data?.data) {
        dispatch(login(data.data.data));
        return true;
      } else {
        dispatch(logout());
        return false;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      dispatch(logout());
      return false;
    }
  }, [dispatch]);

  // Fetch all videos (PUBLIC - works without auth)
  const getVideos = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/videos");
      const allVideos = data.data?.videos || [];

      const formattedVideos = allVideos.map(formatVideoData);
      dispatch(setVideos(formattedVideos));
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Don't show error for public routes
      if (!isPublicRoute) {
        setError("Failed to load videos");
      }
    }
  }, [dispatch, isPublicRoute]);

  // Fetch watch history (REQUIRES AUTH)
  const getWatchHistory = useCallback(async () => {
    if (!auth.status) return; // Skip if not authenticated

    try {
      const { data } = await axios.get("/api/v1/users/history");
      const allVideos = data.data || [];

      const formattedHistory = allVideos.map(formatVideoData);
      dispatch(setWatchHistory(formattedHistory));
    } catch (error) {
      console.error("Error fetching watch history:", error);
    }
  }, [dispatch, auth.status]);

  // Fetch liked videos (REQUIRES AUTH)
  const getLikedVideos = useCallback(async () => {
    if (!auth.status) return; // Skip if not authenticated

    try {
      const { data } = await axios.get("/api/v1/likes/videos");
      const allVideos = data.data || [];

      const formattedLiked = allVideos.map(formatVideoData);
      dispatch(setLikedVideos(formattedLiked));
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    }
  }, [dispatch, auth.status]);

  // Fetch watch later (REQUIRES AUTH)
  const getWatchLater = useCallback(async () => {
    if (!auth.status) return; // Skip if not authenticated

    try {
      const { data } = await axios.get("/api/v1/playlists/watch-later");
      const allVideos = data.data[0]?.videos || [];
      const formattedWatchLater = allVideos && allVideos.map(formatVideoData);
      dispatch(
        setWatchLater({
          id: data.data[0]?._id,
          videos: formattedWatchLater,
        })
      );
    } catch (error) {
      console.error("Error fetching watch later videos:", error);
    }
  }, [dispatch, auth.status]);

  // Initialize app - check auth and load data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      try {
        // Try to get current user (won't redirect if fails)
        const isAuthenticated = await getCurrentUser();

        // Always load videos (public content)
        await getVideos();

        // Load user-specific data only if authenticated
        if (isAuthenticated) {
          await Promise.all([
            getWatchHistory(),
            getLikedVideos(),
            getWatchLater(),
          ]);
        }
      } catch (error) {
        console.error("App initialization error:", error);
        // Don't block app for public routes
        if (!isPublicRoute) {
          setError("Failed to initialize app");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []); // Only run once on mount

  // Load user data when auth status changes to true
  useEffect(() => {
    if (auth.status) {
      getWatchHistory();
      getLikedVideos();
      getWatchLater();
    }
  }, [auth.status, getWatchHistory, getLikedVideos, getWatchLater]);

  // Show loading spinner
  if (isLoading) {
    return <Loading />;
  }

  // Show error only for protected routes
  if (error && !isPublicRoute) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}

export default App;