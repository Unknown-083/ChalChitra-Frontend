import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Maximize,
  Minimize,
  Share2,
  ThumbsDown,
  ThumbsUp,
  MessageSquare,
  X,
} from "lucide-react";
import axios from "../utils/axios.js";
import { formatViews, formatDate } from "../utils/helpers.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  toggleVideoLike,
  toggleSubscribe,
} from "../utils/toggleLikeSubscribe.js";
import ListPlaylistPopup from "../components/ListPlaylistPopup.jsx";
import MainLayout from "../layout/MainLayout.jsx";
import CommentsSection from "../components/Comments.jsx";

const Video = () => {
  const videos = useSelector((state) => state.video.videos);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [listPlaylistPopup, setListPlaylistPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const navigate = useNavigate();  
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        const { data } = await axios.get(`/api/v1/videos/${id}`);
        setVideo(data.data);
      } catch (error) {
        console.error(
          "Video :: getVideoDetails :: Error fetching video details:",
          error,
        );
      }
    };
    getVideoDetails();
  }, [id]);

  useEffect(() => {
    const getComments = async () => {
      const { data } = await axios.get(`/api/v1/comments/${id}`);
      setComments(data.data);
    };
    getComments();
  }, [id]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // Lock to landscape when entering fullscreen on mobile
      if (isNowFullscreen && window.innerWidth < 1024) {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock("landscape").catch(() => {
            // Silently fail if orientation lock is not supported
          });
        }
      } else if (
        !isNowFullscreen &&
        screen.orientation &&
        screen.orientation.unlock
      ) {
        screen.orientation.unlock();
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  }, []);

  // Mobile scroll handler for sticky video
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const handleScroll = () => {
      if (!videoContainerRef.current) return;

      const rect = videoContainerRef.current.getBoundingClientRect();
      const headerHeight = 60;

      // Minimize when video scrolls above header
      if (rect.top < headerHeight && rect.bottom < headerHeight + 100) {
        setIsVideoMinimized(true);
      } else {
        setIsVideoMinimized(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().catch((err) => {
        console.error("Fullscreen failed:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  

  const scrollToVideo = () => {
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsVideoMinimized(false);
  };

  const closeMinimizedVideo = () => {
    setIsVideoMinimized(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };  

  return (
    <MainLayout>
      <div className="bg-[#0f0f0f] text-white overflow-x-hidden">
        {/* Minimized Video - Mobile Only (Fixed at top) - YouTube style */}
        {isVideoMinimized && (
          <div className="lg:hidden fixed top-[60px] left-0 right-0 z-[100] bg-[#0f0f0f] shadow-lg">
            <div className="flex items-start gap-2 p-2 border-b border-[#272727]">
              <div
                className="relative w-28 aspect-video flex-shrink-0 cursor-pointer"
                onClick={scrollToVideo}
              >
                <video
                  src={video?.videoFile.url}
                  poster={video?.thumbnail.url}
                  muted
                  playsInline
                  className="w-full h-full rounded object-cover"
                ></video>
              </div>
              <div className="flex-1 min-w-0" onClick={scrollToVideo}>
                <h3 className="text-xs font-medium line-clamp-2 leading-tight">
                  {video?.title}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {video?.owner?.fullname}
                </p>
              </div>
              <button
                onClick={closeMinimizedVideo}
                className="p-1.5 hover:bg-[#272727] rounded-full transition-colors flex-shrink-0"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div>
          {/* Mobile: Normal scrollable layout */}
          <div className="lg:hidden">
            {/* Video Player - No padding to go edge to edge */}
            <div ref={videoContainerRef} className="relative w-full bg-black">
              <div className="w-full aspect-video">
                <video
                  ref={videoRef}
                  src={video?.videoFile.url}
                  poster={video?.thumbnail.url}
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload"
                  className="w-full h-full scheme-dark"
                  onDoubleClick={toggleFullscreen}
                ></video>
              </div>
            </div>

            {/* Video Info & Content - With padding */}
            <div className="px-3 pb-20">
              {/* Title */}
              <div className="mt-3">
                <h1 className="text-base sm:text-lg font-semibold leading-tight">
                  {video?.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span>{formatViews(video?.views)} views</span>
                  <span>•</span>
                  <span>{formatDate(video?.createdAt)}</span>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="h-9 w-9 rounded-full bg-gray-500 bg-cover bg-center cursor-pointer flex-shrink-0"
                    style={{
                      backgroundImage: `url(${video?.owner?.avatar.url || "#"})`,
                    }}
                    onClick={() => navigate(`/channel/${video?.owner?._id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {video?.owner?.fullname}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {video?.owner?.subscribersCount || "0"} subscribers
                    </p>
                  </div>
                </div>
                <button
                  className={`rounded-full font-medium px-4 py-2 text-xs transition-all whitespace-nowrap ml-2 ${
                    video?.owner?.isSubscribed
                      ? "bg-[#272727] text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() =>
                    toggleSubscribe({
                      channelId: video?.owner?._id,
                      setVideo,
                    })
                  }
                >
                  {video?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
                <div className="rounded-full items-center px-4 py-2 bg-[#272727] flex gap-2 cursor-pointer whitespace-nowrap">
                  <ThumbsUp
                    className={`w-5 h-5 ${
                      video?.hasLiked ? "text-white fill-white" : ""
                    }`}
                    onClick={() => toggleVideoLike(id, setVideo)}
                  />
                  <span className="text-sm font-medium pr-2 border-r border-r-gray-500">
                    {video?.likesCount || 0}
                  </span>
                  <ThumbsDown className="w-5 h-5" />
                </div>
                <button className="rounded-full px-4 py-2 bg-[#272727] flex gap-2 items-center whitespace-nowrap">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
                <button
                  className="rounded-full px-4 py-2 bg-[#272727] flex gap-2 items-center whitespace-nowrap"
                  onClick={() => setListPlaylistPopup(true)}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="text-sm font-medium">Save</span>
                </button>
              </div>

              {/* Description */}
              <div className="mt-4 p-3 text-xs bg-[#272727] rounded-lg">
                <p className="text-white whitespace-pre-wrap break-words line-clamp-3">
                  {video?.description}
                </p>
              </div>

              {/* Comments Section */}
              <div className="mt-4">
                <button
                  className="w-full p-3 bg-[#272727] rounded-lg flex items-center justify-between"
                  onClick={() => setShowCommentPopup(true)}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium text-sm">Comments</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {comments?.totalComments || 0}
                  </span>
                </button>
              </div>

              {/* More Videos */}
              <div className="mt-6">
                <div className="flex flex-col gap-3">
                  {videos && videos.length > 0
                    ? videos.map((video, index) => (
                        <div
                          onClick={() => navigate(`/video/${video.id}`)}
                          key={index}
                          className="flex gap-2 cursor-pointer group"
                        >
                          <div className="relative w-40 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-[#272727]">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            {video.duration && (
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-90 px-1 py-0.5 rounded text-[10px] font-semibold">
                                {video.duration}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium line-clamp-2 leading-snug">
                              {video.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {video.channel}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {video.views} • {video.time}
                            </p>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Two independently scrollable columns */}
          <div className="hidden lg:flex gap-5 px-6 py-4 h-[calc(100vh-60px)] max-w-[2000px] mx-auto">
            {/* Left Column - Video & Comments (Scrollable) */}
            <div className="w-[60%] h-full overflow-y-auto scrollbar-hide pr-2">
              {/* Video Player */}
              <div className="relative w-full aspect-video rounded-xl bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  src={video?.videoFile.url}
                  poster={video?.thumbnail.url}
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload"
                  className="w-full h-full"
                  onDoubleClick={toggleFullscreen}
                ></video>
              </div>

              {/* Video Info */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold leading-tight">
                  {video?.title}
                </h1>

                <div className="flex items-center justify-between gap-4 mt-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full bg-gray-500 bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        backgroundImage: `url(${video?.owner?.avatar.url || "#"})`,
                      }}
                      onClick={() => navigate(`/channel/${video?.owner?._id}`)}
                    />
                    <div>
                      <h3 className="text-base font-medium">
                        {video?.owner?.fullname}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {video?.owner?.subscribersCount || "0"} subscribers
                      </p>
                    </div>
                    <button
                      className={`rounded-full font-medium px-4 py-2 text-sm transition-all ml-2 ${
                        video?.owner?.isSubscribed
                          ? "bg-[#272727] text-white hover:bg-[#3f3f3f]"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        toggleSubscribe({
                          channelId: video?.owner?._id,
                          setVideo,
                        })
                      }
                    >
                      {video?.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <div className="rounded-full items-center p-1.5 px-4 bg-[#272727] flex gap-1 cursor-pointer hover:bg-[#3f3f3f]">
                      <ThumbsUp
                        className={`w-5 h-5 ${
                          video?.hasLiked ? "text-white fill-white" : ""
                        }`}
                        onClick={() => toggleVideoLike(id, setVideo)}
                      />
                      <span className="pr-3 font-medium border-r border-r-gray-400">
                        {video?.likesCount || 0}
                      </span>
                      <ThumbsDown className="ml-2 w-5 h-5" />
                    </div>
                    <div className="rounded-full p-1.5 pr-2.5 bg-[#272727] cursor-pointer hover:bg-[#3f3f3f] flex gap-1 items-center">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </div>
                    <button
                      className="rounded-full p-1.5 bg-[#272727] cursor-pointer hover:bg-[#3f3f3f]"
                      onClick={() => setListPlaylistPopup(true)}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="bg-[#272727] p-2 rounded-full cursor-pointer hover:bg-[#3f3f3f]"
                    >
                      {isFullscreen ? (
                        <Minimize size={18} />
                      ) : (
                        <Maximize size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 p-3 text-sm bg-[#272727] rounded-lg">
                  <div className="font-medium text-gray-300 mb-1">
                    {formatViews(video?.views)} views •{" "}
                    {formatDate(video?.createdAt)}
                  </div>
                  <p className="text-white whitespace-pre-wrap break-words">
                    {video?.description}
                  </p>
                </div>

                {/* Comments */}
                <CommentsSection comments={comments} setComments={setComments} id={id} />
              </div>
            </div>

            {/* Right Column - Suggested Videos (Scrollable) */}
            <div className="w-[40%] h-full overflow-y-auto scrollbar-hide p-2 pt-0">
              {videos && videos.length > 0
                ? videos.map((video, index) => (
                    <div
                      onClick={() => navigate(`/video/${video.id}`)}
                      key={index}
                      className="flex w-full mb-4 cursor-pointer group"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-[40%] h-24 rounded-lg bg-gray-500 mr-4 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="w-[60%] min-w-0">
                        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-gray-300 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {video.channel}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {video.views} • {video.time}
                        </p>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>

        {/* Comments Popup - Mobile Only */}
        {showCommentPopup && (
          <div className="lg:hidden fixed inset-0 z-[999] bg-[#0f0f0f]">
            <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#272727] px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Comments ({comments?.totalComments || 0})
              </h2>
              <button
                onClick={() => setShowCommentPopup(false)}
                className="p-2 hover:bg-[#272727] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(100%-60px)] overflow-y-auto px-4 py-4">
              <CommentsSection inPopup={true} comments={comments} setComments={setComments} id={id}/>
            </div>
          </div>
        )}

        {/* List Playlist Popup */}
        {listPlaylistPopup && (
          <ListPlaylistPopup
            videoId={id}
            setListPlaylistPopup={setListPlaylistPopup}
          />
        )}

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </MainLayout>
  );  
};

export default Video;
