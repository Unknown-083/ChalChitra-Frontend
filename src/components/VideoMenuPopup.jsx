import { Bookmark, CircleOff, Clock, Share2 } from "lucide-react";
import axios from "../utils/axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import ListPlaylistPopup from "./ListPlaylistPopup";

const VideoMenuPopup = ({
  videoId,
  playlistId,
  playlistName,
  setVideoMenuPopup,
  setPlaylistData,
  setVideos,
} = {}) => {
  const [mainMenuPopup, setMainMenuPopup] = useState(true);
  const [listPlaylistPopup, setListPlaylistPopup] = useState(false);

  const { watchLater } = useSelector((state) => state.video);

  const removeVideoFromPlaylist = async () => {
    await axios.delete(
      `/api/v1/playlists/${playlistId}/videos/${videoId}`,
    );
    setVideoMenuPopup(false);
    setVideos((prev) => prev.filter((video) => video.id !== videoId));
    setPlaylistData((prev) => ({
      ...prev,
      videos: prev.videos.filter((video) => video._id !== videoId),
    }));
  };

  const saveVideoInWatchLater = async (id) => {
    const { data } = await axios.get(`/api/v1/playlists/${id}`);

    const videos = data.data.videos;

    const alreadyExists = videos.some((v) => v._id === videoId);

    if (!alreadyExists) {
      await toggleVideoInPlaylist(id);
    }

    setVideoMenuPopup(false);
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      {/* Main */}
      {mainMenuPopup && (
        <div className="bg-[#0f0f0f] flex flex-col items-center border border-gray-700 p-4 rounded-lg">
          <div className="flex flex-col mb-2 text-lg">
            <h2
              className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-[#272727] rounded-2xl"
              onClick={() => saveVideoInWatchLater(watchLater.id)}
            >
              <Clock /> Save to Watch Later
            </h2>
            <h2
              className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-[#272727] rounded-2xl"
              onClick={() => {
                setListPlaylistPopup(true);
                setMainMenuPopup(false);
              }}
            >
              <Bookmark /> Save to Playlist
            </h2>
            {playlistId && (
              <h2
                className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-[#272727] rounded-2xl"
                onClick={removeVideoFromPlaylist}
              >
                <CircleOff /> Remove from {playlistName}
              </h2>
            )}
            <h2 className="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-[#272727] rounded-2xl">
              <Share2 /> Share
            </h2>
          </div>

          <button
            className="px-3 py-2 border border-[#272727] hover:bg-[#272727] cursor-pointer rounded-2xl mx-auto"
            onClick={() => setVideoMenuPopup(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* List Playlist to add video */}
      {/* {listPlaylistPopup && (
        <div className="bg-[#0f0f0f] w-1/3 border border-gray-700 p-4 rounded-lg">
          <div className="flex flex-col mb-2 text-lg">
            {playlists &&
              playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="flex px-3 py-2 items-center gap-2 rounded-xl "
                >
                  <div className="flex items-center gap-2 w-full">
                    <img
                      src={playlist?.videos[0]?.thumbnail?.url}
                      className="object-cover w-1/3 h-14 rounded-lg"
                      alt=""
                    />
                    <h3>{playlist.name}</h3>
                  </div>
                  <div
                    className={`p-2 cursor-pointer hover:bg-[#272727] rounded-full`}
                    onClick={() => toggleVideoInPlaylist(playlist._id)}
                  >
                    <Bookmark
                      className={`${playlist.videos.some((video) => video._id === videoId) ? "fill-white" : ""}`}
                    />
                  </div>
                </div>
              ))}
          </div>
          <button
            className="flex text-center border border-[#272727] hover:bg-[#272727] cursor-pointer rounded-2xl mx-auto px-3 py-2"
            onClick={() => {
              setListPlaylistPopup(false);
              setVideoMenuPopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      )} */}
      {listPlaylistPopup && (
        <ListPlaylistPopup
          videoId={videoId}
          setListPlaylistPopup={setListPlaylistPopup}
          setVideoMenuPopup={setVideoMenuPopup}
        />
      )}
    </div>
  );
};

export default VideoMenuPopup;
