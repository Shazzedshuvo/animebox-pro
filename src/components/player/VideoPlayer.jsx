// src/components/player/VideoPlayer.jsx - Ultimate Cinema Video Player Engine
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Maximize, Minimize, RotateCcw, Zap, ExternalLink, 
  ShieldCheck, Loader2, Sparkles, Moon, Sun, AlertTriangle, Play, RefreshCw, Film
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getStreamUrlForEpisode, SERVERS } from '../../services/streamingService';
import { getDirectWatchUrls } from '../../api/consumetApi';
import { getAnimeWorldEpisodeUrl } from '../../services/animeWorldService';

export const VideoPlayer = ({
  anime,
  episodeNumber = 1,
  activeServer = 'official-pv',
  isServerLoading = false,
  isTheaterMode = false,
  onToggleTheater,
  onEpisodeEnd,
  onNextEpisode,
  onPrevEpisode,
  onProgressUpdate
}) => {
  const { lang, t } = useLanguage();
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const malId = anime?.malId || anime?.id || 20;
  const animeId = anime?.id || malId;
  const animeTitle = anime?.title || 'Anime';
  const epNum = Number(episodeNumber) || 1;

  const currentEpData = anime?.episodes?.find(e => e.episodeNumber === epNum) || {
    episodeNumber: epNum,
    title: `Episode ${epNum}`
  };

  // Get active stream URL
  const streamEmbedUrl = useMemo(() => {
    return getStreamUrlForEpisode(malId, epNum, activeServer, animeTitle, 1, anime);
  }, [malId, epNum, activeServer, animeTitle, anime, reloadKey]);

  // Current Server metadata
  const currentServerObj = useMemo(() => {
    return SERVERS.find(s => s.id === activeServer) || SERVERS[0];
  }, [activeServer]);

  // Direct watch links for 1-click fallback
  const directWatchLinks = useMemo(() => {
    return getDirectWatchUrls(animeTitle, epNum, malId);
  }, [animeTitle, epNum, malId]);

  // Handle server reload
  const handleReloadServer = () => {
    setIsIframeLoading(true);
    setReloadKey(prev => prev + 1);
  };

  // Reset loading state when episode or server changes
  useEffect(() => {
    setIsIframeLoading(true);
    const timer = setTimeout(() => {
      setIsIframeLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [streamEmbedUrl, epNum, activeServer]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const el = document.getElementById('anime-player-wrapper');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="player-outer-wrapper">
      <div 
        id="anime-player-wrapper"
        className={`video-player-container ${isFullscreen ? 'fullscreen' : ''} ${isTheaterMode ? 'theater-active' : ''}`}
      >
        {/* Ambient Cinema Backdrop Glow */}
        <div 
          className="player-ambient-glow"
          style={{
            backgroundImage: `url(${anime?.bannerImage || anime?.posterImage})`
          }}
        />

        {/* Loading Overlay */}
        {(isServerLoading || isIframeLoading) && (
          <div className="player-loading-overlay">
            <div className="player-loader-box">
              <Loader2 size={42} className="animate-spin text-crimson" />
              <div className="player-loader-text-group">
                <span className="player-loading-text">
                  {lang === 'bn' 
                    ? `এপিসোড ${epNum} লোড হচ্ছে...` 
                    : `Loading Episode ${epNum} Stream...`}
                </span>
                <span className="player-server-subtext">
                  {lang === 'bn' ? currentServerObj.banglaName : currentServerObj.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Dynamic Real Episode Video Embed */}
        <div className="official-video-wrapper">
          <iframe
            key={`${activeServer}_${animeId}_${epNum}_${reloadKey}`}
            src={streamEmbedUrl}
            title={`${animeTitle} - Episode ${epNum}`}
            className="video-element-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onLoad={() => setIsIframeLoading(false)}
          />
        </div>

        {/* Floating Cinema Controls Bar on Top Right */}
        <div className="player-top-floating-bar">
          <div className="player-top-meta-badge">
            <span className="ep-live-pill">EP {epNum}</span>
            <span className="server-live-pill">{currentServerObj.badge}</span>
            <span className="ep-live-title">{currentEpData.title}</span>
          </div>

          <div className="player-top-actions-group">
            {/* Direct Full Episode Stream Action Button */}
            <a
              href={getAnimeWorldEpisodeUrl(animeTitle, epNum)}
              target="_blank"
              rel="noopener noreferrer"
              className="mode-btn anime-world-link-btn"
              title="Watch Full Episode on AnimeWorld (Hindi/English/Bengali Dub)"
            >
              <Zap size={13} className="text-gold" />
              <span>{lang === 'bn' ? 'ফুল এপিসোড দেখুন' : 'Watch Full Ep'}</span>
              <ExternalLink size={12} />
            </a>

            {/* Reload Server */}
            <button 
              className="ctrl-btn-top"
              onClick={handleReloadServer}
              title={lang === 'bn' ? 'সার্ভার রিফ্রেশ করুন' : 'Reload Stream'}
            >
              <RotateCcw size={15} />
            </button>

            {/* Theater Mode Button */}
            {onToggleTheater && (
              <button 
                className={`ctrl-btn-top ${isTheaterMode ? 'active text-gold' : ''}`}
                onClick={onToggleTheater}
                title={isTheaterMode 
                  ? (lang === 'bn' ? 'থিয়েটার মোড বন্ধ করুন' : 'Exit Theater Mode (T)')
                  : (lang === 'bn' ? 'থিয়েটার মোড চালু করুন' : 'Theater Mode (T)')}
              >
                {isTheaterMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Fullscreen Button */}
            <button 
              className="ctrl-btn-top"
              onClick={toggleFullscreen}
              title={isFullscreen 
                ? (lang === 'bn' ? 'ফুলস্ক্রিন বন্ধ (F)' : 'Exit Fullscreen (F)') 
                : (lang === 'bn' ? 'ফুলস্ক্রিন (F)' : 'Fullscreen (F)')}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>

      </div>

      {/* Direct Streaming Hub Bar Below Player */}
      <div className="player-direct-links-strip glass-panel">
        <div className="direct-links-title">
          <Zap size={14} className="text-gold" />
          <span>{lang === 'bn' ? 'সরাসরি ফুল এপিসোড স্ট্রিমিং ও ডাব হাব:' : 'Full Episode Streaming Hub:'}</span>
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
    </div>
  );
};
