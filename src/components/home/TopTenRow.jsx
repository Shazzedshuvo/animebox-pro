// src/components/home/TopTenRow.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TopTenRow = ({ animeList = [] }) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const top10 = animeList.slice(0, 10);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction) => {
    if (!trackRef.current) return;
    const amount = direction === 'left' ? -500 : 500;
    trackRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="top-ten-row-wrapper">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-indicator gold" />
          <Trophy size={22} className="text-gold" />
          <h2 className="section-title">{t('topTenThisWeek')}</h2>
        </div>
      </div>

      <div className="top-ten-slider-container">
        {canScrollLeft && (
          <button className="row-nav-btn prev" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="top-ten-track" ref={trackRef} onScroll={checkScroll}>
          {top10.map((anime, index) => {
            const rankFormatted = String(index + 1).padStart(2, '0');
            return (
              <div 
                key={anime.id} 
                className="top-rank-card"
                onClick={() => navigate(`/anime/${anime.id}`)}
              >
                {/* Large Metallic Rank Number */}
                <div className="top-rank-number">
                  {rankFormatted}
                </div>

                {/* Poster Card */}
                <div className="top-rank-poster-wrap">
                  <img 
                    src={anime.posterImage} 
                    alt={anime.title} 
                    className="top-rank-img" 
                    loading="lazy"
                  />
                  <div className="top-rank-overlay">
                    <button 
                      className="top-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/watch/${anime.id}/1`);
                      }}
                      title={t('watchNow')}
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="top-rank-info">
                  <h4 className="top-rank-title">
                    {lang === 'bn' ? anime.banglaTitle : anime.title}
                  </h4>
                  <div className="top-rank-meta">
                    <span className="badge badge-rating">
                      <Star size={11} fill="currentColor" /> {anime.rating}
                    </span>
                    <span className="top-genre">{anime.genres[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canScrollRight && (
          <button className="row-nav-btn next" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};
