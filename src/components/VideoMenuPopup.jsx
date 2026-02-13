import {
  Bookmark,
  CircleOff,
  Clock,
  Pencil,
  Share2,
  Trash,
  X,
} from "lucide-react";
import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListPlaylistPopup from "./ListPlaylistPopup";
import Input from "../components/Input.jsx";
import Loading from "./Loading";

const VideoMenuPopup = ({
  videoId,
  playlistId,
  ownerId,
  playlistName,
  setVideoMenuPopup,
  setPlaylistData,
  setVideos,
} = {}) => {
  const [mainMenuPopup, setMainMenuPopup] = useState(true);
  const [listPlaylistPopup, setListPlaylistPopup] = useState(false);
  const [editVideoPopup, setEditVideoPopup] = useState(false);
  const [deleteVideoPopup, setDeleteVideoPopup] = useState(false);
  const [videoDetails, setVideoDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  useEffect(() => {
    // If thumbnail is a File (new upload)
    if (videoDetails.thumbnail instanceof File) {
      const url = URL.createObjectURL(videoDetails.thumbnail);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }

    // If thumbnail is from API
    if (videoDetails.thumbnail?.url) {
      setThumbnailPreview(videoDetails.thumbnail.url);
    }
  }, [videoDetails.thumbnail]);

  const { watchLater } = useSelector((state) => state.video);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/v1/videos/${videoId}`);
        setVideoDetails(data.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  const removeVideoFromPlaylist = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/v1/playlists/${playlistId}/videos/${videoId}`);
      setVideoMenuPopup(false);
      setVideos((prev) =>
        prev.filter((video) => video._id !== videoId && video.id !== videoId),
      );
      setPlaylistData((prev) => ({
        ...prev,
        videos: prev.videos.filter((video) => video._id !== videoId),
      }));
    } catch (error) {
      console.error("Error removing video from playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideoInWatchLater = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/playlists/${id}`);
      const videos = data.data.videos;
      const alreadyExists = videos.some((v) => v._id === videoId);

      if (!alreadyExists) {
        await axios.post(`/api/v1/playlists/${id}/videos`, { videoId });
      }
      setVideoMenuPopup(false);
    } catch (error) {
      console.error("Error saving to watch later:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideo = async () => {
    // Implement save video functionality here
    console.log(videoDetails);
    const formData = new FormData();
    formData.append("title", videoDetails.title);
    formData.append("description", videoDetails.description);
    formData.append("isPublished", videoDetails.isPublished);
    // Append thumbnail file if the user selected a new file
    if (
      videoDetails.thumbnail &&
      (videoDetails.thumbnail instanceof File ||
        videoDetails.thumbnail instanceof Blob)
    ) {
      formData.append("thumbnail", videoDetails.thumbnail);
    }

    setIsLoading(true);
    try {
      const { data } = await axios.patch(
        `/api/v1/videos/update/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setVideos((prev) =>
        prev.map((video) =>
          video._id === videoId || video.id === videoId
            ? {
                ...video,
                thumbnail: data.data.thumbnail?.url,
                title: data.data.title,
                description: data.data.description,
                isPublished: data.data.isPublished,
              }
            : video,
        ),
      );
      setVideoMenuPopup(false);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async () => {
    // Implement delete video functionality here
    setIsLoading(true);
    try {
      await axios
        .delete(`/api/v1/videos/delete/${videoId}`)
        .then(() => {
          setVideos((prev) =>
            prev.filter(
              (video) => video._id !== videoId && video.id !== videoId,
            ),
          );
        })
        .finally(() => {
          setVideoMenuPopup(false);
        });
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-auto"
      onClick={() => setVideoMenuPopup(false)}
    >
      {/* Main Menu Popup */}
      {mainMenuPopup && (
        <div
          className="bg-[#0f0f0f] w-full max-w-[90vw] sm:max-w-md md:max-w-lg 
                     border border-[#272727] rounded-xl shadow-2xl
                     max-h-[85vh] overflow-y-auto custom-scrollbar
                     transform transition-all animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#272727] px-4 py-3 flex items-center justify-between z-10">
            <h2 className="text-base sm:text-lg font-semibold">Options</h2>
            <button
              onClick={() => setVideoMenuPopup(false)}
              className="p-1.5 hover:bg-[#272727] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-3 sm:p-4 relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center rounded-xl">
                <Loading inline />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <button
                className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                         hover:bg-[#272727] rounded-lg transition-colors text-left w-full"
                onClick={() => saveVideoInWatchLater(watchLater.id)}
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>Save to Watch Later</span>
              </button>

              <button
                className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                         hover:bg-[#272727] rounded-lg transition-colors text-left w-full"
                onClick={() => {
                  if (isLoading) return;
                  setListPlaylistPopup(true);
                  setMainMenuPopup(false);
                }}
              >
                <Bookmark className="w-5 h-5 flex-shrink-0" />
                <span>Save to Playlist</span>
              </button>

              {playlistId && (
                <button
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                           hover:bg-[#272727] rounded-lg transition-colors text-left w-full"
                  onClick={removeVideoFromPlaylist}
                  disabled={isLoading}
                  aria-disabled={isLoading}
                >
                  <CircleOff className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">Remove from {playlistName}</span>
                </button>
              )}

              <button
                className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                         hover:bg-[#272727] rounded-lg transition-colors text-left w-full"
              >
                <Share2 className="w-5 h-5 flex-shrink-0" />
                <span>Share</span>
              </button>

              {ownerId === user?._id && (
                <>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                             hover:bg-[#272727] rounded-lg transition-colors text-left w-full"
                    onClick={() => {
                      if (isLoading) return;
                      setMainMenuPopup(false);
                      setEditVideoPopup(true);
                    }}
                  >
                    <Pencil className="w-5 h-5 flex-shrink-0" />
                    <span>Edit Video</span>
                  </button>

                  <button
                    className="flex items-center gap-3 px-3 py-2.5 sm:py-3 text-sm sm:text-base
                             hover:bg-[#db0202] hover:text-white rounded-lg transition-colors text-left w-full
                             text-red-500"
                    onClick={() => {
                      if (isLoading) return;
                      setMainMenuPopup(false);
                      setDeleteVideoPopup(true);
                    }}
                  >
                    <Trash className="w-5 h-5 flex-shrink-0" />
                    <span>Delete Video</span>
                  </button>
                </>
              )}
            </div>

            {/* Cancel Button */}
            <button
              className="w-full mt-4 px-4 py-2.5 border border-[#272727] hover:bg-[#272727] 
                       rounded-full transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setVideoMenuPopup(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List Playlist Popup */}
      {listPlaylistPopup && (
        <ListPlaylistPopup
          videoId={videoId}
          setListPlaylistPopup={setListPlaylistPopup}
          setVideoMenuPopup={setVideoMenuPopup}
        />
      )}

      {/* Edit Video Popup */}
      {editVideoPopup && (
        <div
          className="bg-[#0f0f0f] w-full max-w-[90vw] sm:max-w-md md:max-w-2xl
                     border border-[#272727] rounded-xl shadow-2xl
                     max-h-[85vh] overflow-y-auto custom-scrollbar
                     transform transition-all animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#272727] px-4 py-3 flex items-center justify-between z-10">
            <h2 className="text-base sm:text-lg font-semibold">Edit Video</h2>
            <button
              onClick={() => setVideoMenuPopup(false)}
              className="p-1.5 hover:bg-[#272727] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <Input
              label="Title"
              placeholder="Enter video title"
              value={videoDetails.title || ""}
              onChange={(e) =>
                setVideoDetails({ ...videoDetails, title: e.target.value })
              }
              bgColor="bg-[#0f0f0f]"
              classname="text-sm sm:text-base rounded-xl"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm sm:text-base font-medium text-white">
                Description
              </label>
              <textarea
                placeholder="Enter video description"
                value={videoDetails.description || ""}
                onChange={(e) =>
                  setVideoDetails({
                    ...videoDetails,
                    description: e.target.value,
                  })
                }
                className="w-full h-24 sm:h-32 bg-[#0f0f0f] border border-[#272727] rounded-xl px-4 py-2.5 
                         text-sm sm:text-base text-white resize-none 
                         focus:outline-none focus:border-white transition-colors
                         placeholder:text-gray-500"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm sm:text-base font-medium text-white">
                Thumbnail
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setVideoDetails({ ...videoDetails, thumbnail: file });
                    }
                  }}
                  bgColor="bg-[#0f0f0f]"
                  classname="w-full text-sm rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-gray-200 file:cursor-pointer"
                  flexCol={false}
                />
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-lg border border-[#272727] flex-shrink-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label className="text-sm sm:text-base font-medium text-white">
                Visibility
              </label>
              <select
                value={videoDetails.isPublished ? "public" : "private"}
                onChange={(e) =>
                  setVideoDetails({
                    ...videoDetails,
                    isPublished: e.target.value === "public",
                  })
                }
                className="w-full sm:w-auto bg-[#0f0f0f] border border-[#272727] rounded-xl px-4 py-2.5 
                         text-sm sm:text-base text-white
                         focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                className="flex-1 px-4 py-2.5 bg-white text-black hover:bg-gray-200 
                         rounded-full transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={saveVideo}
                disabled={isLoading}
              >
                Save Changes
              </button>
              <button
                className="flex-1 px-4 py-2.5 border border-[#272727] hover:bg-[#272727] 
                         rounded-full transition-colors text-sm sm:text-base font-medium"
                onClick={() => setVideoMenuPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Video Popup */}
      {deleteVideoPopup && (
        <div
          className="bg-[#0f0f0f] w-full max-w-[90vw] sm:max-w-sm
                     border border-[#272727] rounded-xl shadow-2xl p-4 sm:p-6
                     transform transition-all animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Delete Video</h2>
            <button
              onClick={() => setVideoMenuPopup(false)}
              className="p-1.5 hover:bg-[#272727] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            Are you sure you want to delete this video? This action cannot be
            undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              className="flex-1 px-4 py-2.5 border border-[#272727] hover:bg-[#272727] 
                       rounded-full transition-colors text-sm sm:text-base font-medium"
              onClick={() => setVideoMenuPopup(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white
                       rounded-full transition-colors text-sm sm:text-base font-medium"
              onClick={deleteVideo}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-in {
          animation:
            fade-in 0.2s ease-out,
            zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VideoMenuPopup;
