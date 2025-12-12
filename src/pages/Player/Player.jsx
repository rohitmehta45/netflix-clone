import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useParams, useNavigate } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          }
        );

        const data = await res.json();
        const results = data.results || [];

        // Prefer trailer → then any YouTube video
        let bestVideo =
          results.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          ) || results.find((v) => v.site === 'YouTube');

        setVideo(bestVideo || null);

        // Validate YouTube key
        if (bestVideo) {
          const testUrl = `https://img.youtube.com/vi/${bestVideo.key}/0.jpg`;

          // Try loading the thumbnail → if fails, the video does not exist
          const img = new Image();
          img.onload = () => setValid(true);
          img.onerror = () => setValid(false);
          img.src = testUrl;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="player">
      <img src={back_arrow_icon} alt="" onClick={() => navigate(-1)} />

      {video && valid ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${video.key}`}
          title={video.name}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <p>No safe trailer available</p>
      )}
    </div>
  );
};

export default Player;
