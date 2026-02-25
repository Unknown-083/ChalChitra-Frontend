import { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  ImagePlus,
  Video,
} from "lucide-react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { timeAgo } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import CommentsSection from "./Comments";

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTweet, setNewTweet] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);
  const [commentPopup, setCommentPopup] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [currentTweetId, setCurrentTweetId] = useState(null);
  const [currentTweet, setCurrentTweet] = useState(null);
  
  // Media state
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close comments popup when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setCommentPopup(false);
      }
    };

    if (commentPopup) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [commentPopup]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/v1/tweets");
      console.log("Fetched tweets:", data.data);
      setTweets(data.data || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTweetComments = async (tweetId) => {
    try {
      const { data } = await axios.get(`/api/v1/comments/t/${tweetId}`);
      setCurrentComments(data.data || []);
    } catch (error) {
      console.error("Error fetching tweet comments:", error);
    }
  };

  const handleOpenComments = (tweet) => {
    setCurrentTweetId(tweet._id);
    setCurrentTweet(tweet);
    fetchTweetComments(tweet._id);
    setCommentPopup(true);
  };

  // Handle media file selection
  const handleMediaSelect = (event) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count (max 1 file for current backend)
    if (mediaFiles.length > 0) {
      alert("Only 1 media file per tweet is currently supported");
      return;
    }

    if (files.length > 1) {
      alert("Please select only 1 file");
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert("Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4, WebM");
      return;
    }

    // Validate file size (max 50MB per file)
    const oversizedFiles = files.filter((file) => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("Files must be less than 50MB");
      return;
    }

    // Create preview URLs and add files
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setMediaFiles((prev) => [...prev, ...files]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove media file
  const removeMedia = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostTweet = async () => {
    if (!newTweet.trim() && mediaFiles.length === 0) return;

    try {
      setIsPosting(true);

      const formData = new FormData();
      formData.append("content", newTweet);

      // Add media file (only first file, based on backend schema)
      if (mediaFiles.length > 0) {
        const firstFile = mediaFiles[0];
        formData.append("tweetImage", firstFile);
      }

      const { data } = await axios.post("/api/v1/tweets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTweets([
        {
          ...data.data,
          owner: {
            _id: user?._id,
            avatar: {
              url: user?.avatar?.url || "/default-avatar.png",
              publicId: user?.avatar?.publicId || null,
            },
            username: user?.username,
            fullname: user?.fullname,
          },
        },
        ...tweets,
      ]);

      // Reset form
      setNewTweet("");
      setMediaFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("Error posting tweet. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      await axios.post(`/api/v1/likes/toggle/t/${tweetId}`);
      setTweets(
        tweets.map((tweet) =>
          tweet._id === tweetId
            ? {
                ...tweet,
                hasLiked: !tweet.hasLiked,
                likesCount: tweet.hasLiked
                  ? tweet.likesCount - 1
                  : tweet.likesCount + 1,
              }
            : tweet,
        ),
      );
    } catch (error) {
      console.error("Error liking tweet:", error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await axios.delete(`/api/v1/tweets/${tweetId}`);
      setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
      setShowMenuId(null);
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleEditTweet = async (tweetId) => {
    if (!editContent.trim()) return;

    try {
      const { data } = await axios.patch(`/api/v1/tweets/${tweetId}`, {
        content: editContent,
      });
      setTweets(
        tweets.map((tweet) =>
          tweet._id === tweetId ? { ...tweet, content: editContent } : tweet,
        ),
      );
      setEditingTweetId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error editing tweet:", error);
    }
  };

  const startEdit = (tweet) => {
    setEditingTweetId(tweet._id);
    setEditContent(tweet.content);
    setShowMenuId(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen pb-20 lg:pb-0">
      <div className="w-full max-w-2xl mx-auto">
        {/* Create Tweet */}
        <div className="border-b border-[#272727] p-3 md:p-4 bg-[#0f0f0f]">
          <div className="flex gap-2 md:gap-3">
            <img
              src={user?.avatar?.url || "/default-avatar.png"}
              alt={user?.fullname}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover bg-gradient-to-br from-teal-600 to-green-800"
            />
            <div className="flex-1 min-w-0">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent border-none text-sm md:text-base resize-none 
                         focus:outline-none placeholder:text-gray-500 min-h-[70px] md:min-h-[80px] text-white"
                maxLength={280}
              />

              {/* Media Preview */}
              {previewUrls.length > 0 && (
                <div className="mt-3 relative rounded-lg overflow-hidden bg-[#272727] max-w-sm group">
                  {mediaFiles[0].type.startsWith("image/") ? (
                    <img
                      src={previewUrls[0]}
                      alt="Preview"
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-black">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeMedia(0)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  {/* Image Upload Button */}
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploadingMedia || mediaFiles.length >= 1}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Add image"
                  >
                    <ImagePlus className="w-5 h-5" />
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      newTweet.length > 260 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {newTweet.length}/280
                  </span>
                  <button
                    onClick={handlePostTweet}
                    disabled={(!newTweet.trim() && mediaFiles.length === 0) || isPosting}
                    className="px-4 md:px-5 py-1.5 md:py-2 bg-white text-black rounded-full font-medium 
                             hover:bg-gray-200 transition-colors disabled:opacity-50 
                             disabled:cursor-not-allowed text-sm"
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tweets List */}
        <div>
          {tweets.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#272727] rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                No tweets yet. Be the first to post!
              </p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="border-b border-[#272727] p-3 md:p-4 hover:bg-[#272727]/30 transition-colors"
              >
                {editingTweetId === tweet._id ? (
                  // Edit Mode
                  <div className="flex gap-2 md:gap-3">
                    <img
                      src={tweet.owner?.avatar?.url || "/default-avatar.png"}
                      alt={tweet.owner?.fullname}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-[#272727] border border-gray-600 rounded-lg p-2.5 md:p-3 
                                 text-sm md:text-base resize-none focus:outline-none focus:border-white 
                                 transition-colors min-h-[70px] md:min-h-[80px] text-white"
                        maxLength={280}
                        autoFocus
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${
                            editContent.length > 260
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {editContent.length}/280
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTweetId(null);
                              setEditContent("");
                            }}
                            className="px-3 py-1.5 border border-[#272727] hover:bg-[#272727] 
                                     rounded-full transition-colors text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditTweet(tweet._id)}
                            disabled={!editContent.trim()}
                            className="px-3 py-1.5 bg-white text-black rounded-full 
                                     hover:bg-gray-200 transition-colors disabled:opacity-50 
                                     disabled:cursor-not-allowed text-xs font-medium"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex gap-2 md:gap-3">
                    <img
                      src={tweet.owner?.avatar?.url || "/default-avatar.png"}
                      alt={tweet.owner?.fullname}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/channel/${tweet.owner?._id}`)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className="font-semibold text-sm hover:underline cursor-pointer"
                              onClick={() =>
                                navigate(`/channel/${tweet.owner?._id}`)
                              }
                            >
                              {tweet.owner?.fullname}
                            </span>
                            <span className="text-gray-500 text-xs">
                              @{tweet.owner?.username}
                            </span>
                            <span className="text-gray-500 text-xs">·</span>
                            <span className="text-gray-500 text-xs">
                              {timeAgo(tweet.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* More Menu */}
                        {tweet.owner?._id === user?._id && (
                          <div
                            className="relative"
                            ref={showMenuId === tweet._id ? menuRef : null}
                          >
                            <button
                              onClick={() =>
                                setShowMenuId(
                                  showMenuId === tweet._id ? null : tweet._id,
                                )
                              }
                              className="p-1 hover:bg-[#272727] rounded-full transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showMenuId === tweet._id && (
                              <div
                                className="absolute right-0 mt-1 w-36 bg-[#0f0f0f] border border-[#272727] 
                                          rounded-lg shadow-2xl overflow-hidden z-50"
                              >
                                <button
                                  onClick={() => startEdit(tweet)}
                                  className="w-full flex items-center gap-2 px-3 py-2
                                           hover:bg-[#272727] transition-colors text-left text-sm"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteTweet(tweet._id)}
                                  className="w-full flex items-center gap-2 px-3 py-2
                                           hover:bg-red-600 transition-colors text-left text-red-500 
                                           hover:text-white text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                        {tweet.content}
                      </p>

                      {/* Media Display */}
                      {tweet.image?.url && (
                        <div className="mt-3 rounded-lg overflow-hidden max-w-sm">
                          {(tweet.image.url.endsWith(".mp4") || tweet.image.url.endsWith(".webm")) ? (
                            <video
                              src={tweet.image.url}
                              controls
                              controlsList="nodownload"
                              playsInline
                              className="w-full h-auto object-cover bg-black scheme-dark"
                              
                            />
                          ) : (
                            <img
                              src={tweet.image.url}
                              alt="Tweet Media"
                              className="w-full h-auto object-cover"
                            />
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-2.5">
                        <button
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-500 
                                   transition-colors group"
                          onClick={() => handleOpenComments(tweet)}
                        >
                          <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <span className="text-xs">
                            {tweet.commentsCount || 0}
                          </span>
                        </button>

                        <button
                          onClick={() => handleLikeTweet(tweet._id)}
                          className={`flex items-center gap-1 transition-colors group
                                  ${tweet.hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                        >
                          <div className="p-1.5 rounded-full group-hover:bg-red-500/10 transition-colors">
                            <Heart
                              className={`w-4 h-4 ${tweet.hasLiked ? "fill-current" : ""}`}
                            />
                          </div>
                          <span className="text-xs">
                            {tweet.likesCount || 0}
                          </span>
                        </button>

                        <button
                          className="flex items-center gap-1 text-gray-500 hover:text-green-500 
                                   transition-colors group"
                        >
                          <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </div>
                        </button>

                        <button
                          className="ml-auto p-1.5 text-gray-500 hover:text-blue-500 
                                   hover:bg-blue-500/10 rounded-full transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comments Modal Popup */}
        {commentPopup && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setCommentPopup(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl max-h-[90vh] bg-[#0f0f0f] rounded-2xl border border-[#272727] shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#272727]">
                  <h3 className="text-lg md:text-xl font-bold">Comments</h3>
                  <button
                    onClick={() => setCommentPopup(false)}
                    className="p-1.5 hover:bg-[#272727] rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tweet Preview */}
                {currentTweet && (
                  <div className="border-b border-[#272727] p-4 md:p-5 bg-[#161616]">
                    <div className="flex gap-3">
                      <img
                        src={currentTweet.owner?.avatar?.url || "/default-avatar.png"}
                        alt={currentTweet.owner?.fullname}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm">
                            {currentTweet.owner?.fullname}
                          </span>
                          <span className="text-gray-500 text-xs">
                            @{currentTweet.owner?.username}
                          </span>
                          <span className="text-gray-500 text-xs">·</span>
                          <span className="text-gray-500 text-xs">
                            {timeAgo(currentTweet.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm md:text-base mt-2 break-words">
                          {currentTweet.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 md:p-5">
                    <CommentsSection
                      inPopup={true}
                      comments={currentComments}
                      setComments={setCurrentComments}
                      id={currentTweetId}
                      type="tweet"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tweets;