// src/components/home/AnimeRow.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { AnimeCard } from '../anime/AnimeCard';
import { useLanguage } from '../../context/LanguageContext';

export const AnimeRow = ({ title, icon: Icon, animeList = [], viewAllLink, onOpenDownload }) => {
  const { t } = useLanguage();
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [animeList]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkArrows, 300);
  };

  if (!animeList || animeList.length === 0) return null;

  return (
    <div className="anime-row-wrapper">
      {/* Row Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-indicator" />
          {Icon && <Icon size={20} className="row-icon" />}
          <h2 className="section-title">{title}</h2>
        </div>

        {viewAllLink && (
          <Link to={viewAllLink} className="section-view-all">
            <span>{t('viewAll')}</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Row Slider Container */}
      <div className="row-slider-container">
        {showLeftArrow && (
          <button 
            className="row-nav-btn prev"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div 
          className="row-cards-track" 
          ref={rowRef}
          onScroll={checkArrows}
        >
          {animeList.map(anime => (
            <div key={anime.id} className="row-card-item">
              <AnimeCard anime={anime} onOpenDownload={onOpenDownload} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button 
            className="row-nav-btn next"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};
