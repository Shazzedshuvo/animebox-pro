// src/components/anime/SearchOverlay.jsx - Real API-Powered Search Overlay with Debounce & Keyboard Nav
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Star, Clock, Flame, Film, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDebounce } from '../../hooks/useDebounce';
import { useAnimeSearchQuery, useTrendingQuery } from '../../hooks/useAnimeQuery';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useLocalStorage('animebox_search_history', [
    'Solo Leveling', 'Demon Slayer', 'Jujutsu Kaisen', 'One Piece'
  ]);

  const debouncedQuery = useDebounce(query, 350);

  // TanStack React Query real search
  const { data: searchResults, isLoading: isSearchLoading } = useAnimeSearchQuery(debouncedQuery);
  const { data: trendingSuggestions } = useTrendingQuery();

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = searchResults || [];

  // Keyboard navigation through results
  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectAnime(results[selectedIndex]);
      } else if (query.trim()) {
        handleViewAllResults();
      }
    }
  };

  const handleSelectAnime = (anime) => {
    addToHistory(anime.title);
    onClose();
    navigate(`/anime/${anime.id}`);
  };

  const handleViewAllResults = () => {
    if (!query.trim()) return;
    addToHistory(query.trim());
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const addToHistory = (term) => {
    if (!term) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 8);
    });
  };

  const removeHistoryItem = (e, itemToRemove) => {
    e.stopPropagation();
    setSearchHistory(prev => prev.filter(item => item !== itemToRemove));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-container glass-dropdown" onClick={e => e.stopPropagation()}>
        
        {/* Search Input Box */}
        <div className="search-input-header">
          {isSearchLoading ? (
            <Loader2 size={22} className="search-input-icon animate-spin" />
          ) : (
            <Search size={22} className="search-input-icon" />
          )}
          <input
            ref={inputRef}
            type="text"
            className="search-main-input"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery('')}>
              <X size={18} />
            </button>
          )}
          <button className="search-close-btn" onClick={onClose}>
            <kbd>ESC</kbd>
          </button>
        </div>

        {/* Modal Body */}
        <div className="search-modal-body">
          
          {/* Recent History / Suggestions when query is empty */}
          {!debouncedQuery.trim() && (
            <div className="search-suggestions-block">
              {searchHistory.length > 0 && (
                <div className="search-history-section">
                  <div className="history-header">
                    <span className="history-title">
                      <Clock size={14} />
                      {t('recentSearches')}
                    </span>
                    <button className="clear-history-text" onClick={clearAllHistory}>
                      {t('clearAll')}
                    </button>
                  </div>
                  <div className="history-chips-row">
                    {searchHistory.map((item, i) => (
                      <div 
                        key={i} 
                        className="history-chip"
                        onClick={() => {
                          setQuery(item);
                          inputRef.current?.focus();
                        }}
                      >
                        <span>{item}</span>
                        <button 
                          className="chip-remove" 
                          onClick={(e) => removeHistoryItem(e, item)}
                          aria-label="Remove search term"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Trending Suggestions */}
              {trendingSuggestions && trendingSuggestions.length > 0 && (
                <div className="trending-tags-section">
                  <span className="history-title">
                    <Flame size={14} />
                    {t('trendingNow')}
                  </span>
                  <div className="trending-tags-grid">
                    {trendingSuggestions.slice(0, 6).map(anime => (
                      <div 
                        key={anime.id} 
                        className="trending-tag-item"
                        onClick={() => handleSelectAnime(anime)}
                      >
                        <img src={anime.posterImage} alt="" className="tag-thumb" />
                        <div className="tag-info">
                          <span className="tag-name">{lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title}</span>
                          <span className="tag-meta">{anime.genres?.[0]} • ⭐ {anime.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results List */}
          {debouncedQuery.trim() && (
            <div className="search-results-list">
              {results.length === 0 && !isSearchLoading ? (
                <div className="search-empty-state">
                  <Film size={32} />
                  <p>{t('noAnimeFound')}</p>
                </div>
              ) : (
                <>
                  <div className="results-items">
                    {results.slice(0, 8).map((anime, index) => (
                      <div
                        key={anime.id}
                        className={`search-result-row ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleSelectAnime(anime)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <img 
                          src={anime.posterImage} 
                          alt="" 
                          className="result-poster" 
                          onError={(e) => {
                            e.target.src = "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=200&h=200&fit=cover";
                          }}
                        />
                        <div className="result-details">
                          <h4 className="result-title">
                            {lang === 'bn' ? (anime.banglaTitle || anime.title) : anime.title}
                          </h4>
                          <div className="result-meta">
                            <span className="result-rating">
                              <Star size={12} fill="currentColor" /> {anime.rating}
                            </span>
                            <span>•</span>
                            <span>{anime.releaseYear}</span>
                            <span>•</span>
                            <span>{anime.format || anime.type}</span>
                            <span>•</span>
                            <div className="result-audio-tags">
                              {anime.audioTypes?.map((a, i) => (
                                <span key={i} className="mini-audio-badge">{a.replace('Dub', '').trim()}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <CornerDownLeft size={16} className="result-enter-icon" />
                      </div>
                    ))}
                  </div>

                  <button className="view-all-results-btn" onClick={handleViewAllResults}>
                    <span>View all results for "{debouncedQuery}"</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Navigation Hints */}
        <div className="search-modal-footer">
          <div className="shortcut-hint">
            <kbd>↑</kbd><kbd>↓</kbd> <span>Navigate</span>
          </div>
          <div className="shortcut-hint">
            <kbd>↵</kbd> <span>Select</span>
          </div>
          <div className="shortcut-hint">
            <kbd>ESC</kbd> <span>Close</span>
          </div>
        </div>

      </div>
    </div>
  );
};
