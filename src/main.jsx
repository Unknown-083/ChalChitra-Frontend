import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./Pages/Home.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ProtectedRoute, {
  PublicOnlyRoute,
} from "./components/ProtectedRoutes.jsx";
import Profile from "./Pages/Profile.jsx";
import Subscription from "./Pages/Subscription.jsx";
import AllSubscriptions from "./Pages/AllSubscriptions.jsx";
import Video from "./Pages/Video.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import { Provider } from "react-redux";
import { store } from "./auth/store.js";
import UploadVideo from "./Pages/UploadVideo.jsx";
import Channel from "./Pages/Channel.jsx";
import AllPlaylists from "./Pages/AllPlaylists.jsx";
import Playlist from "./Pages/Playlist.jsx";
import History from "./Pages/History.jsx";
import LikedVideos from "./Pages/LikedVideos.jsx";
import Tweet from "./Pages/Tweet.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* PUBLIC ROUTES - Anyone can access */}
      <Route path="" element={<Home />} />
      <Route path="video/:id" element={<Video />} />
      <Route path="channel/:id" element={<Channel />} />
      <Route path="tweets" element={<Tweet />} />

      {/* AUTH ONLY ROUTES - Redirect to home if already logged in */}
      <Route
        path="login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      {/* PROTECTED ROUTES - Require authentication */}
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="upload"
        element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        }
      />
      <Route
        path="subscriptions"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="all-subscriptions"
        element={
          <ProtectedRoute>
            <AllSubscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="liked-videos"
        element={
          <ProtectedRoute>
            <LikedVideos />
          </ProtectedRoute>
        }
      />
      <Route
        path="playlists"
        element={
          <ProtectedRoute>
            <AllPlaylists />
          </ProtectedRoute>
        }
      />
      <Route
        path="playlists/:id"
        element={
          <ProtectedRoute>
            <Playlist />
          </ProtectedRoute>
        }
      />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
