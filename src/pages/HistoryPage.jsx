// src/pages/HistoryPage.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { History, Trash2, Play, Compass, Clock, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { useToast } from '../context/ToastContext';

export const HistoryPage = () => {
  const { lang, t } = useLanguage();
  const { history, removeFromHistory, clearHistory } = useWatchHistory();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleClear = () => {
    if (window.confirm(t('confirmClearHistory'))) {
      clearHistory();
      showSuccess(t('historyCleared'));
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="catalog-page-root container">
      {/* Header */}
      <div className="page-header-block">
        <div className="page-title-badge">
          <History size={20} className="page-title-icon" />
          <h1 className="page-main-title">{t('history')}</h1>
        </div>

        {history.length > 0 && (
          <button className="btn btn-secondary clear-history-btn" onClick={handleClear}>
            <Trash2 size={16} />
            <span>{t('clearHistory')}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state-box glass-panel">
          <div className="empty-icon-circle">
            <Clock size={42} />
          </div>
          <h3 className="empty-title">{t('noHistory')}</h3>
          <p className="empty-subtitle">{t('noHistorySub')}</p>
          <Link to="/" className="btn btn-primary mt-4">
            <Compass size={18} />
            <span>{t('exploreCatalog')}</span>
          </Link>
        </div>
      ) : (
        <div className="history-cards-grid mt-6">
          {history.map(item => (
            <div 
              key={`${item.animeId}_${item.episodeNumber}`}
              className="history-item-card glass-panel"
            >
              <div 
                className="history-poster-wrap"
                onClick={() => navigate(`/watch/${item.animeId}/${item.episodeNumber}`)}
              >
                <img src={item.posterImage} alt="" className="history-poster-img" />
                <div className="history-play-overlay">
                  <Play size={24} fill="currentColor" />
                </div>
                <div className="history-progress-track">
                  <div className="history-progress-fill" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>

              <div className="history-info-col">
                <div className="history-top-line">
                  <h3 className="history-title" onClick={() => navigate(`/anime/${item.animeId}`)}>
                    {lang === 'bn' ? item.banglaTitle : item.animeTitle}
                  </h3>
                  <button 
                    className="btn-icon-small"
                    onClick={() => removeFromHistory(item.animeId, item.episodeNumber)}
                    title={t('remove')}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="history-meta-line">
                  <span className="history-ep-pill">EP {item.episodeNumber}</span>
                  <span className="history-pct">{item.percentage}% {t('watched')}</span>
                </div>

                <span className="history-timestamp">
                  <Clock size={12} /> {formatDate(item.lastWatched)}
                </span>

                <div className="history-actions-row">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/watch/${item.animeId}/${item.episodeNumber}`)}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>{t('resume')}</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(`/anime/${item.animeId}`)}
                  >
                    <span>{t('details')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
