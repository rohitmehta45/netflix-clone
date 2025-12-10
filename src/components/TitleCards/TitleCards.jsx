import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzk5NGI3NDQ4OGI0MjI1Y2VmYWE3YTY0ZDVhOTgyZSIsIm5iZiI6MTc2NTM2ODM1OC4wMTUsInN1YiI6IjY5Mzk2MjI2MTA3NDAzZDY2NjA2YTM5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xKOVgDHJ9pn_cX7_31kvoMlcz0dWkqqWaUyMXUd0whY'
    }
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${category || "now_playing"}?language=en-US&page=1`,
      options
    )
      .then(res => res.json())
      .then(res => setApiData(res.results || []))
      .catch(err => console.error(err));

    const slider = cardsRef.current;

    const handleWheel = e => {
      e.preventDefault();
      slider.scrollLeft += e.deltaY;
    };
    slider.addEventListener('wheel', handleWheel, { passive: false });

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDown = e => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const mouseUp = () => {
      isDown = false;
      slider.classList.remove('active');
    };

    const mouseMove = e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', mouseDown);
    slider.addEventListener('mouseleave', mouseLeave);
    slider.addEventListener('mouseup', mouseUp);
    slider.addEventListener('mousemove', mouseMove);

    return () => {
      slider.removeEventListener('wheel', handleWheel);
      slider.removeEventListener('mousedown', mouseDown);
      slider.removeEventListener('mouseleave', mouseLeave);
      slider.removeEventListener('mouseup', mouseUp);
      slider.removeEventListener('mousemove', mouseMove);
    };
  }, [category]);

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {Array.isArray(apiData) && apiData.map((card, index) => (
          <Link to={`/player/${card.id}`} className="card" key={index}>
            <img
              src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
