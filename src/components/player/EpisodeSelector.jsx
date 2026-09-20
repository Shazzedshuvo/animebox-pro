// src/components/player/EpisodeSelector.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Download, Search, LayoutGrid, List, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWatchHistory } from '../../context/WatchHistoryContext';

export const EpisodeSelector = ({ anime, currentEpisode = 1, onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const { getProgress } = useWatchHistory();
  const navigate = useNavigate();
  const activeEpRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);

  const episodes = useMemo(() => {
    return Array.isArray(anime?.episodes) && anime.episodes.length > 0 
      ? anime.episodes 
      : [{ episodeNumber: 1, title: 'Episode 1', banglaTitle: 'এপিসোড ১', thumbnail: anime?.bannerImage || anime?.posterImage, duration: '24m' }];
  }, [anime]);

  const CHUNK_SIZE = 50;
  const totalRanges = Math.ceil(episodes.length / CHUNK_SIZE);

  // Determine active range based on currentEpisode on initial load
  useEffect(() => {
    const curNum = Number(currentEpisode) || 1;
    const rangeIdx = Math.floor((curNum - 1) / CHUNK_SIZE);
    setActiveRangeIndex(Math.max(0, Math.min(rangeIdx, totalRanges - 1)));
  }, [currentEpisode, totalRanges]);

  // Filter episodes by search or active range
  const filteredEpisodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return episodes.filter(ep => 
        String(ep.episodeNumber).includes(q) ||
        (ep.title && ep.title.toLowerCase().includes(q)) ||
        (ep.banglaTitle && ep.banglaTitle.toLowerCase().includes(q))
      );
    }
    const start = activeRangeIndex * CHUNK_SIZE;
    return episodes.slice(start, start + CHUNK_SIZE);
  }, [episodes, searchQuery, activeRangeIndex]);

  // Scroll active episode into view on mount
  useEffect(() => {
    if (activeEpRef.current) {
      activeEpRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentEpisode, viewMode]);

  return (
    <div className="episode-selector-card glass-panel">
      
      {/* Header & Controls */}
      <div className="episode-header-row">
        <div className="episode-title-wrap">
          <h3 className="episode-main-title">{t('episodes')}</h3>
          <span className="episode-count-tag">{episodes.length}</span>
        </div>

        <div className="episode-actions-right">
          {/* Search Episode */}
          <div className="ep-search-wrap">
            <Search size={14} className="ep-search-icon" />
            <input
              type="text"
              className="ep-search-input"
              placeholder={lang === 'bn' ? "নম্বর / নাম..." : "Ep # or title..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Range Tabs (if anime has > 50 episodes, like One Piece or Naruto) */}
      {!searchQuery && totalRanges > 1 && (
        <div className="episode-range-tabs">
          {Array.from({ length: totalRanges }).map((_, idx) => {
            const start = idx * CHUNK_SIZE + 1;
            const end = Math.min((idx + 1) * CHUNK_SIZE, episodes.length);
            const isTabActive = idx === activeRangeIndex;
            return (
              <button
                key={idx}
                className={`range-tab-btn ${isTabActive ? 'active' : ''}`}
                onClick={() => setActiveRangeIndex(idx)}
              >
                {start} - {end}
              </button>
            );
          })}
        </div>
      )}

      {/* Episodes List View */}
      {viewMode === 'list' ? (
        <div className="episodes-list-scroll custom-scrollbar">
          {filteredEpisodes.length === 0 ? (
            <div className="p-4 text-center text-muted">
              {lang === 'bn' ? 'কোনো এপিসোড পাওয়া যায়নি' : 'No episodes found'}
            </div>
          ) : (
            filteredEpisodes.map(ep => {
              const isActive = ep.episodeNumber === Number(currentEpisode);
              const progressInfo = getProgress(anime.id, ep.episodeNumber);
              const isCompleted = progressInfo && progressInfo.percentage >= 90;

              return (
                <div 
                  key={ep.episodeNumber}
                  ref={isActive ? activeEpRef : null}
                  className={`episode-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(`/watch/${anime.id}/${ep.episodeNumber}`)}
                >
                  {/* Ep Thumbnail */}
                  <div className="ep-thumb-wrap">
                    <img 
                      src={ep.thumbnail || anime.bannerImage || anime.posterImage} 
                      alt="" 
                      className="ep-thumb-img" 
                      onError={(e) => {
                        e.target.src = anime.posterImage;
                      }}
                    />
                    <div className="ep-thumb-overlay">
                      <Play size={16} fill="currentColor" />
                    </div>
                    {progressInfo && progressInfo.percentage > 0 && (
                      <div className="ep-progress-bar-wrap">
                        <div 
                          className="ep-progress-fill" 
                          style={{ width: `${progressInfo.percentage}%` }} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Ep Info */}
                  <div className="ep-info-wrap">
                    <div className="ep-title-line">
                      <span className="ep-num-pill">EP {ep.episodeNumber}</span>
                      <h4 className="ep-name" title={ep.title}>
                        {ep.title}
                      </h4>
                    </div>
                    
                    <div className="ep-meta-subline">
                      <span className="ep-duration">{ep.duration || '24m'}</span>
                      {ep.aired && (
                        <span className="ep-air-date">
                          <Calendar size={11} /> {ep.aired}
                        </span>
                      )}
                      {ep.isFiller && (
                        <span className="badge-filler">Filler</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ep-right-actions" onClick={e => e.stopPropagation()}>
                    {isCompleted && (
                      <span className="ep-watched-tag" title={t('watched')}>
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                    <button 
                      className="btn-icon-small"
                      onClick={() => onOpenDownload && onOpenDownload(anime, ep.episodeNumber)}
                      title={t('download')}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Episodes Grid View */
        <div className="episodes-grid-view custom-scrollbar">
          {filteredEpisodes.map(ep => {
            const isActive = ep.episodeNumber === Number(currentEpisode);
            return (
              <button
                key={ep.episodeNumber}
                ref={isActive ? activeEpRef : null}
                className={`ep-grid-btn ${isActive ? 'active' : ''}`}
                onClick={() => navigate(`/watch/${anime.id}/${ep.episodeNumber}`)}
                title={ep.title}
              >
                <span>{ep.episodeNumber}</span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

