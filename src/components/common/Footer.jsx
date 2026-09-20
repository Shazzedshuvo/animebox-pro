// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Globe, Github, Twitter, Youtube, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <footer className="footer-root">
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="navbar-brand">
              <div className="brand-logo-icon">
                <Play size={18} fill="currentColor" />
              </div>
              <span className="brand-title">ANIME<span className="brand-highlight">BOX</span></span>
            </Link>
            <p className="footer-about-text">
              {t('footerAbout')}
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Github"><Github size={18} /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="social-icon" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" className="social-icon" aria-label="Telegram"><Send size={18} /></a>
            </div>
          </div>

          {/* Categories Col */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('categories')}</h4>
            <ul className="footer-links">
              <li><Link to="/series">{t('series')}</Link></li>
              <li><Link to="/movies">{t('movies')}</Link></li>
              <li><Link to="/dubbed">{t('hindiDubbed')}</Link></li>
              <li><Link to="/dubbed">{t('englishDubbed')}</Link></li>
              <li><Link to="/popular">{t('popular')}</Link></li>
              <li><Link to="/latest">{t('newReleases')}</Link></li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/my-list">{t('myList')}</Link></li>
              <li><Link to="/history">{t('history')}</Link></li>
              <li><Link to="/search">{t('searchAnime')}</Link></li>
              <li><a href="#faq">{t('faq')}</a></li>
              <li><a href="#terms">{t('termsOfService')}</a></li>
              <li><a href="#privacy">{t('privacyPolicy')}</a></li>
            </ul>
          </div>

          {/* Language & Disclaimer Col */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('language')}</h4>
            <button 
              className="btn btn-secondary footer-lang-btn"
              onClick={toggleLanguage}
            >
              <Globe size={16} />
              <span>{lang === 'en' ? 'বাংলা (Bengali)' : 'English (US)'}</span>
            </button>

            <div className="footer-security-badge">
              <ShieldCheck size={18} className="shield-icon" />
              <span>100% Ad-Free Clean Experience</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            {t('footerDisclaimer')}
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} ANIMEBOX Inc. {t('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};
