import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Bookmark } from "lucide-react";

const ListPlaylistPopup = ({
  setListPlaylistPopup,
  videoId,
  setVideoMenuPopup,
} = {}) => {
  const [playlists, setPlaylists] = useState();

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      const { data } = await axios.get("/api/v1/playlists");
      setPlaylists(data.data);
    };
    fetchAllPlaylists();
  }, [setListPlaylistPopup]);

  const toggleVideoInPlaylist = async (id) => {
    await axios.patch(`/api/v1/playlists/${id}/videos/${videoId}`);
    setListPlaylistPopup(false);
    setVideoMenuPopup && setVideoMenuPopup(false);
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#0f0f0f] md:w-1/3 border border-gray-700 p-4 rounded-lg">
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
            setVideoMenuPopup && setVideoMenuPopup(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ListPlaylistPopup;
