// src/components/player/VideoPlayer.jsx - Ultimate Cinema Video Player Engine
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Maximize, Minimize, RotateCcw, Zap, ExternalLink, 
  ShieldCheck, Loader2, Sparkles, Moon, Sun, AlertTriangle, Play, RefreshCw, Volume2, Globe
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getStreamUrlForEpisode, SERVERS } from '../../services/streamingService';
import { getDirectWatchUrls } from '../../api/consumetApi';
import { getAnimeWorldEpisodeUrl } from '../../services/animeWorldService';

export const VideoPlayer = ({
  anime,
  episodeNumber = 1,
  activeServer = 'vidsrc_in',
  selectedAudio = 'sub', // 'sub' | 'hindi' | 'dub' | 'ben'
  onAudioChange,
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

  // Determine server based on selected audio if user clicks audio pill
  const effectiveServer = useMemo(() => {
    if (selectedAudio === 'hindi' || selectedAudio === 'ben') {
      return 'aw-stream'; // AnimeWorld Hindi & Bengali Dub
    }
    if (selectedAudio === 'dub') {
      return 'vidsrc_to'; // VidSrc Dual Audio / English Dub
    }
    return activeServer;
  }, [selectedAudio, activeServer]);

  // Get active stream URL
  const streamEmbedUrl = useMemo(() => {
    return getStreamUrlForEpisode(malId, epNum, effectiveServer, animeTitle, 1, anime);
  }, [malId, epNum, effectiveServer, animeTitle, anime, reloadKey]);

  // Current Server metadata
  const currentServerObj = useMemo(() => {
    return SERVERS.find(s => s.id === effectiveServer) || SERVERS[0];
  }, [effectiveServer]);

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
  }, [streamEmbedUrl, epNum, effectiveServer]);

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
            <Loader2 size={44} className="animate-spin text-crimson" />
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
          key={`${effectiveServer}_${animeId}_${epNum}_${reloadKey}`}
          src={streamEmbedUrl}
          title={`${animeTitle} - Episode ${epNum}`}
          className="video-element-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>

      {/* Floating Cinema Header Bar */}
      <div className="player-top-floating-bar">
        <div className="player-top-meta-badge">
          <span className="ep-live-pill">EP {epNum}</span>
          <span className="server-live-pill">{currentServerObj.badge}</span>
          <span className="ep-live-title">{currentEpData.title}</span>
        </div>

        <div className="player-top-actions-group">
          {/* Direct Hindi Dub Watch Button */}
          <a
            href={getAnimeWorldEpisodeUrl(animeTitle, epNum)}
            target="_blank"
            rel="noopener noreferrer"
            className="mode-btn anime-world-link-btn"
            title="Watch Hindi & Bengali Dubbed on AnimeWorld"
          >
            <Volume2 size={13} className="text-gold" />
            <span>{lang === 'bn' ? 'হিন্দি ডাব দেখুন' : 'Hindi Dub'}</span>
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
  );
};
