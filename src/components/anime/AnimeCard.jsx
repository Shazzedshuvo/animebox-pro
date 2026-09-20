// src/components/anime/AnimeCard.jsx
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, Plus, Check, Download, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';

export const AnimeCard = ({ anime, onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();
  
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isFav = isFavorite(anime.id);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(anime.id);
    const title = lang === 'bn' ? anime.banglaTitle : anime.title;
    if (added) {
      showSuccess(`"${title}" ${t('toastAddedToList')}`);
    } else {
      showInfo(`"${title}" ${t('toastRemovedFromList')}`);
    }
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDownload) {
      onOpenDownload(anime);
    } else {
      navigate(`/anime/${anime.id}`);
    }
  };

  return (
    <div 
      className="anime-card-root"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      {isHovered && (
        <div 
          className="card-spotlight-glow"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
        />
      )}

      <Link to={`/anime/${anime.id}`} className="card-link-wrap">
        
        {/* Poster Image Container */}
        <div className="card-poster-wrap">
          <img 
            src={anime.posterImage} 
            alt={anime.title} 
            className="card-poster-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=600&h=900&fit=cover";
            }}
          />

          {/* Gradient Overlay */}
          <div className="card-poster-overlay" />

          {/* Top Badges */}
          <div className="card-top-badges">
            <span className="badge badge-rating">
              <Star size={12} fill="currentColor" />
              {anime.rating}
            </span>
            <span className="badge badge-glass">
              {anime.quality || 'FHD'}
            </span>
          </div>

          {/* Sub / Dub Audio Badges */}
          <div className="card-audio-badges">
            {anime.audioType?.includes("Hindi Dub") && (
              <span className="audio-badge hin">HIN</span>
            )}
            {anime.audioType?.includes("English Dub") && (
              <span className="audio-badge eng">ENG</span>
            )}
            <span className="audio-badge sub">SUB</span>
          </div>

          {/* Hover Action Overlay */}
          <div className="card-hover-actions">
            <button 
              className="hover-play-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/watch/${anime.id}/1`);
              }}
              title={t('watchNow')}
              aria-label="Play Episode 1"
            >
              <Play size={20} fill="currentColor" />
            </button>

            <div className="hover-action-row">
              <button 
                className={`card-circle-btn ${isFav ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                title={isFav ? t('inList') : t('addToList')}
              >
                {isFav ? <Check size={16} /> : <Plus size={16} />}
              </button>

              <button 
                className="card-circle-btn"
                onClick={handleDownloadClick}
                title={t('download')}
              >
                <Download size={16} />
              </button>

              <button 
                className="card-circle-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/anime/${anime.id}`);
                }}
                title={t('details')}
              >
                <Info size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Card Metadata Footer */}
        <div className="card-info-wrap">
          <h3 className="card-title" title={anime.title}>
            {lang === 'bn' ? anime.banglaTitle : anime.title}
          </h3>
          <div className="card-meta-line">
            <span className="meta-year">{anime.releaseYear}</span>
            <span className="meta-dot">•</span>
            <span className="meta-genre">{anime.genres?.[0] || 'Anime'}</span>
            <span className="meta-dot">•</span>
            <span className="meta-eps">{anime.type === 'Movie' ? t('movie') : `${anime.totalEpisodes || 12} ${t('episodes')}`}</span>
          </div>
        </div>

      </Link>
    </div>
  );
};
