import { useState } from "react";
import axios from "axios";

function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((video) => (
          <div
            key={video.id.videoId}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-xs text-gray-500">{video.snippet.channelTitle}</p>
              <div className="mt-3">
                <iframe
                  className="w-full h-40 rounded-md"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
