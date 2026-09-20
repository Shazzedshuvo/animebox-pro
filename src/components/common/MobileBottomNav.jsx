// src/components/common/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Compass, Heart, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';

export const MobileBottomNav = ({ onOpenSearch }) => {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
        <Home size={20} />
        <span>{t('home')}</span>
      </NavLink>

      <button className="mobile-tab" onClick={onOpenSearch}>
        <Search size={20} />
        <span>{t('searchAnime')}</span>
      </button>

      <NavLink to="/series" className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
        <Compass size={20} />
        <span>{t('browse')}</span>
      </NavLink>

      <NavLink to="/my-list" className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
        <div className="tab-icon-wrap">
          <Heart size={20} />
          {favorites.length > 0 && <span className="tab-badge">{favorites.length}</span>}
        </div>
        <span>{t('myList')}</span>
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => `mobile-tab ${isActive ? 'active' : ''}`}>
        <Clock size={20} />
        <span>{t('history')}</span>
      </NavLink>
    </nav>
  );
};
