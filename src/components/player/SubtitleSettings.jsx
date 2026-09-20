// src/components/player/SubtitleSettings.jsx
import React from 'react';
import { MessageSquare, Sliders, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { SUBTITLES_TRACKS } from '../../services/streamingService';

export const SubtitleSettings = ({ 
  selectedSubtitle, 
  onSubtitleChange, 
  subtitleSize, 
  onSizeChange,
  subtitleBg,
  onBgChange 
}) => {
  const { lang, t } = useLanguage();
  const { showInfo } = useToast();

  const handleTrackChange = (track) => {
    onSubtitleChange(track.id);
    showInfo(`${t('toastSubtitleChanged')} ${lang === 'bn' ? track.banglaLabel : track.label}`);
  };

  return (
    <div className="subtitle-settings-card glass-panel">
      <div className="subtitle-header">
        <MessageSquare size={18} className="sub-icon" />
        <span className="subtitle-title">{t('subtitles')}</span>
      </div>

      {/* Language Tracks */}
      <div className="subtitle-tracks-row">
        {SUBTITLES_TRACKS.map(track => (
          <button
            key={track.id}
            className={`sub-track-btn ${selectedSubtitle === track.id ? 'active' : ''}`}
            onClick={() => handleTrackChange(track)}
          >
            {track.flag && <span className="track-flag">{track.flag}</span>}
            <span>{lang === 'bn' ? track.banglaLabel : track.label}</span>
            {selectedSubtitle === track.id && <Check size={14} className="sub-check" />}
          </button>
        ))}
      </div>

      {/* Fine-Tuning Controls */}
      {selectedSubtitle !== "off" && (
        <div className="subtitle-tuning-grid">
          
          {/* Font Size */}
          <div className="tuning-item">
            <span className="tuning-label">{t('subtitleSize')}</span>
            <div className="tuning-pills">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  className={`tuning-pill ${subtitleSize === size ? 'active' : ''}`}
                  onClick={() => onSizeChange(size)}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Background Opacity */}
          <div className="tuning-item">
            <span className="tuning-label">{t('subtitleBg')}</span>
            <div className="tuning-pills">
              {[
                { label: 'Dark', val: 'rgba(0, 0, 0, 0.85)' },
                { label: 'Medium', val: 'rgba(0, 0, 0, 0.60)' },
                { label: 'Transparent', val: 'transparent' }
              ].map(bg => (
                <button
                  key={bg.label}
                  className={`tuning-pill ${subtitleBg === bg.val ? 'active' : ''}`}
                  onClick={() => onBgChange(bg.val)}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
