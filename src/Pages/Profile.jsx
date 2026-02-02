import Header from "../components/Header/Header.jsx";
import SideNav from "../components/Header/SideNav.jsx";
import Videos from "../components/Videos";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Playlists from "../components/Playlists.jsx";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import EditPlaylistPopup from "../components/EditPlaylistPopup.jsx";

const Profile = () => {
  const user = useSelector((state) => state.auth.userData);
  const { watchHistory } = useSelector((state) => state.video);
  const { likedVideos } = useSelector((state) => state.video);
  const { watchLater } = useSelector((state) => state.video);
  const navigate = useNavigate();

  const [playlistPopup, setPlaylistPopup] = useState(false);
  const [editPlaylistPopup, setEditPlaylistPopup] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

  const handleEdit = async () => {
    setPlaylistPopup(false);
    setEditPlaylistPopup(true);
  };

  const handleDelete = async () => {};

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
                  className="cursor-pointer"
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
              <div className="rounded-full border border-[#272727] px-3 py-1 cursor-pointer" onClick={() => navigate("/history")}>
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
                className="rounded-full cursor-pointer border border-[#272727] px-3 py-1"
                onClick={() => navigate("/playlists")}
              >
                View all
              </div>
            </div>
            {/* Playlist comp */}
            <div className="max-w-screen overflow-auto custom-scrollbar">
              <Playlists
                grid={false}
                setPlaylistId={setPlaylistId}
                setPlaylistPopup={setPlaylistPopup}
              />
            </div>
          </div>

          {/* Playlist Popup */}

          {playlistPopup && (
            <div className="fixed inset-0 dark-scrollbar z-50 flex items-center justify-center px-2 sm:px-4 overflow-y-auto">
              <div className="bg-[#0f0f0f] border border-gray-700 p-4 sm:p-6 rounded-lg flex flex-col gap-2 max-h-[90vh] overflow-y-auto">
                <h2
                  className="p-2 text-lg flex gap-2 items-center hover:bg-[#272727] rounded cursor-pointer"
                  onClick={handleEdit}
                >
                  <Pencil /> Edit
                </h2>
                <h2
                  className="p-2 text-lg text-red-500 hover:bg-[#272727] flex gap-2 items-center rounded cursor-pointer"
                  onClick={handleDelete}
                >
                  <Trash className="text-red-500" /> Delete
                </h2>

                <p
                  className="self-center text-sm text-gray-500 underline cursor-pointer"
                  onClick={() => setPlaylistPopup(false)}
                >
                  Close
                </p>
              </div>
            </div>
          )}

          {/* Edit Playlist Popup */}

          {editPlaylistPopup && (<EditPlaylistPopup
            id={playlistId}
            setEditPopupOpen={setEditPlaylistPopup}
            playlistData={playlistData}
            setPlaylistData={setPlaylistData}
          />)}

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
                className="rounded-full cursor-pointer border h-fit border-[#272727] px-3 py-1"
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
              <div className="rounded-full border h-fit border-[#272727] px-3 py-1 cursor-pointer" onClick={() => navigate("/liked-videos")}>
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
