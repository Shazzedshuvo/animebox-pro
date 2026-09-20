// src/pages/DubbedPage.jsx - Dubbed Portal (Hindi Dub & English Dub)
import React, { useState, useMemo } from 'react';
import { Mic, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDubbedQuery } from '../hooks/useAnimeQuery';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { FilterPanel } from '../components/anime/FilterPanel';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const DubbedPage = ({ onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('Hindi Dub'); // 'Hindi Dub' | 'English Dub'

  const { data: dubbedList, isLoading } = useDubbedQuery(activeTab);

  const [filters, setFilters] = useState({
    genre: "All",
    audio: activeTab,
    type: "all",
    sortBy: "popular"
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters(prev => ({ ...prev, audio: tab }));
  };

  const handleReset = () => {
    setFilters({
      genre: "All",
      audio: activeTab,
      type: "all",
      sortBy: "popular"
    });
  };

  const displayedList = useMemo(() => {
    let list = dubbedList || [];

    if (filters.genre !== "All") {
      list = list.filter(a => a.genres?.some(g => g.toLowerCase() === filters.genre.toLowerCase()));
    }

    if (filters.type !== "all") {
      list = list.filter(a => a.type === filters.type || a.format === filters.type);
    }

    if (filters.sortBy === "rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "latest") {
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    } else {
      list = [...list].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return list;
  }, [dubbedList, filters]);

  return (
    <div className="catalog-page-root container">
      {/* Header */}
      <div className="page-header-block">
        <div className="page-title-badge">
          <Mic size={20} className="page-title-icon text-crimson" />
          <h1 className="page-main-title">{t('dubbed')}</h1>
        </div>
      </div>

      {/* Dubbed Quick Switch Tabs */}
      <div className="dubbed-nav-tabs">
        <button 
          className={`dubbed-tab-btn ${activeTab === 'Hindi Dub' ? 'active' : ''}`}
          onClick={() => handleTabChange('Hindi Dub')}
        >
          <span className="tab-flag">🇮🇳</span>
          <span>{lang === 'bn' ? 'হিন্দি ডাব কালেকশন' : 'Hindi Dubbed Collection'}</span>
        </button>

        <button 
          className={`dubbed-tab-btn ${activeTab === 'English Dub' ? 'active' : ''}`}
          onClick={() => handleTabChange('English Dub')}
        >
          <span className="tab-flag">🇺🇸</span>
          <span>{lang === 'bn' ? 'ইংলিশ ডাব কালেকশন' : 'English Dubbed Collection'}</span>
        </button>
      </div>

      {/* Filter Panel */}
      <FilterPanel 
        filters={filters} 
        onFilterChange={setFilters} 
        onReset={handleReset} 
      />

      {/* Grid */}
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <AnimeGrid 
            animeList={displayedList} 
            onOpenDownload={onOpenDownload} 
          />
        )}
      </div>
    </div>
  );
};
