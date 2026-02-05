import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import axios from "../utils/axios";

const PlaylistPopup = ({
  id,
  playlistData,
  setPlaylistPopup,
  setPlaylistData,
  setPlaylists,
} = {}) => {
  const [mainPopup, setMainPopup] = useState(true);
  const [editPopup, setEditPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
  });
  
  useEffect(() => {
    if (editPopup && playlistData) {
      setEditData({
        name: playlistData.name,
        description: playlistData.description,
      });
    }
  }, [editPopup]);

  const handleEditPlaylist = async (e) => {
    e.preventDefault();

    const { data } = await axios.patch(`/api/v1/playlists/${id}`, editData);

    setPlaylists?.((prev) =>
      prev.map((pl) =>
        pl._id === id
          ? { ...pl, name: data.data.name, description: data.data.description }
          : pl,
      ),
    );

    setPlaylistData &&
      setPlaylistData((prev) => ({
        ...prev,
        name: data.data.name,
        description: data.data.description,
      }));
    // sync parent
    setPlaylistPopup(false);
  };

  const deletePlaylist = async () => {
    await axios.delete(`/api/v1/playlists/${id}`);
    setPlaylists && setPlaylists((prev) => prev.filter((pl) => pl._id !== id));
    setPlaylistPopup(false);
  };

  return (
    <div className="top-7 z-20 backdrop-blur-xs fixed inset-0 bg-opacity-50 flex items-center justify-center">
      {/* Main Popup */}
      {mainPopup && (
        <div className="bg-[#0f0f0f] border border-gray-700 p-4 sm:p-6 rounded-lg flex flex-col gap-2 max-h-[90vh] overflow-y-auto">
          <h2
            className="p-2 text-lg flex gap-2 items-center hover:bg-[#272727] rounded cursor-pointer"
            onClick={() => {
              setMainPopup(false);
              setEditPopup(true);
            }}
          >
            <Pencil /> Edit
          </h2>
          <h2
            className="p-2 text-lg text-red-500 hover:bg-[#272727] flex gap-2 items-center rounded cursor-pointer"
            onClick={() => {
              setMainPopup(false);
              setDeletePopup(true);
            }}
          >
            <Trash className="text-red-500" /> Delete
          </h2>

          <p
            className="self-center text-sm text-gray-500 underline cursor-pointer"
            onClick={() => {
              setPlaylistPopup(false);
            }}
          >
            Close
          </p>
        </div>
      )}
      {/* Edit Popup */}
      {editPopup && (
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
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="border-[#272727] border-2 hover:bg-[#272727] text-white px-4 py-2 rounded mr-2"
                onClick={() => {
                  setPlaylistPopup(false);
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
      )}

      {/* Delete Popup */}
      {deletePopup && (
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
              onClick={() => {
                setPlaylistPopup(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPopup;
