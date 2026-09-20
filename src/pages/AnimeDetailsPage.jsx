// src/pages/AnimeDetailsPage.jsx - Real API-Powered Anime Details Page
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, Plus, Check, Download, Share2, Star, 
  Calendar, Clock, ShieldAlert, Sparkles, Tv, Film, Heart, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { useAnimeDetailsQuery } from '../hooks/useAnimeQuery';
import { getHeroBackdrop } from '../utils/imageUtils';
import { EpisodeSelector } from '../components/player/EpisodeSelector';
import { AnimeRow } from '../components/home/AnimeRow';
import { Loader } from '../components/common/Loader';

export const AnimeDetailsPage = ({ onOpenDownload }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showSuccess, showInfo } = useToast();

  const [trailerModalUrl, setTrailerModalUrl] = useState(null);

  const { data: anime, isLoading } = useAnimeDetailsQuery(id);

  const isFav = anime ? isFavorite(anime.id) : false;

  const handleFavoriteToggle = () => {
    if (!anime) return;
    const added = toggleFavorite(anime.id);
    const title = lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title;
    if (added) {
      showSuccess(`"${title}" ${t('toastAddedToList')}`);
    } else {
      showInfo(`"${title}" ${t('toastRemovedFromList')}`);
    }
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showSuccess(t('toastLinkCopied'));
      } else {
        showInfo(window.location.href);
      }
    } catch {
      showSuccess(t('toastLinkCopied'));
    }
  };

  const openTrailer = () => {
    if (anime?.trailer?.id) {
      setTrailerModalUrl(`https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1`);
    } else {
      showInfo("Streaming trailer on YouTube");
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((anime?.title || "Anime") + " official trailer")}`, '_blank');
    }
  };

  if (isLoading || !anime) {
    return (
      <div className="container mt-12">
        <Loader message={lang === 'bn' ? 'এনিমে বিস্তারিত লোড হচ্ছে...' : 'Fetching Anime Details from AniList...'} />
      </div>
    );
  }

  const heroBackdrop = getHeroBackdrop(anime);

  return (
    <div className="anime-details-root">
      
      {/* 1. Cinematic Hero Backdrop */}
      <div className="details-hero-backdrop">
        <img 
          src={heroBackdrop} 
          alt={anime.title} 
          className="details-backdrop-img"
          onError={(e) => {
            e.target.src = anime.largePosterImage || anime.posterImage;
          }}
        />
        <div className="details-gradient-overlay" />
      </div>

      {/* 2. Main Details Content Wrapper */}
      <div className="container details-content-container">
        <div className="details-main-grid">
          
          {/* Left Poster Column */}
          <div className="details-poster-col">
            <div className="details-poster-card glass-panel">
              <img 
                src={anime.largePosterImage || anime.posterImage} 
                alt={anime.title} 
                className="details-poster-img"
              />
              <div className="poster-audio-badges">
                {anime.audioTypes?.map((aud, i) => (
                  <span key={i} className="badge badge-crimson">{aud}</span>
                ))}
              </div>
            </div>

            {/* Quick Mobile Action */}
            <button 
              className="btn btn-primary w-full mt-4 details-play-btn mobile-only"
              onClick={() => navigate(`/watch/${anime.id}/1`)}
            >
              <Play size={20} fill="currentColor" />
              <span>{t('watchNow')} (Ep 1)</span>
            </button>
          </div>

          {/* Right Info Column */}
          <div className="details-info-col">
            
            {/* Meta Badges */}
            <div className="details-badges-row">
              <span className="badge badge-rating">
                <Star size={14} fill="currentColor" />
                {anime.rating} / 10
              </span>
              <span className="badge badge-glass">{anime.format || anime.type || "4K UHD"}</span>
              <span className="badge badge-glass">{anime.status}</span>
              <span className="badge badge-glass">{anime.releaseYear}</span>
            </div>

            {/* Title Header */}
            <h1 className="details-title">
              {lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title}
            </h1>

            {/* Secondary Title */}
            {anime.englishTitle && anime.englishTitle !== anime.title && (
              <h2 className="details-sub-title">{anime.englishTitle}</h2>
            )}

            {/* Genres Row */}
            <div className="details-genres-list">
              {anime.genres?.map(genre => (
                <Link 
                  to={`/browse?genre=${encodeURIComponent(genre)}`} 
                  key={genre} 
                  className="details-genre-pill"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Metadata Stats Grid */}
            <div className="details-specs-grid">
              <div className="spec-item">
                <Calendar size={16} className="spec-icon" />
                <span className="spec-label">{t('year')}:</span>
                <span className="spec-value">{anime.releaseYear}</span>
              </div>
              <div className="spec-item">
                <Clock size={16} className="spec-icon" />
                <span className="spec-label">{t('duration')}:</span>
                <span className="spec-value">{anime.duration}</span>
              </div>
              <div className="spec-item">
                <Tv size={16} className="spec-icon" />
                <span className="spec-label">{t('episodes')}:</span>
                <span className="spec-value">{anime.totalEpisodes || 12}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="details-synopsis-box">
              <h3 className="synopsis-heading">{t('synopsis')}</h3>
              <p className="synopsis-paragraph">
                {lang === 'bn' ? (anime.banglaDescription || anime.description) : anime.description}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="details-actions-bar">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate(`/watch/${anime.id}/1`)}
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
                onClick={() => onOpenDownload && onOpenDownload(anime, 1)}
              >
                <Download size={18} />
                <span>{t('download')}</span>
              </button>

              <button 
                className="btn btn-secondary btn-icon-only"
                onClick={handleShare}
                title={t('share')}
              >
                <Share2 size={18} />
              </button>
            </div>

          </div>

        </div>

        {/* 3. Characters & Voice Cast */}
        {anime.characters && anime.characters.length > 0 && (
          <div className="details-characters-section mt-10">
            <h3 className="section-title mb-4">{t('characters')}</h3>
            <div className="characters-scroll-track">
              {anime.characters.map(char => (
                <div key={char.id} className="character-card glass-panel">
                  <img src={char.image} alt={char.name} className="character-img" />
                  <div className="character-info">
                    <span className="character-name">{char.name}</span>
                    <span className="character-native">{char.nativeName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Episodes Section */}
        <div className="details-episodes-section mt-10">
          <EpisodeSelector 
            anime={anime} 
            currentEpisode={1} 
            onOpenDownload={onOpenDownload} 
          />
        </div>

        {/* 5. You May Also Like (Real API Recommendations) */}
        {anime.recommendations && anime.recommendations.length > 0 && (
          <div className="mt-12">
            <AnimeRow 
              title={lang === 'bn' ? 'আপনার আরও ভালো লাগতে পারে' : 'You May Also Like'} 
              icon={Sparkles} 
              animeList={anime.recommendations} 
              onOpenDownload={onOpenDownload}
            />
          </div>
        )}

      </div>

      {/* Trailer Modal Popup */}
      {trailerModalUrl && (
        <div className="modal-overlay" onClick={() => setTrailerModalUrl(null)}>
          <div className="trailer-modal-container glass-dropdown" onClick={e => e.stopPropagation()}>
            <div className="trailer-modal-header">
              <span className="trailer-title">{anime.title} — Official Trailer</span>
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

    </div>
  );
};
