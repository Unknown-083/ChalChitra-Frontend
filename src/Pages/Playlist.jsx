import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import Videos from "../components/Videos";
import { Pencil, Play, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { formatDate, formatVideoData } from "../utils/helpers";
import EditPlaylistPopup from "../components/PlaylistPopup";

const Playlist = () => {
  const { id } = useParams();
  const [playlistData, setPlaylistData] = React.useState({});
  const [EditPopupOpen, setEditPopupOpen] = React.useState(false);
  const [AddVideoPopupOpen, setAddVideoPopupOpen] = React.useState(false);
  const [allVideos, setAllVideos] = React.useState([]);
  const [userVideos, setUserVideos] = React.useState([]);
  const [selectedVideos, setSelectedVideos] = React.useState([]);
  const user = useSelector((state) => state.auth.userData);

  const navigate = useNavigate();

  useEffect(() => {
    // Any side effects or data fetching can be done here
    const fetchPlaylistData = async () => {
      // Fetch playlist data based on ID from params
      const { data } = await axios.get(`/api/v1/playlists/${id}`);
      setPlaylistData(data.data);
    };

    fetchPlaylistData();
  }, [id]);

  // Load Videos for adding to playlist

  useEffect(() => {
    if (!AddVideoPopupOpen) return;
    const fetchVideos = async () => {
      // Fetch videos logic here
      let { data } = await axios.get("/api/v1/videos");
      setAllVideos(data.data.videos);

      data = await axios.get(`/api/v1/users/c/${user._id}`);
      setUserVideos(data.data.data.videos);
    };

    fetchVideos();
  }, [AddVideoPopupOpen]);

  const handleAddVideosToPlaylist = async () => {
  try {
    await Promise.all(
      selectedVideos.map((videoId) =>
        axios.post(`/api/v1/playlists/${id}/videos/${videoId}`)
      )
    );

    setPlaylistData((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        ...allVideos.filter(
          (video) =>
            selectedVideos.includes(video._id) &&
            !prev.videos.some((v) => v._id === video._id)
        ),
      ],
    }));

    setSelectedVideos([]);
    setAddVideoPopupOpen(false);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div>
      <Header />
      <div className="flex px-4 py-2">
        <div className="w-1/3 p-4 rounded-2xl bg-[#272727]">
          {/* Owner */}
          <div className="flex items-center mb-4">
            <img
              src={playlistData?.owner?.avatar?.url}
              alt={playlistData?.owner?.fullname}
              className="w-25 h-25 rounded-full mr-4"
            />
            <div>
              <h3 className="text-2xl font-semibold">
                {playlistData?.owner?.fullname}
              </h3>
              <p className="text-sm text-gray-400">
                @{playlistData?.owner?.username}
              </p>
            </div>
          </div>
          <p className="text-xl font-bold">{playlistData.name}</p>
          <p className="text-md text-wrap text-gray-400">
            {playlistData.description}
          </p>
          <p className="text-md text-gray-400">
            Total Videos - {playlistData.videos?.length || 0}
          </p>

          {/* Playlist crud operations */}
          <div className="flex py-4 gap-2">
            {/* Add Video to the playlist */}
            <div
              className="flex px-3 py-2 bg-white text-black rounded-full items-center mr-2 cursor-pointer transition-all transform hover:scale-105"
              onClick={() => {
                if (playlistData?.videos?.length) {
                  navigate(`/video/${playlistData.videos[0]._id}`);
                }
              }}
            >
              <Play className="w-6 h-6 mr-2" />
              <p className="font-bold">Play</p>
            </div>
            <div
              className="rounded-full cursor-pointer p-2 border border-white hover:bg-white hover:text-black"
              onClick={() => setAddVideoPopupOpen(true)}
            >
              {<Plus />}
            </div>
            {(playlistData.name!="Watch Later") && (<div
              className="p-2 cursor-pointer rounded-full border border-white hover:bg-white hover:text-black"
              onClick={() => setEditPopupOpen(true)}
            >
              <Pencil />
            </div>)}
          </div>
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-2xl font-bold mb-4">Videos in Playlist</h2>
          <ul>
            {playlistData?.videos?.length > 0 && (
              <Videos
                videoArray={playlistData.videos.map(formatVideoData)}
                playlistId={playlistData._id}
                playlistName={playlistData.name}
                setPlaylistData={setPlaylistData}
              />
            )}
          </ul>
        </div>
      </div>

      {/* Edit Playlist Info popup */}
      {EditPopupOpen && (
        <EditPlaylistPopup
          id={id}
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
          setPlaylistPopup={setEditPopupOpen}
        />
      )}

      {/* Add Video to Playlist Popup */}
      {AddVideoPopupOpen && (
        <div className="fixed inset-0 dark-scrollbar z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-2 sm:px-4 overflow-y-auto">
          <div
            className="bg-[#0f0f0f] border border-gray-700 p-4 sm:p-6 rounded-lg 
                    w-full sm:w-11/12 md:w-3/4 lg:w-2/3 
                    max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Add Video to Playlist
            </h2>

            <div className="space-y-6">
              {/* Users Videos */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Your Videos
                </h3>

                <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {userVideos.map((video) => (
                    <li key={video._id}>
                      <label className="flex gap-3 p-3 rounded-lg border border-[#272727] hover:bg-[#181818] cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-2"
                          value={video._id}
                          onChange={(e) => {
                            const videoId = e.target.value;
                            if (e.target.checked) {
                              setSelectedVideos([...selectedVideos, videoId]);
                            } else {
                              setSelectedVideos(
                                selectedVideos.filter((id) => id !== videoId),
                              );
                            }
                          }}
                        />

                        {/* Thumbnail */}
                        <img
                          src={video.thumbnail?.url}
                          alt={video.title}
                          className="w-28 h-16 sm:w-36 sm:h-20 object-cover rounded-md flex-shrink-0"
                          loading="lazy"
                        />

                        {/* Video Info */}
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <h4 className="text-sm sm:text-base font-semibold line-clamp-2">
                            {video.title}
                          </h4>

                          {/* Description */}
                          <p
                            className="text-xs sm:text-sm text-gray-400 
                                  line-clamp-2 sm:line-clamp-3"
                          >
                            {video.description}
                          </p>

                          {/* User + Meta */}
                          <div className="text-xs sm:text-sm text-gray-500">
                            <p>{video.owner?.username}</p>
                            <p className="flex gap-2">
                              <span>{video.views} views</span>
                              <span>•</span>
                              <span>{formatDate(video.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Videos */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  All Videos
                </h3>

                <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {allVideos.map((video) => (
                    <li key={video._id}>
                      <label className="flex gap-3 p-3 rounded-lg border border-[#272727] hover:bg-[#181818] cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-2"
                          value={video._id}
                          onChange={(e) => {
                            const videoId = e.target.value;
                            if (e.target.checked) {
                              setSelectedVideos([...selectedVideos, videoId]);
                            } else {
                              setSelectedVideos(
                                selectedVideos.filter((id) => id !== videoId),
                              );
                            }
                          }}
                        />

                        {/* Thumbnail */}
                        <img
                          src={video.thumbnail?.url}
                          alt={video.title}
                          className="w-28 h-16 sm:w-36 sm:h-20 object-cover rounded-md flex-shrink-0"
                          loading="lazy"
                        />

                        {/* Video Info */}
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <h4 className="text-sm sm:text-base font-semibold line-clamp-2">
                            {video.title}
                          </h4>

                          {/* Description */}
                          <p
                            className="text-xs sm:text-sm text-gray-400 
                                  line-clamp-2 sm:line-clamp-3"
                          >
                            {video.description}
                          </p>

                          {/* User + Meta */}
                          <div className="text-xs sm:text-sm text-gray-500">
                            <p>{video.owner?.username}</p>
                            <p className="flex gap-2">
                              <span>{video.views} views</span>
                              <span>•</span>
                              <span>{formatDate(video.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                type="button"
                className="border-[#272727] border-2 hover:bg-[#272727] text-white px-4 py-2 rounded"
                onClick={() => setAddVideoPopupOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-white text-black px-4 py-2 rounded"
                onClick={handleAddVideosToPlaylist}
              >
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Playlist;
