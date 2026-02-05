import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Playlists from "../components/Playlists.jsx";
import { useState } from "react";
import PlaylistPopup from "../components/PlaylistPopup.jsx";

const Profile = () => {
  const user = useSelector((state) => state.auth.userData);
  const { watchHistory } = useSelector((state) => state.video);
  const { likedVideos } = useSelector((state) => state.video);
  const { watchLater } = useSelector((state) => state.video);
  const navigate = useNavigate();

  const [playlistPopup, setPlaylistPopup] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex w-full overflow-hidden">
        <SideNav />
        <div className="ml-15 p-10 pt-2 pr-5 w-full overflow-auto">
          {/* User Info */}
          <div className="flex w-full">
            <img
              src={user?.avatar?.url}
              alt=""
              className="rounded-full w-35 h-35"
            />

            <div className="pl-4 flex flex-col justify-center gap-2">
              <h1 className="text-4xl font-bold">{user?.fullname}</h1>
              <div className="text-md text-gray-400 flex items-center gap-1 mb-2">
                <span>{user?.username}</span>
                <span>•</span>
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => navigate(`/channel/${user?._id}`)}
                >
                  View channel
                </span>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="mt-8 w-full">
            <div className="flex justify-between mb-3">
              <h2 className="text-2xl font-bold">History</h2>
              <div
                className="rounded-full border border-[#272727] hover:bg-[#272727] px-3 py-1 cursor-pointer"
                onClick={() => navigate("/history")}
              >
                View all
              </div>
            </div>
            {/* Videos */}
            <div className="max-w-screen overflow-auto overflow-x-auto">
              {watchHistory && (
                <Videos grid={false} videoArray={watchHistory} />
              )}
            </div>
          </div>

          {/* :TODO */}
          {/* Playlists */}
          <div className="mt-8">
            <div className="flex justify-between mb-3">
              <h2 className="text-2xl font-bold">Playlists</h2>
              <div
                className="rounded-full cursor-pointer border border-[#272727] px-3 py-1 hover:bg-[#272727]"
                onClick={() => navigate("/playlists")}
              >
                View all
              </div>
            </div>
            {/* Playlist comp */}
            <div className="max-w-screen overflow-auto custom-scrollbar">
              <Playlists
                grid={false}
                // setPlaylistId={setPlaylistId}
                // setPlaylistPopup={setPlaylistPopup}
              />
            </div>
          </div>

          {/* Playlist Popup */}

          {/* {playlistPopup && (
            <PlaylistPopup
              id={playlistId}
              playlistData={playlistData}
              setPlaylistPopup={setPlaylistPopup}
              setPlaylistData={setPlaylistData}
            />
          )} */}

          {/* Watch Later */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">Watch Later</h2>
                <p className="text-xs text-gray-400">
                  {watchLater?.videos?.length || 0}{" "}
                  {watchLater?.videos?.length <= 1 ? "video" : "videos"}
                </p>
              </div>
              <div
                className="rounded-full cursor-pointer border h-fit border-[#272727] hover:bg-[#272727] px-3 py-1"
                onClick={() => navigate(`/playlists/${watchLater.id}`)}
              >
                View all
              </div>
            </div>
            {/* Videos */}
            <div className="max-w-screen overflow-auto custom-scrollbar">
              <Videos grid={false} videoArray={watchLater.videos} />
            </div>
          </div>

          {/* Liked Videos */}
          <div className="mt-8 mb-10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">Liked Videos</h2>
                <p className="text-xs text-gray-400">
                  {likedVideos?.length || 0}{" "}
                  {likedVideos?.length <= 1 ? "video" : "videos"}
                </p>
              </div>
              <div
                className="rounded-full border h-fit border-[#272727] hover:bg-[#272727] px-3 py-1 cursor-pointer"
                onClick={() => navigate("/liked-videos")}
              >
                View all
              </div>
            </div>
            {/* Videos */}
            <div className="max-w-screen overflow-auto custom-scrollbar">
              {likedVideos && <Videos grid={false} videoArray={likedVideos} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
