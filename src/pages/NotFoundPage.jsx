// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="not-found-root container">
      <div className="not-found-card glass-panel">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">
          {lang === 'bn' ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
        </h2>
        <p className="not-found-text">
          {lang === 'bn' 
            ? 'আপনি যে এনিমে বা পেজটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা মুছে ফেলা হয়েছে।' 
            : 'The anime stream or page you are looking for has been moved or does not exist.'}
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>{t('home')}</span>
          </Link>
          <Link to="/series" className="btn btn-secondary">
            <Compass size={18} />
            <span>{t('browse')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
