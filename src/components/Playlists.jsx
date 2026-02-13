import { MoreVertical, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import PlaylistPopup from "./PlaylistPopup";
import Loading from "./Loading";

const Playlists = ({ grid = true }) => {
  const navigate = useNavigate();
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistPopup, setPlaylistPopup] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserPlaylists = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("/api/v1/playlists");
        setPlaylists(data.data || []);
        // Handle playlists data as needed
      } catch (error) {
        console.error("Error fetching user playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserPlaylists();
  }, []);
  if (isLoading && playlists === null) return <Loading />;

  return (
    <div
      className={
        grid
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex gap-4 overflow-x-auto scrollbar-hide"
      }
    >
      {playlists &&
        playlists.map((playlist) => (
          <div
            key={playlist._id}
            className={`group ${!grid ? "w-80 flex-shrink-0" : ""}`}
          >
            {/* Thumbnail */}
            <div
              className={`relative cursor-pointer aspect-video rounded-xl overflow-hidden mb-3 ${
                grid ? "" : "w-80"
              }`}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
            >
              {/* Thumbnail Image */}
              <img
                src={playlist?.videos[0]?.thumbnail?.url || "#"}
                alt={playlist.name}
                className="object-cover w-full h-full bg-[#272727]"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==";
                }}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 drop-shadow-lg" />
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white bg-black">
                {playlist?.videos?.length || 0} videos
              </div>
            </div>

            <div className="flex flex-col ml-2">
              <h3 className="text-lg flex justify-between items-center">
                {playlist.name}
                {(playlist.name!="Watch Later") && (<MoreVertical
                  className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors opacity-0 group-hover:opacity-100 drop-shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaylistPopup(true);
                    setPlaylistId(playlist._id);
                  }}
                />)}
              </h3>
              <p
                className="text-sm text-gray-500 hover:text-white cursor-pointer"
                onClick={() => navigate(`/playlists/${playlist._id}`)}
              >
                View full playlist
              </p>
            </div>
          </div>
        ))}

      {/* Playlist Popup */}
      {playlistPopup && (
        <PlaylistPopup
          id={playlistId}
          playlistData={playlistData}
          setPlaylistData={setPlaylistData}
          setPlaylistPopup={setPlaylistPopup}
          setPlaylists={setPlaylists}
        />
      )}
    </div>
  );
};

export default Playlists;
