import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any | null>(null);
  const [playTime, setPlayTime] = useState(0);

  const searchYouTube = async () => {
    try {
      const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults: 10,
          key: import.meta.env.VITE_YOUTUBE_API_KEY,
        },
      });
      setResults(res.data.items);
    } catch (err) {
      console.error("YouTube API error:", err);
    }
  };

  const addToFavorites = (video: any) => {
    if (!favorites.find((fav) => fav.id.videoId === video.id.videoId)) {
      setFavorites([...favorites, video]);
    }
  };

  const playVideo = (video: any) => {
    setNowPlaying(video);
    setPlayTime(0);
  };

  useEffect(() => {
    let timer: any;
    if (nowPlaying) {
      timer = setInterval(() => setPlayTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [nowPlaying]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Now Playing Section */}
      {nowPlaying && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">🎶 Now Playing</h2>
          <p className="font-semibold">{nowPlaying.snippet.title}</p>
          <p className="text-sm text-gray-600">
            {nowPlaying.snippet.channelTitle} | {playTime}s elapsed
          </p>
          <iframe
            className="w-full h-56 mt-3 rounded-lg"
            src={`https://www.youtube.com/embed/${nowPlaying.id.videoId}?autoplay=1`}
            title={nowPlaying.snippet.title}
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search for a song or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <button
          onClick={searchYouTube}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Results Grid */}
      <h2 className="font-bold mb-3">Search Results</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {results.map((video) => (
          <div
            key={video.id.videoId}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-xs text-gray-500">{video.snippet.channelTitle}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => playVideo(video)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg"
                >
                  ▶ Play
                </button>
                <button
                  onClick={() => addToFavorites(video)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg"
                >
                  ⭐ Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">⭐ My Favorites</h2>
          <ul className="list-disc ml-6 space-y-2">
            {favorites.map((fav) => (
              <li key={fav.id.videoId}>
                {fav.snippet.title} – {fav.snippet.channelTitle}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HomePage;
