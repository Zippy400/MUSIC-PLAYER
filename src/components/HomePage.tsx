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
          key: import.meta.env.VITE_YOUTUBE_API_KEY
        }
      });
      setResults(res.data.items);
    } catch (err) {
      console.error("YouTube API error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Search for a song or artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchYouTube}>Search</button>

      <div style={{ marginTop: "20px" }}>
        {results.map((video) => (
          <div key={video.id.videoId} style={{ marginBottom: "20px" }}>
            <h3>{video.snippet.title}</h3>
            <iframe
              width="300"
              height="180"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
