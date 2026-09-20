// src/components/anime/DownloadModal.jsx
import React, { useState } from 'react';
import { Download, X, Check, HardDrive, ShieldCheck, Film, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { generateDownloadInfo } from '../../services/streamingService';

export const DownloadModal = ({ anime, initialEpisode = 1, isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const { showSuccess } = useToast();

  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [selectedAudio, setSelectedAudio] = useState("Hindi Dub");
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (!isOpen || !anime) return null;

  const downloadInfo = generateDownloadInfo(anime.title, selectedEpisode, selectedQuality, selectedAudio);

  const startDownloadSimulation = () => {
    setIsDownloading(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          showSuccess(`${t('toastDownloadStarted')} (${downloadInfo.fileName})`);
          
          // Trigger safe demo blob file download
          try {
            const blob = new Blob([`ANIMEBOX Offline Demo File: ${anime.title} Episode ${selectedEpisode} (${selectedQuality} ${selectedAudio})`], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = downloadInfo.fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error(err);
          }

          onClose();
          return 100;
        }
        return prev + 20;
      });
    }, 350);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="download-modal-card glass-dropdown" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="download-modal-header">
          <div className="download-header-info">
            <div className="modal-icon-badge">
              <Download size={20} />
            </div>
            <div>
              <h3 className="download-modal-title">{t('downloadTitle')}</h3>
              <p className="download-modal-sub">{lang === 'bn' ? anime.banglaTitle : anime.title}</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="download-modal-body">
          
          {/* Episode Selection (if TV series) */}
          {anime.type !== "Movie" && anime.episodes?.length > 1 && (
            <div className="download-option-group">
              <label className="option-label">{t('episode')}</label>
              <select 
                className="filter-select-input w-full"
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
              >
                {anime.episodes.map(ep => (
                  <option key={ep.episodeNumber} value={ep.episodeNumber}>
                    {lang === 'bn' ? ep.banglaTitle : ep.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quality Options */}
          <div className="download-option-group">
            <label className="option-label">{t('selectQuality')}</label>
            <div className="quality-cards-grid">
              
              <div 
                className={`quality-choice-card ${selectedQuality === '1080p' ? 'active' : ''}`}
                onClick={() => setSelectedQuality('1080p')}
              >
                <div className="quality-badge-pill">FHD</div>
                <div className="quality-details">
                  <span className="quality-name">1080p Full HD</span>
                  <span className="quality-size">~850 MB</span>
                </div>
                {selectedQuality === '1080p' && <Check size={16} className="quality-check" />}
              </div>

              <div 
                className={`quality-choice-card ${selectedQuality === '720p' ? 'active' : ''}`}
                onClick={() => setSelectedQuality('720p')}
              >
                <div className="quality-badge-pill">HD</div>
                <div className="quality-details">
                  <span className="quality-name">720p High Def</span>
                  <span className="quality-size">~480 MB</span>
                </div>
                {selectedQuality === '720p' && <Check size={16} className="quality-check" />}
              </div>

              <div 
                className={`quality-choice-card ${selectedQuality === '480p' ? 'active' : ''}`}
                onClick={() => setSelectedQuality('480p')}
              >
                <div className="quality-badge-pill">SD</div>
                <div className="quality-details">
                  <span className="quality-name">480p Standard</span>
                  <span className="quality-size">~240 MB</span>
                </div>
                {selectedQuality === '480p' && <Check size={16} className="quality-check" />}
              </div>

            </div>
          </div>

          {/* Audio Track Selector */}
          <div className="download-option-group">
            <label className="option-label">{t('selectAudioTrack')}</label>
            <div className="audio-choice-row">
              {["Hindi Dub", "English Dub", "Japanese Sub"].map(audio => (
                <button
                  key={audio}
                  className={`audio-choice-btn ${selectedAudio === audio ? 'active' : ''}`}
                  onClick={() => setSelectedAudio(audio)}
                >
                  {audio}
                </button>
              ))}
            </div>
          </div>

          {/* Download Summary Box */}
          <div className="download-summary-box">
            <div className="summary-line">
              <span className="summary-label">{t('fileSize')}:</span>
              <span className="summary-val">{downloadInfo.fileSize}</span>
            </div>
            <div className="summary-line">
              <span className="summary-label">Format:</span>
              <span className="summary-val">MP4 (H.264 / AAC)</span>
            </div>
            <p className="download-demo-notice">
              <ShieldCheck size={14} />
              {t('downloadNote')}
            </p>
          </div>

          {/* Progress Bar during download */}
          {isDownloading && (
            <div className="download-progress-section">
              <div className="progress-info-row">
                <span>{t('downloading')}</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="download-progress-track">
                <div 
                  className="download-progress-fill" 
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="download-modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isDownloading}>
            {t('cancel')}
          </button>
          <button 
            className="btn btn-primary"
            onClick={startDownloadSimulation}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t('downloading')}</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>{t('startDownload')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
