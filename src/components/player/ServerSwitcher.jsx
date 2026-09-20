// src/components/player/ServerSwitcher.jsx - MovieBox Multi-Server Selector
import React from 'react';
import { Server, Zap, Check, Radio, Globe, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { SERVERS } from '../../services/streamingService';

export const ServerSwitcher = ({ activeServer = 'vidcloud', onServerChange }) => {
  const { lang, t } = useLanguage();
  const { showSuccess } = useToast();

  const handleSelect = (server) => {
    if (server.id !== activeServer) {
      onServerChange(server.id);
      showSuccess(`${t('toastServerSwitched')} ${lang === 'bn' ? server.banglaName : server.name}`);
    }
  };

  return (
    <div className="server-switcher-card glass-panel">
      <div className="server-header">
        <div className="server-header-left">
          <Server size={18} className="server-icon text-crimson" />
          <span className="server-title">{t('server')} — MovieBox High-Speed CDN</span>
        </div>
        <span className="server-status-pill">
          <span className="status-dot-online" />
          5 Servers Online
        </span>
      </div>

      <div className="server-buttons-grid">
        {SERVERS.map(server => {
          const isActive = activeServer === server.id;
          return (
            <button
              key={server.id}
              className={`server-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(server)}
            >
              <div className="server-btn-main">
                <span className="server-name">
                  {lang === 'bn' ? server.banglaName : server.name}
                </span>
                <span className="server-audio-tag">{server.audio}</span>
              </div>
              <div className="server-btn-sub">
                <span className="server-speed-tag">{server.badge}</span>
                {isActive && <Check size={16} className="server-check-icon text-emerald-400" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="server-footer-notes">
        <p className="server-note">
          <Sparkles size={14} className="text-gold" />
          <span>
            {lang === 'bn' 
              ? 'সার্ভার ১ ও ২ অরিজিনাল জাপানি সাবটাইটেল এবং সার্ভার ৩ ও ৫ এ হিন্দি ও ইংলিশ ডাব অডিও রয়েছে।' 
              : 'Server 1 & 2 offer Subbed streams. Server 3 & 5 provide Hindi Dub & English Dub streams.'}
          </span>
        </p>
      </div>
    </div>
  );
};
