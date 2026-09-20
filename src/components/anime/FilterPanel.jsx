// src/components/anime/FilterPanel.jsx
import React from 'react';
import { Filter, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GENRES_LIST = [
  "All", "Action", "Adventure", "Romance", "Comedy", "Fantasy", 
  "Thriller", "Horror", "Sports", "Sci-Fi", "Drama", "Mystery", 
  "Psychological", "Supernatural", "Isekai"
];

export const AUDIO_LIST = [
  { id: "all", label: "All Audio", bn: "সব অডিও" },
  { id: "Hindi Dub", label: "Hindi Dub 🇮🇳", bn: "হিন্দি ডাব 🇮🇳" },
  { id: "English Dub", label: "English Dub 🇺🇸", bn: "ইংলিশ ডাব 🇺🇸" },
  { id: "Sub", label: "Japanese Sub 🇯🇵", bn: "জাপানি সাব 🇯🇵" }
];

export const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular", bn: "সবচেয়ে জনপ্রিয়" },
  { id: "rating", label: "Highest Rated", bn: "সেরা রেটিং" },
  { id: "latest", label: "Latest Releases", bn: "নতুন রিলিজ" },
  { id: "az", label: "A – Z", bn: "অক্ষর অনুযায়ী (A-Z)" },
  { id: "year", label: "Release Year", bn: "মুক্তির বছর" }
];

export const TYPES_LIST = [
  { id: "all", label: "All Types", bn: "সব টাইপ" },
  { id: "TV Series", label: "TV Series", bn: "টিভি সিরিজ" },
  { id: "Movie", label: "Movie", bn: "মুভি" },
  { id: "OVA", label: "OVA / Special", bn: "ওভিএ / স্পেশাল" }
];

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const { lang, t } = useLanguage();

  const handleGenreSelect = (g) => {
    onFilterChange({ ...filters, genre: g });
  };

  const handleAudioSelect = (a) => {
    onFilterChange({ ...filters, audio: a });
  };

  const handleTypeSelect = (type) => {
    onFilterChange({ ...filters, type });
  };

  const handleSortSelect = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value });
  };

  const isFiltered = filters.genre !== "All" || filters.audio !== "all" || filters.type !== "all" || filters.sortBy !== "popular";

  return (
    <div className="filter-panel-card glass-panel">
      <div className="filter-header-row">
        <div className="filter-title-group">
          <Filter size={18} className="filter-icon" />
          <span className="filter-main-title">{t('filter')}</span>
        </div>

        {isFiltered && (
          <button className="reset-filter-btn" onClick={onReset}>
            <RotateCcw size={14} />
            <span>{t('clearAll')}</span>
          </button>
        )}
      </div>

      {/* Genre Pills */}
      <div className="filter-section">
        <label className="filter-label">{t('genres')}</label>
        <div className="genre-pill-scroll">
          {GENRES_LIST.map((g) => (
            <button
              key={g}
              className={`genre-filter-pill ${filters.genre === g ? 'active' : ''}`}
              onClick={() => handleGenreSelect(g)}
            >
              {g === "All" ? t('all') : g}
            </button>
          ))}
        </div>
      </div>

      {/* Row with Audio, Type, Sort */}
      <div className="filter-controls-grid">
        
        {/* Audio Filter */}
        <div className="filter-group">
          <label className="filter-label">{t('audio')}</label>
          <div className="audio-toggle-group">
            {AUDIO_LIST.map((aud) => (
              <button
                key={aud.id}
                className={`audio-btn ${filters.audio === aud.id ? 'active' : ''}`}
                onClick={() => handleAudioSelect(aud.id)}
              >
                {lang === 'bn' ? aud.bn : aud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label className="filter-label">{t('type')}</label>
          <select 
            className="filter-select-input"
            value={filters.type}
            onChange={(e) => handleTypeSelect(e.target.value)}
          >
            {TYPES_LIST.map((ty) => (
              <option key={ty.id} value={ty.id}>
                {lang === 'bn' ? ty.bn : ty.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="filter-group">
          <label className="filter-label">{t('sortBy')}</label>
          <select 
            className="filter-select-input"
            value={filters.sortBy}
            onChange={handleSortSelect}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {lang === 'bn' ? opt.bn : opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
