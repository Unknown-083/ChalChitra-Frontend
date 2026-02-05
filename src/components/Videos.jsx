import { useEffect, useState } from "react";
import { MoreVertical, Play, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

const Videos = ({
  grid = true,
  videoArray = null,
  setVideoId = () => {},
  setVideoMenuPopup = () => {},
}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState(null);

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-[#272727] rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Videos Available
        </h3>
        <p className="text-gray-400 text-sm">
          Check back later for new content
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        grid
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex gap-4 overflow-x-auto scrollbar-hide"
      }
    >
      {videos.map((video) => (
        <div
          key={video.id}
          className={`group ${!grid ? "w-80 flex-shrink-0" : ""}`}
        >
          {/* Thumbnail */}
          <div
            className={`relative cursor-pointer aspect-video rounded-xl overflow-hidden mb-3 ${
              grid ? "" : "w-80"
            }`}
            onClick={() => navigate(`/video/${video.id}`)}
          >
            {/* Thumbnail Image */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="object-cover w-full h-full bg-black"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==";
              }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 drop-shadow-lg" />
            </div>

            {/* Duration */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-white">
              {video.duration}
            </div>
          </div>

          {/* Video Info */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div
              className="w-9 h-9 bg-gradient-to-br from-teal-600 to-green-800 rounded-full flex items-center justify-center flex-shrink-0 bg-cover bg-center cursor-pointer"
              style={{
                backgroundImage: video.avatar ? `url(${video.avatar})` : "none",
              }}
              onClick={() => navigate(`/channel/${video?.channelId}`)}
            >
              {!video.avatar && (
                <span className="text-white font-semibold text-sm">
                  {video.channel?.charAt(0)?.toUpperCase() || "?"}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white group-hover:text-gray-300 transition-colors line-clamp-2 mb-1">
                {video.title}
              </h3>

              <p
                className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors mb-1"
                onClick={() => navigate(`/channel/${video.channelId}`)}
              >
                {video.channel}
              </p>

              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.time}</span>
              </div>
            </div>

            <MoreVertical
              className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors opacity-0 group-hover:opacity-100 drop-shadow-sm"
              onClick={() => {
                setVideoId(video.id);
                setVideoMenuPopup(true);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;
