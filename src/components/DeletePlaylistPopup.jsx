import React from "react";
import axios from "../utils/axios";

const DeletePlaylistPopup = ({ id, setDeletePlaylistPopup }) => {
  const deletePlaylist = async () => {
    const { data } = await axios.delete(`/api/v1/playlists/${id}`);
    console.log(data);
    setDeletePlaylistPopup(false);
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#0f0f0f] border border-gray-700 p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Delete Playlist</h2>
        <p className="text-lg">
          Are you sure you want to delete this playlist?
        </p>
        <div className="flex gap-3 mt-3">
          <button
            className="border border-red-600 text-red-600 px-3 py-2 rounded-xl hover:bg-red-600 hover:text-white"
            onClick={deletePlaylist}
          >
            Yes
          </button>
          <button
            className="border border-[#272727] px-3 py-2 rounded-xl hover:bg-[#272727]"
            onClick={() => setDeletePlaylistPopup(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistPopup;
