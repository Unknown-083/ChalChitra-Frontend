import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./auth/authSlice";
import axios from "./utils/axios";
import { setLikedVideos, setVideos, setWatchHistory, setWatchLater } from "./auth/videoSlice.js";
import { formatVideoData } from "./utils/helpers";
import Loading from "./components/Loading.jsx";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/users/get-user");
      
      if (data?.data?.data) {
        dispatch(login(data.data.data));
        return true;
      } else {
        navigate("/login");
        return false;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      dispatch(logout());
      navigate("/login");
      return false;
    }
  }, [dispatch, navigate]);

  // Fetch all videos
  const getVideos = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/videos");
      const allVideos = data.data?.videos || [];

      const formattedVideos = allVideos.map(formatVideoData);
      dispatch(setVideos(formattedVideos));
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos");
    }
  }, [dispatch]);

  // Fetch watch history
  const getWatchHistory = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/users/history");
      const allVideos = data.data || [];

      const formattedHistory = allVideos.map(formatVideoData);
      dispatch(setWatchHistory(formattedHistory));
    } catch (error) {
      console.error("Error fetching watch history:", error);
    }
  }, [dispatch]);

  // Fetch liked videos
  const getLikedVideos = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/likes/videos");
      const allVideos = data.data || [];
      console.log(data.data);
      
      const formattedLiked = allVideos.map(formatVideoData);
      console.log("Formatted videos :: ", formattedLiked);
      
      dispatch(setLikedVideos(formattedLiked));
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    }
  }, [dispatch]);

  const getWatchLater = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/playlists/watch-later");
      const allVideos = data.data[0]?.videos || [];      
      const formattedWatchLater = allVideos && allVideos.map(formatVideoData);
      dispatch(setWatchLater({
        id: data.data[0]?._id,
        videos: formattedWatchLater
      }));
    } catch (error) {
      console.error("Error fetching watch later videos:", error);
    }
  }, [dispatch]);

  // Initialize app - check auth
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      // Check if user is already logged in
      if (auth.status) {
        console.log("User is already logged in");
        setIsLoading(false);
        return;
      }

      // Try to get current user
      const isAuthenticated = await getCurrentUser();
      
      if (isAuthenticated) {
        // Load initial data
        await Promise.all([
          getVideos(),
          getWatchHistory(),
          getLikedVideos(),
          getWatchLater(),
        ]);
      }
      
      setIsLoading(false);
    };

    initializeApp();
  }, []); // Only run once on mount

  // Fetch videos when auth status changes
  useEffect(() => {
    if (auth.status) {
      getVideos();
      getWatchHistory();
      getLikedVideos();
      getWatchLater();
    }
  }, [auth.status, getVideos]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-black px-6 py-2 rounded-lg"
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