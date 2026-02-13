import { useState, useEffect } from "react";
import MainLayout from '../layout/MainLayout.jsx';
import Videos from "../components/Videos";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Playlists from "../components/Playlists.jsx";
import { setWatchLater } from "../auth/videoSlice.js";
import EditProfilePopup from "../components/EditProfilePopup.jsx";

const Profile = () => {
  const user = useSelector((state) => state.auth.userData);
  const { watchHistory } = useSelector((state) => state.video);
  const { likedVideos } = useSelector((state) => state.video);
  const { watchLater } = useSelector((state) => state.video);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profilePopup, setProfilePopup] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout isLoading={isLoading}>
      <div className="w-full min-w-0 overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-8 w-full max-w-[2000px] mx-auto">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0">
              <img
                src={user?.avatar?.url}
                alt={user?.fullname}
                className="rounded-full w-full h-full object-cover  hover:brightness-90 transition-all cursor-pointer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                onClick={() => setProfilePopup(true)}
              />
              <div 
                className="rounded-full w-full h-full bg-gradient-to-br from-teal-600 to-green-800 hidden items-center justify-center text-4xl sm:text-5xl font-bold"
              >
                {user?.fullname?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-1 sm:gap-2 text-center sm:text-left min-w-0 w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">
                {user?.fullname}
              </h1>
              <div className="text-sm sm:text-base text-gray-400 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="truncate">@{user?.username}</span>
                <span className="hidden sm:inline">•</span>
                <button
                  className="text-white hover:underline cursor-pointer transition-colors whitespace-nowrap"
                  onClick={() => navigate(`/channel/${user?._id}`)}
                >
                  View channel
                </button>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="mb-6 sm:mb-8 w-full min-w-0">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">History</h2>
              <button
                className="rounded-full border border-[#272727] hover:bg-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 cursor-pointer transition-colors
                         text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => navigate("/history")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide">
              {watchHistory && watchHistory.length > 0 ? (
                <Videos grid={false} videoArray={watchHistory} />
              ) : (
                <p className="text-sm text-gray-500 py-4">No watch history yet</p>
              )}
            </div>
          </div>

          {/* Playlists */}
          <div className="mb-6 sm:mb-8 w-full min-w-0">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Playlists</h2>
              <button
                className="rounded-full cursor-pointer border border-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 hover:bg-[#272727] transition-colors
                         text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => navigate("/playlists")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide">
              <Playlists grid={false} />
            </div>
          </div>

          {/* Watch Later */}
          <div className="mb-6 sm:mb-8 w-full min-w-0">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="flex flex-col min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold">Watch Later</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {watchLater?.videos?.length || 0}{" "}
                  {watchLater?.videos?.length === 1 ? "video" : "videos"}
                </p>
              </div>
              <button
                className="rounded-full cursor-pointer border border-[#272727] 
                         hover:bg-[#272727] px-3 py-1 sm:px-4 sm:py-1.5 transition-colors
                         text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => navigate(`/playlists/${watchLater?.id}`)}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide">
              {watchLater?.videos && watchLater.videos.length > 0 ? (
                <Videos
                  grid={false}
                  videoArray={watchLater.videos}
                  playlistId={watchLater.id}
                  playlistName={"Watch Later"}
                  setPlaylistData={setWatchLater}
                />
              ) : (
                <p className="text-sm text-gray-500 py-4">No videos in watch later</p>
              )}
            </div>
          </div>

          {/* Liked Videos */}
          <div className="mb-6 sm:mb-8 w-full min-w-0">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="flex flex-col min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold">Liked Videos</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {likedVideos?.length || 0}{" "}
                  {likedVideos?.length === 1 ? "video" : "videos"}
                </p>
              </div>
              <button
                className="rounded-full border border-[#272727] hover:bg-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 cursor-pointer transition-colors
                         text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                onClick={() => navigate("/liked-videos")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto scrollbar-hide">
              {likedVideos && likedVideos.length > 0 ? (
                <Videos grid={false} videoArray={likedVideos} />
              ) : (
                <p className="text-sm text-gray-500 py-4">No liked videos yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {profilePopup && <EditProfilePopup setEditProfilePopup={setProfilePopup} />}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </MainLayout>
  );
};

export default Profile;