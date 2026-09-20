// src/components/home/HeroSlider.jsx - Ultra-Cinematic 720px OTT Hero Carousel
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Plus, Check, Download, Star, Info, 
  ChevronLeft, ChevronRight, Film, X, Sparkles, Volume2 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { getHeroBackdrop } from '../../utils/imageUtils';

export const HeroSlider = ({ featuredList = [], onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [trailerModalUrl, setTrailerModalUrl] = useState(null);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  const animeList = featuredList && featuredList.length > 0 ? featuredList.slice(0, 8) : [];
  const currentAnime = animeList[currentIndex] || animeList[0];

  // Auto slide every 7 seconds
  useEffect(() => {
    if (isPaused || animeList.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % animeList.length);
    }, 7000);

    return () => clearInterval(timerRef.current);
  }, [isPaused, animeList.length, currentIndex]);

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev - 1 + animeList.length) % animeList.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev + 1) % animeList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animeList.length]);

  if (!currentAnime) return null;

  const isFav = isFavorite(currentAnime.id);
  const heroImg = getHeroBackdrop(currentAnime);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + animeList.length) % animeList.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % animeList.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const handleFavoriteToggle = () => {
    const added = toggleFavorite(currentAnime.id);
    const title = lang === 'bn' ? (currentAnime.banglaTitle || currentAnime.title) : currentAnime.title;
    if (added) {
      showSuccess(`"${title}" ${t('toastAddedToList')}`);
    } else {
      showInfo(`"${title}" ${t('toastRemovedFromList')}`);
    }
  };

  const openTrailer = () => {
    if (currentAnime.trailer?.id) {
      setTrailerModalUrl(`https://www.youtube.com/embed/${currentAnime.trailer.id}?autoplay=1`);
    } else {
      showInfo("Official trailer is streaming on YouTube");
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(currentAnime.title + " official trailer")}`, '_blank');
    }
  };

  return (
    <>
      <section 
        className="hero-slider-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dynamic High-Res Backdrop Image */}
        <div className="hero-backdrop-container">
          <img 
            key={currentAnime.id}
            src={heroImg} 
            alt={currentAnime.title} 
            className="hero-backdrop-img animate-fade-in"
            onError={(e) => {
              e.target.src = currentAnime.largePosterImage || currentAnime.posterImage;
            }}
          />
          {/* Layered Vignette & Dark Cinematic Gradients */}
          <div className="hero-vignette" />
          <div className="hero-gradient-left" />
          <div className="hero-gradient-bottom" />
          <div className="hero-gradient-top" />
          <div className="hero-gradient-right" />
        </div>

        {/* Hero Content Wrapper */}
        <div className="hero-content-wrapper container">
          <div className="hero-content-card">
            
            {/* Badges Row */}
            <div className="hero-badge-row">
              <span className="hero-trending-badge">
                <Sparkles size={14} />
                {t('trendingNow')}
              </span>
              <span className="badge badge-rating">
                <Star size={13} fill="currentColor" />
                {currentAnime.rating} / 10
              </span>
              <span className="badge badge-glass">
                {currentAnime.format || currentAnime.type || "4K UHD"}
              </span>
              <span className="badge badge-glass">
                {currentAnime.releaseYear}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-anime-title">
              {lang === 'bn' ? (currentAnime.banglaTitle || currentAnime.title) : currentAnime.title}
            </h1>

            {/* Subtitle / Alternate Title */}
            {currentAnime.englishTitle && currentAnime.englishTitle !== currentAnime.title && (
              <h2 className="hero-anime-subtitle">{currentAnime.englishTitle}</h2>
            )}

            {/* Audio Badges (Hindi, English, Japanese) */}
            <div className="hero-audio-tags">
              {currentAnime.audioTypes?.includes("Hindi Dub") && (
                <span className="audio-pill dub-hin">Hindi Dub 🇮🇳</span>
              )}
              {currentAnime.audioTypes?.includes("English Dub") && (
                <span className="audio-pill dub-eng">English Dub 🇺🇸</span>
              )}
              <span className="audio-pill sub-jap">Japanese Sub 🇯🇵</span>
            </div>

            {/* Synopsis */}
            <p className="hero-synopsis">
              {lang === 'bn' ? (currentAnime.banglaDescription || currentAnime.description) : currentAnime.description}
            </p>

            {/* Action Buttons */}
            <div className="hero-action-buttons">
              <button 
                className="btn btn-primary btn-hero-play"
                onClick={() => navigate(`/watch/${currentAnime.id}/1`)}
              >
                <Play size={22} fill="currentColor" />
                <span>{t('watchNow')}</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={openTrailer}
              >
                <Film size={18} />
                <span>{t('trailer')}</span>
              </button>

              <button 
                className={`btn btn-secondary ${isFav ? 'active-fav' : ''}`}
                onClick={handleFavoriteToggle}
              >
                {isFav ? <Check size={18} /> : <Plus size={18} />}
                <span>{isFav ? t('inList') : t('addToList')}</span>
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/anime/${currentAnime.id}`)}
              >
                <Info size={18} />
                <span>{t('details')}</span>
              </button>

              <button 
                className="btn btn-secondary btn-icon-only"
                onClick={() => onOpenDownload && onOpenDownload(currentAnime, 1)}
                title={t('download')}
                aria-label="Download episode"
              >
                <Download size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Prev & Next Controls */}
        <button 
          className="hero-nav-arrow prev" 
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button 
          className="hero-nav-arrow next" 
          onClick={handleNext}
          aria-label="Next Slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="hero-indicator-dots">
          {animeList.map((anime, index) => (
            <button
              key={anime.id}
              className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide to ${anime.title}`}
            />
          ))}
        </div>

      </section>

      {/* Trailer Modal Popup */}
      {trailerModalUrl && (
        <div className="modal-overlay" onClick={() => setTrailerModalUrl(null)}>
          <div className="trailer-modal-container glass-dropdown" onClick={e => e.stopPropagation()}>
            <div className="trailer-modal-header">
              <span className="trailer-title">{currentAnime.title} — Official Trailer</span>
              <button className="btn-icon-small" onClick={() => setTrailerModalUrl(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="trailer-iframe-box">
              <iframe
                src={trailerModalUrl}
                title="Anime Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
