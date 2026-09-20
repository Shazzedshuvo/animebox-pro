// src/components/anime/AnimeGrid.jsx
import React from 'react';
import { AnimeCard } from './AnimeCard';
import { Sparkles, Film } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AnimeGrid = ({ animeList = [], onOpenDownload, emptyMessage }) => {
  const { t } = useLanguage();

  if (!animeList || animeList.length === 0) {
    return (
      <div className="empty-state-card glass-panel">
        <div className="empty-icon-wrap">
          <Film size={36} />
        </div>
        <h3 className="empty-title">{emptyMessage || t('noAnimeFound')}</h3>
        <p className="empty-sub">{t('noFavoritesSub')}</p>
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {animeList.map(anime => (
        <AnimeCard 
          key={anime.id} 
          anime={anime} 
          onOpenDownload={onOpenDownload} 
        />
      ))}
    </div>
  );
};
