import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useParams, useNavigate } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);

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

        // Pick ONLY official YouTube trailer — prevents unsafe redirects
        const youtubeTrailer =
          data.results?.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
          ) || null;

        setVideo(youtubeTrailer);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideo();
  }, [id]);

  return (
    <div className="player">
      <img src={back_arrow_icon} alt="" onClick={() => navigate(-1)} />

      {video ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${video.key}`}
          title={video.name}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <p>No official trailer available</p>
      )}

      {video && (
        <div className="player-info">
          <p>{video.name}</p>
          <p>{video.type}</p>
          <p>{video.published_at}</p>
        </div>
      )}
    </div>
  );
};

export default Player;
