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
              Authorization: 'Bearer YOUR_API_KEY_HERE'
            }
          }
        );
        const data = await res.json();
        setVideo(data.results?.[0] || null);
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
        <p>No trailer available</p>
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
