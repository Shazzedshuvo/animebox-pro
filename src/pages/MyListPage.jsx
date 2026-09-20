// src/pages/MyListPage.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import fullAnimeDatabase from '../data/animeData';
import { AnimeGrid } from '../components/anime/AnimeGrid';

export const MyListPage = ({ onOpenDownload }) => {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  const favoriteAnimeList = useMemo(() => {
    return fullAnimeDatabase.filter(a => favorites.includes(a.id));
  }, [favorites]);

  return (
    <div className="catalog-page-root container">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="page-title-badge">
          <Heart size={20} className="page-title-icon text-crimson" fill="currentColor" />
          <h1 className="page-main-title">{t('myList')}</h1>
        </div>
        <span className="page-count-tag">{favoriteAnimeList.length} Anime</span>
      </div>

      {favoriteAnimeList.length === 0 ? (
        <div className="empty-state-box glass-panel">
          <div className="empty-icon-circle">
            <Heart size={42} />
          </div>
          <h3 className="empty-title">{t('noFavorites')}</h3>
          <p className="empty-subtitle">{t('noFavoritesSub')}</p>
          <Link to="/" className="btn btn-primary mt-4">
            <Compass size={18} />
            <span>{t('exploreCatalog')}</span>
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <AnimeGrid 
            animeList={favoriteAnimeList} 
            onOpenDownload={onOpenDownload} 
          />
        </div>
      )}
    </div>
  );
};
