// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, Search, Bell, Globe, Heart, History, User, 
  Sparkles, Check, ChevronDown, Menu, X, Flame, Film, Tv, Mic
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { useClickOutside } from '../../hooks/useClickOutside';

export const Navbar = ({ onOpenSearch }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const { showSuccess, showInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(langRef, () => setShowLangMenu(false));
  useClickOutside(notifRef, () => setShowNotifMenu(false));
  useClickOutside(profileRef, () => setShowProfileMenu(false));

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowLangMenu(false);
    setShowNotifMenu(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleLanguageChange = (selectedLang) => {
    if (selectedLang !== lang) {
      toggleLanguage();
      showSuccess(selectedLang === 'bn' ? 'ভাষা বাংলায় পরিবর্তন করা হয়েছে' : 'Language changed to English');
    }
    setShowLangMenu(false);
  };

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme);
    showInfo(newTheme === 'gold' ? 'Royal Gold theme activated' : 'Crimson theme activated');
    setShowProfileMenu(false);
  };

  return (
    <>
      <header className={`navbar-root ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          
          {/* Left Brand & Nav Links */}
          <div className="navbar-left">
            <button 
              className="mobile-menu-trigger desktop-hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle Navigation Menu"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="navbar-brand">
              <div className="brand-logo-icon">
                <Play size={18} fill="currentColor" />
              </div>
              <div className="brand-text">
                <span className="brand-title">ANIME<span className="brand-highlight">BOX</span></span>
                <span className="brand-badge-vip">PRO</span>
              </div>
            </Link>

            <nav className="desktop-nav">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('home')}
              </NavLink>
              <NavLink to="/series" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('series')}
              </NavLink>
              <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('movies')}
              </NavLink>
              <NavLink to="/dubbed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="dub-badge">DUB</span>
                {t('dubbed')}
              </NavLink>
              <NavLink to="/latest" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('newReleases')}
              </NavLink>
              <NavLink to="/popular" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('popular')}
              </NavLink>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="navbar-right">
            
            {/* Search Button */}
            <button 
              className="navbar-search-btn"
              onClick={onOpenSearch}
              aria-label="Search Anime"
            >
              <Search size={18} />
              <span className="search-hint">{t('search')}</span>
              <kbd className="search-shortcut">⌘K</kbd>
            </button>

            {/* Language Switcher */}
            <div className="dropdown-wrapper" ref={langRef}>
              <button 
                className="btn-icon-nav lang-toggle-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                title="Switch Language (English / বাংলা)"
              >
                <Globe size={18} />
                <span className="lang-code-tag">{lang === 'bn' ? 'বাং' : 'EN'}</span>
              </button>

              {showLangMenu && (
                <div className="dropdown-menu glass-dropdown lang-menu">
                  <div className="dropdown-header">
                    <span>{t('language')}</span>
                  </div>
                  <button 
                    className={`dropdown-item ${lang === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <span className="flag">🇺🇸</span>
                    <span>English</span>
                    {lang === 'en' && <Check size={16} className="item-check" />}
                  </button>
                  <button 
                    className={`dropdown-item ${lang === 'bn' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('bn')}
                  >
                    <span className="flag">🇧🇩</span>
                    <span>বাংলা (Bengali)</span>
                    {lang === 'bn' && <Check size={16} className="item-check" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="dropdown-wrapper" ref={notifRef}>
              <button 
                className="btn-icon-nav"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                title={t('notifications')}
              >
                <Bell size={19} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {showNotifMenu && (
                <div className="dropdown-menu glass-dropdown notif-menu">
                  <div className="dropdown-header">
                    <span>{t('notifications')}</span>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={markAllAsRead}>
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <p className="empty-notif">{t('noNotifications')}</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`notif-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifMenu(false);
                            navigate(`/anime/${n.animeId}`);
                          }}
                        >
                          <img src={n.image} alt="" className="notif-thumb" />
                          <div className="notif-content">
                            <h4 className="notif-title">{lang === 'bn' ? n.banglaTitle : n.title}</h4>
                            <p className="notif-desc">{lang === 'bn' ? n.banglaMessage : n.message}</p>
                            <span className="notif-time">{lang === 'bn' ? n.banglaTime : n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My List Icon */}
            <Link to="/my-list" className="btn-icon-nav" title={t('myList')}>
              <Heart size={19} />
              {favorites.length > 0 && <span className="fav-count-badge">{favorites.length}</span>}
            </Link>

            {/* Profile & Settings Menu */}
            <div className="dropdown-wrapper" ref={profileRef}>
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="avatar-img">
                  <User size={18} />
                </div>
                <ChevronDown size={14} className="avatar-arrow" />
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu glass-dropdown profile-menu">
                  <div className="profile-user-card">
                    <div className="user-avatar-large">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="user-name">Otaku Master</h4>
                      <span className="user-tier">Premium VIP Member</span>
                    </div>
                  </div>

                  <div className="menu-divider" />

                  <Link to="/my-list" className="dropdown-item">
                    <Heart size={16} />
                    <span>{t('myList')}</span>
                    <span className="item-badge">{favorites.length}</span>
                  </Link>

                  <Link to="/history" className="dropdown-item">
                    <History size={16} />
                    <span>{t('history')}</span>
                  </Link>

                  <div className="menu-divider" />

                  <div className="theme-selector-section">
                    <span className="theme-label">{t('themeAccent')}</span>
                    <div className="theme-pills">
                      <button 
                        className={`theme-pill-btn crimson ${theme === 'crimson' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('crimson')}
                      >
                        <span className="color-dot crimson" />
                        <span>Crimson</span>
                      </button>
                      <button 
                        className={`theme-pill-btn gold ${theme === 'gold' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('gold')}
                      >
                        <span className="color-dot gold" />
                        <span>Gold</span>
                      </button>
                    </div>
                  </div>

                  <div className="menu-divider" />

                  <button className="dropdown-item logout" onClick={() => {
                    showInfo('Demo Session Active');
                    setShowProfileMenu(false);
                  }}>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="mobile-drawer-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-drawer glass-dropdown" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="navbar-brand">
                <div className="brand-logo-icon">
                  <Play size={16} fill="currentColor" />
                </div>
                <span className="brand-title">ANIME<span className="brand-highlight">BOX</span></span>
              </div>
              <button className="btn-icon" onClick={() => setShowMobileMenu(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <NavLink to="/" className="mobile-nav-item">
                <Flame size={20} />
                <span>{t('home')}</span>
              </NavLink>
              <NavLink to="/series" className="mobile-nav-item">
                <Tv size={20} />
                <span>{t('series')}</span>
              </NavLink>
              <NavLink to="/movies" className="mobile-nav-item">
                <Film size={20} />
                <span>{t('movies')}</span>
              </NavLink>
              <NavLink to="/dubbed" className="mobile-nav-item">
                <Mic size={20} />
                <span>{t('dubbed')}</span>
              </NavLink>
              <NavLink to="/my-list" className="mobile-nav-item">
                <Heart size={20} />
                <span>{t('myList')}</span>
              </NavLink>
              <NavLink to="/history" className="mobile-nav-item">
                <History size={20} />
                <span>{t('history')}</span>
              </NavLink>
            </nav>

            <div className="mobile-drawer-footer">
              <button 
                className="btn btn-secondary w-full"
                onClick={toggleLanguage}
              >
                <Globe size={18} />
                <span>{lang === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
