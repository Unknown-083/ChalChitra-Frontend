import React from "react";
import Playlists from "../components/Playlists";
import MainLayout from "../layout/MainLayout";
import { Plus } from "lucide-react";
import axios from "../utils/axios";

const AllPlaylists = () => {
  const [createPlaylistPopup, setCreatePlaylistPopup] = React.useState(false);
  const [playlistData, setPlaylistData] = React.useState({});

  const handleCreatePlaylist = async(e) => {
    e.preventDefault();

    await axios.post("/api/v1/playlists", {
      name: playlistData.name,
      description: playlistData.description
    }); 

    setCreatePlaylistPopup(false);
    setPlaylistData({});
  };

  return (
    <MainLayout>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between py-3">
          <h2 className="text-2xl md:text-3xl font-bold">Playlists</h2>
          <div
            className="hover:bg-[#272727] border border-[#272727] p-2 rounded-full cursor-pointer"
            onClick={() => setCreatePlaylistPopup(true)}
            aria-label="Create playlist"
          >
            <Plus />
          </div>
        </div>

        <div className="py-2">
          <Playlists setPlaylistPopup />
        </div>

        {/* Add Playlist Popup */}
        {createPlaylistPopup && (
          <div className="top-7 backdrop-blur-xs fixed inset-0 bg-black/5 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] border border-gray-700 p-6 rounded-lg w-full max-w-2xl sm:max-w-lg md:max-w-md">
              <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
              <form onSubmit={handleCreatePlaylist}>
                <div className="mb-4">
                  <label className="block text-white text-sm font-bold mb-2">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                    value={playlistData.name || ""}
                    onChange={(e) =>
                      setPlaylistData({ ...playlistData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                    value={playlistData.description || ""}
                    onChange={(e) =>
                      setPlaylistData({
                        ...playlistData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="border-[#272727] border-2 hover:bg-[#272727] text-white px-4 py-2 rounded mr-2"
                    onClick={() => setCreatePlaylistPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllPlaylists;
