import React, { useEffect } from "react";
import axios from "../utils/axios";

const EditPlaylistPopup = ({
  id,
  playlistData,
  setEditPopupOpen,
  setPlaylistData,
}) => {
  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const { data } = await axios.get(`/api/v1/playlists/${id}`);
        setPlaylistData(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getPlaylistData();
  }, [id, playlistData, setPlaylistData]);

  const handleEditPlaylist = async (e) => {
    e.preventDefault();

    const { data } = await axios.patch(`/api/v1/playlists/${id}`, {
      name: playlistData.name,
      description: playlistData.description,
    });

    console.log(data);
    setEditPopupOpen(false);
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#0f0f0f] border border-gray-700 p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Playlist Info</h2>

        <form onSubmit={handleEditPlaylist}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              value={playlistData?.name || ""}
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
              value={playlistData?.description || ""}
              onChange={(e) =>
                setPlaylistData({
                  ...playlistData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="border-[#272727] border-2 hover:bg-[#272727] text-white px-4 py-2 rounded mr-2"
              onClick={() => {
                setEditPopupOpen(false);
              }}
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
  );
};

export default EditPlaylistPopup;
