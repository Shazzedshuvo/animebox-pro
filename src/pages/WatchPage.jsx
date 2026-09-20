// src/pages/WatchPage.jsx - Premium Cinema Watch Experience with MovieBox Streaming Architecture
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Share2, Download, Heart, 
  Check, Star, ShieldCheck, Film, AlertTriangle, Sparkles, ExternalLink,
  Moon, Sun, Tv, Play, Volume2, Globe, Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { useToast } from '../context/ToastContext';
import { useAnimeDetailsQuery } from '../hooks/useAnimeQuery';
import { SERVERS } from '../services/streamingService';
import { getDirectWatchUrls } from '../api/consumetApi';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { ServerSwitcher } from '../components/player/ServerSwitcher';
import { SubtitleSettings } from '../components/player/SubtitleSettings';
import { EpisodeSelector } from '../components/player/EpisodeSelector';
import { Loader } from '../components/common/Loader';

export const WatchPage = ({ onOpenDownload }) => {
  const { id, episode = "1" } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { updateProgress } = useWatchHistory();
  const { showSuccess, showInfo } = useToast();

  const episodeNumber = parseInt(episode, 10) || 1;
  const { data: anime, isLoading } = useAnimeDetailsQuery(id);

  const [activeServer, setActiveServer] = useState("vidsrc_in");
  const [selectedAudio, setSelectedAudio] = useState("sub"); // 'sub' | 'hindi' | 'dub' | 'ben'
  const [isServerLoading, setIsServerLoading] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState("off");
  const [subtitleSize, setSubtitleSize] = useState("medium");
  const [subtitleBg, setSubtitleBg] = useState("rgba(0, 0, 0, 0.75)");
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Audio Switcher Handler
  const handleAudioChange = (audioKey) => {
    setSelectedAudio(audioKey);
    if (audioKey === 'hindi' || audioKey === 'ben') {
      setActiveServer('aw-stream');
      showInfo(lang === 'bn' ? 'হিন্দি ও বাংলা ডাব স্ট্রিমে সুইচ করা হয়েছে' : 'Switched to Hindi & Bengali Dub Stream');
    } else if (audioKey === 'dub') {
      setActiveServer('vidsrc_to');
      showInfo(lang === 'bn' ? 'ইংলিশ ডাব স্ট্রিমে সুইচ করা হয়েছে' : 'Switched to English Dub Stream');
    } else {
      setActiveServer('vidsrc_in');
      showInfo(lang === 'bn' ? 'অরিজিনাল জাপানি সাব স্ট্রিমে সুইচ করা হয়েছে' : 'Switched to Japanese Sub Stream');
    }
  };

  // Handle server switching
  const handleServerChange = (serverId) => {
    if (serverId !== activeServer) {
      setIsServerLoading(true);
      setActiveServer(serverId);
      const serverObj = SERVERS.find(s => s.id === serverId);
      const sName = lang === 'bn' ? serverObj?.banglaName : serverObj?.name;
      showInfo(`${t('toastServerSwitched')} ${sName}`);
      setTimeout(() => {
        setIsServerLoading(false);
      }, 400);
    }
  };

  const episodesList = anime?.episodes || [];
  const totalEpisodes = episodesList.length || anime?.totalEpisodes || 12;
  const currentEpData = episodesList.find(e => e.episodeNumber === episodeNumber) || {
    episodeNumber,
    title: `Episode ${episodeNumber}`,
    banglaTitle: `এপিসোড ${episodeNumber}`
  };

  const directWatchLinks = useMemo(() => {
    return getDirectWatchUrls(anime?.title || 'Anime', episodeNumber, anime?.id || 20);
  }, [anime, episodeNumber]);

  const hasPrev = episodeNumber > 1;
  const hasNext = episodeNumber < totalEpisodes;

  const handlePrevEpisode = useCallback(() => {
    if (hasPrev) {
      navigate(`/watch/${id}/${episodeNumber - 1}`);
    }
  }, [hasPrev, id, episodeNumber, navigate]);

  const handleNextEpisode = useCallback(() => {
    if (hasNext) {
      navigate(`/watch/${id}/${episodeNumber + 1}`);
    }
  }, [hasNext, id, episodeNumber, navigate]);

  // Keyboard Shortcuts (T: Theater, N: Next, P: Prev)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 't' || e.key === 'T') {
        setIsTheaterMode(prev => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        if (hasNext) handleNextEpisode();
      } else if (e.key === 'p' || e.key === 'P') {
        if (hasPrev) handlePrevEpisode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNext, hasPrev, handleNextEpisode, handlePrevEpisode]);

  const handleProgressUpdate = useCallback((currentTime, duration) => {
    if (currentTime > 2 && duration > 0 && anime) {
      updateProgress({
        animeId: anime.id,
        episodeNumber,
        animeTitle: anime.title,
        banglaTitle: anime.banglaTitle,
        posterImage: anime.posterImage,
        progress: currentTime,
        duration: duration
      });
    }
  }, [anime, episodeNumber, updateProgress]);

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showSuccess(t('toastLinkCopied'));
      }
    } catch {
      showSuccess(t('toastLinkCopied'));
    }
  };

  if (isLoading || !anime) {
    return (
      <div className="container mt-12 py-16 text-center">
        <Loader message={lang === 'bn' ? 'মুভিবক্স এনিমে স্ট্রিম ও এপিসোড লোড হচ্ছে...' : 'Loading MovieBox Anime Stream & Episodes...'} />
      </div>
    );
  }

  const isFav = isFavorite(anime.id);
  const officialStreams = anime.officialStreams || [];

  return (
    <div className={`watch-page-root ${isTheaterMode ? 'theater-mode-on' : ''}`}>
      {/* Theater Dimmer Overlay */}
      {isTheaterMode && (
        <div 
          className="theater-backdrop-dimmer" 
          onClick={() => setIsTheaterMode(false)}
          title="Click to exit theater mode"
        />
      )}
      
      {/* Top Bar */}
      <div className="watch-top-bar container">
        <Link to={`/anime/${anime.id}`} className="back-to-anime-btn">
          <ChevronLeft size={20} />
          <span>{lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title}</span>
        </Link>

        <div className="watch-top-actions">
          {/* Theater Toggle Button */}
          <button 
            className={`btn-icon-small ${isTheaterMode ? 'active text-gold' : ''}`}
            onClick={() => setIsTheaterMode(prev => !prev)}
            title={isTheaterMode ? "Exit Theater Mode (T)" : "Theater Mode (T)"}
          >
            {isTheaterMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="btn-icon-small" 
            onClick={() => {
              const added = toggleFavorite(anime.id);
              showSuccess(added ? t('toastAddedToList') : t('toastRemovedFromList'));
            }}
            title={isFav ? t('inList') : t('addToList')}
          >
            <Heart size={18} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-crimson" : ""} />
          </button>

          <button 
            className="btn-icon-small" 
            onClick={() => onOpenDownload && onOpenDownload(anime, episodeNumber)}
            title={t('download')}
          >
            <Download size={18} />
          </button>

          <button className="btn-icon-small" onClick={handleShare} title={t('share')}>
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Watch Layout Container */}
      <div className="container watch-main-layout">
        
        {/* Left Column: Player + Controls + Details */}
        <div className="watch-player-column">
          
          {/* Audio Language Switcher Bar on Top of Player */}
          <div className="audio-language-bar glass-panel">
            <div className="audio-bar-label">
              <Volume2 size={16} className="text-crimson" />
              <span>{lang === 'bn' ? 'অডিও ভাষা:' : 'Audio Language:'}</span>
            </div>

            <div className="audio-pills-row">
              <button 
                className={`audio-pill ${selectedAudio === 'sub' ? 'active' : ''}`}
                onClick={() => handleAudioChange('sub')}
              >
                <span className="pill-flag">🇯🇵</span>
                <span>{lang === 'bn' ? 'জাপানি সাব' : 'Japanese Sub'}</span>
              </button>

              <button 
                className={`audio-pill ${selectedAudio === 'hindi' ? 'active' : ''}`}
                onClick={() => handleAudioChange('hindi')}
              >
                <span className="pill-flag">🇮🇳</span>
                <span>{lang === 'bn' ? 'হিন্দি ডাব (Hindi Dub)' : 'Hindi Dub'}</span>
              </button>

              <button 
                className={`audio-pill ${selectedAudio === 'dub' ? 'active' : ''}`}
                onClick={() => handleAudioChange('dub')}
              >
                <span className="pill-flag">🇺🇸</span>
                <span>{lang === 'bn' ? 'ইংলিশ ডাব' : 'English Dub'}</span>
              </button>

              <button 
                className={`audio-pill ${selectedAudio === 'ben' ? 'active' : ''}`}
                onClick={() => handleAudioChange('ben')}
              >
                <span className="pill-flag">🇧🇩</span>
                <span>{lang === 'bn' ? 'বাংলা ডাব' : 'Bengali Dub'}</span>
              </button>
            </div>
          </div>

          {/* Full Size 16:9 Cinema Video Player Box */}
          <div className="player-aspect-box">
            <VideoPlayer
              key={`${anime.id}_${episodeNumber}_${activeServer}_${selectedAudio}`}
              anime={anime}
              episodeNumber={episodeNumber}
              activeServer={activeServer}
              selectedAudio={selectedAudio}
              isServerLoading={isServerLoading}
              isTheaterMode={isTheaterMode}
              onToggleTheater={() => setIsTheaterMode(prev => !prev)}
              onPrevEpisode={hasPrev ? handlePrevEpisode : null}
              onNextEpisode={hasNext ? handleNextEpisode : null}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          {/* Episode Quick Switcher & Title Bar */}
          <div className="watch-episode-controls-bar glass-panel">
            <div className="current-ep-info-badge">
              <span className="ep-tag-text">{t('watchingEpisode')} {episodeNumber}</span>
              <span className="ep-of-total">/ {totalEpisodes}</span>
              <span className="ep-title-truncate" title={currentEpData.title}>
                — {currentEpData.title}
              </span>
            </div>

            <div className="ep-nav-btns">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handlePrevEpisode}
                disabled={!hasPrev}
                title="Previous Episode (P)"
              >
                <ChevronLeft size={16} />
                <span>{t('prevEpisode')}</span>
              </button>

              <button 
                className="btn btn-primary btn-sm"
                onClick={handleNextEpisode}
                disabled={!hasNext}
                title="Next Episode (N)"
              >
                <span>{t('nextEpisode')}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Direct Streaming & Dub Hub Strip */}
          <div className="player-direct-links-strip glass-panel">
            <div className="direct-links-title">
              <Zap size={15} className="text-gold" />
              <span>{lang === 'bn' ? 'ফুল এপিসোড স্ট্রিমিং ও ডাব হাব:' : 'Full Episode Streaming Hub:'}</span>
            </div>
            <div className="direct-links-group">
              {directWatchLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direct-hub-chip"
                  style={{ '--chip-color': link.color }}
                >
                  <span>{link.name}</span>
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Server & Subtitle Tuners Grid */}
          <div className="watch-tuners-grid">
            <ServerSwitcher 
              activeServer={activeServer}
              onServerChange={handleServerChange}
            />

            <SubtitleSettings 
              selectedSubtitle={selectedSubtitle}
              onSubtitleChange={setSelectedSubtitle}
              subtitleSize={subtitleSize}
              onSizeChange={setSubtitleSize}
              subtitleBg={subtitleBg}
              onBgChange={setSubtitleBg}
            />
          </div>

          {/* Episode Meta Info Card */}
          <div className="watch-anime-info-card glass-panel">
            <div className="watch-info-header">
              <div>
                <h2 className="watch-anime-title">
                  {lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title}
                </h2>
                <h3 className="watch-episode-subtitle">
                  {lang === 'bn' ? `এপিসোড ${episodeNumber}: ${currentEpData.banglaTitle || currentEpData.title}` : `Episode ${episodeNumber}: ${currentEpData.title}`}
                </h3>
              </div>
              
              <div className="watch-meta-badges">
                <span className="badge badge-rating">
                  <Star size={12} fill="currentColor" /> {anime.rating}
                </span>
                <span className="badge badge-year">{anime.releaseYear}</span>
                <span className="badge badge-type">{anime.format || anime.type}</span>
              </div>
            </div>

            <p className="watch-synopsis-snippet">
              {lang === 'bn' ? (anime.banglaDescription || anime.description) : anime.description}
            </p>

            <div className="watch-tags-row">
              {anime.genres?.map(g => (
                <span key={g} className="genre-pill-subtle">{g}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Episode Selector Sidebar */}
        <div className="watch-sidebar-column">
          <EpisodeSelector 
            anime={anime}
            currentEpisode={episodeNumber}
            onOpenDownload={onOpenDownload}
          />
        </div>

      </div>
    </div>
  );
};
