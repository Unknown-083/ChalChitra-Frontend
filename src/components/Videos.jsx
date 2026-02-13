import { useEffect, useState } from "react";
import { MoreVertical, Play, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import VideoMenuPopup from "./VideoMenuPopup";

const Videos = ({
  grid = true,
  videoArray = null,
  playlistId = null,
  playlistName = null,
  setPlaylistData = () => {},
}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState(null);
  const [videoMenuPopup, setVideoMenuPopup] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const localVideos = useSelector((state) => state.video.videos);

  useEffect(() => {
    if (videoArray !== null) {
      setVideos(videoArray);
    } else {
      setVideos(localVideos);
    }
  }, [videoArray, localVideos]);

  // Loading state
  if (videos === null || videos === undefined) {
    return <Loading />;
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#272727] rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          No Videos Available
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm">
          Check back later for new content
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        grid
          ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
          : "flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2"
      }
    >
      {videos.map((video) => (
        <div
          key={video.id}
          className={`group ${!grid ? "w-64 sm:w-72 md:w-80 flex-shrink-0" : ""}`}
        >
          {/* Thumbnail */}
          <div
            className={`relative cursor-pointer aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#272727] ${
              grid ? "" : "w-64 sm:w-72 md:w-80"
            }`}
            onClick={() => navigate(`/video/${video.id}`)}
          >
            {/* Thumbnail Image */}
            <img
              src={video.thumbnail}
              alt={video.title || "Video thumbnail"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/640x360/272727/666666?text=No+Thumbnail";
              }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
              <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 drop-shadow-lg fill-white" />
            </div>

            {/* Duration */}
            {video.duration && (
              <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-black bg-opacity-90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-semibold text-white">
                {video.duration}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="flex px-3 gap-2 sm:gap-3">
            {/* Avatar */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-600 to-green-800 rounded-full flex items-center justify-center flex-shrink-0 bg-cover bg-center cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundImage: video.avatar ? `url(${video.avatar})` : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${video?.channelId}`);
              }}
            >
              {!video.avatar && (
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {video.channel?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-sm sm:text-base text-white group-hover:text-gray-300 transition-colors line-clamp-2 mb-0.5 sm:mb-1 leading-snug cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                {video.title}
              </h3>

              <p
                className="text-xs sm:text-sm text-gray-400 hover:text-white cursor-pointer transition-colors mb-0.5 sm:mb-1 truncate"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/channel/${video.channelId}`);
                }}
              >
                {video.channel}
              </p>

              <div className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 sm:gap-1.5">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.time}</span>
              </div>
            </div>

            {/* More Options - Show on hover for desktop, always show on mobile */}
            <div className="flex-shrink-0">
              <MoreVertical
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white active:text-white cursor-pointer transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 drop-shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoId(video.id);
                  setOwnerId(video.channelId);
                  setVideoMenuPopup(true);
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Video Menu Popup */}
      {videoMenuPopup && (
        <VideoMenuPopup
          videoId={videoId}
          ownerId={ownerId}
          playlistId={playlistId}
          playlistName={playlistName}
          setVideoMenuPopup={setVideoMenuPopup}
          setPlaylistData={setPlaylistData}
          setVideos={setVideos}
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
  );
};

export default Videos;