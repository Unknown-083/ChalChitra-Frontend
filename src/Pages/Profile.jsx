import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Playlists from "../components/Playlists.jsx";
import { setWatchLater } from "../auth/videoSlice.js";

const Profile = () => {
  const user = useSelector((state) => state.auth.userData);
  const { watchHistory } = useSelector((state) => state.video);
  const { likedVideos } = useSelector((state) => state.video);
  const { watchLater } = useSelector((state) => state.video);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <Header />
      <SideNav />

      <div className="pt-[60px] lg:pl-16 xl:pl-18">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-8 w-full max-w-[2000px] mx-auto">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex-shrink-0">
              <img
                src={user?.avatar?.url}
                alt={user?.fullname}
                className="rounded-full w-full h-full object-cover bg-gradient-to-br from-teal-600 to-green-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="rounded-full w-full h-full bg-gradient-to-br from-teal-600 to-green-800 hidden items-center justify-center text-4xl sm:text-5xl font-bold"
              >
                {user?.fullname?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-1 sm:gap-2 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {user?.fullname}
              </h1>
              <div className="text-sm sm:text-base text-gray-400 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span>@{user?.username}</span>
                <span className="hidden sm:inline">•</span>
                <button
                  className="text-white hover:underline cursor-pointer transition-colors"
                  onClick={() => navigate(`/channel/${user?._id}`)}
                >
                  View channel
                </button>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">History</h2>
              <button
                className="rounded-full border border-[#272727] hover:bg-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 cursor-pointer transition-colors
                         text-xs sm:text-sm whitespace-nowrap"
                onClick={() => navigate("/history")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar">
              {watchHistory && watchHistory.length > 0 ? (
                <Videos grid={false} videoArray={watchHistory} />
              ) : (
                <p className="text-sm text-gray-500 py-4">No watch history yet</p>
              )}
            </div>
          </div>

          {/* Playlists */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Playlists</h2>
              <button
                className="rounded-full cursor-pointer border border-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 hover:bg-[#272727] transition-colors
                         text-xs sm:text-sm whitespace-nowrap"
                onClick={() => navigate("/playlists")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar">
              <Playlists grid={false} />
            </div>
          </div>

          {/* Watch Later */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-bold">Watch Later</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {watchLater?.videos?.length || 0}{" "}
                  {watchLater?.videos?.length === 1 ? "video" : "videos"}
                </p>
              </div>
              <button
                className="rounded-full cursor-pointer border border-[#272727] 
                         hover:bg-[#272727] px-3 py-1 sm:px-4 sm:py-1.5 transition-colors
                         text-xs sm:text-sm whitespace-nowrap"
                onClick={() => navigate(`/playlists/${watchLater?.id}`)}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar">
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
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-bold">Liked Videos</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  {likedVideos?.length || 0}{" "}
                  {likedVideos?.length === 1 ? "video" : "videos"}
                </p>
              </div>
              <button
                className="rounded-full border border-[#272727] hover:bg-[#272727] 
                         px-3 py-1 sm:px-4 sm:py-1.5 cursor-pointer transition-colors
                         text-xs sm:text-sm whitespace-nowrap"
                onClick={() => navigate("/liked-videos")}
              >
                View all
              </button>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar">
              {likedVideos && likedVideos.length > 0 ? (
                <Videos grid={false} videoArray={likedVideos} />
              ) : (
                <p className="text-sm text-gray-500 py-4">No liked videos yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #272727;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f3f;
        }
      `}</style>
    </div>
  );
};

export default Profile;