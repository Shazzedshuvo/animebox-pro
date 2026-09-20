// src/pages/HomePage.jsx - Real API-Powered Cinematic OTT Home Page
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Play, Sparkles, Trophy, Mic, Film, 
  Clock, Heart, Swords, Wand2, Star, Compass, PlayCircle, X, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { 
  useHeroAnimeQuery, useTrendingQuery, usePopularQuery, 
  useTopRatedQuery, useLatestQuery, useMoviesQuery, 
  useSeriesQuery, useDubbedQuery, useGenreQuery 
} from '../hooks/useAnimeQuery';
import { getIsUsingFallback } from '../services/animeService';
import { HeroSlider } from '../components/home/HeroSlider';
import { AnimeRow } from '../components/home/AnimeRow';
import { TopTenRow } from '../components/home/TopTenRow';
import { QuickGenrePills } from '../components/home/QuickGenrePills';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export const HomePage = ({ onOpenDownload }) => {
  const { lang, t } = useLanguage();
  const { history, removeFromHistory } = useWatchHistory();
  const navigate = useNavigate();

  // TanStack React Query Data Hooks
  const { data: heroList, isLoading: isHeroLoading } = useHeroAnimeQuery();
  const { data: trendingList } = useTrendingQuery();
  const { data: popularList } = usePopularQuery();
  const { data: topRatedList } = useTopRatedQuery();
  const { data: latestList } = useLatestQuery();
  const { data: moviesList } = useMoviesQuery();
  const { data: seriesList } = useSeriesQuery();
  const { data: hindiDubList } = useDubbedQuery("Hindi Dub");
  const { data: englishDubList } = useDubbedQuery("English Dub");
  const { data: actionList } = useGenreQuery("Action");
  const { data: romanceList } = useGenreQuery("Romance");
  const { data: fantasyList } = useGenreQuery("Fantasy");

  const isFallbackActive = getIsUsingFallback();

  // Dynamic recommendation engine based on user favorites & watch history
  const recommendedList = useMemo(() => {
    if (!popularList || popularList.length === 0) return [];
    if (history.length === 0) {
      return popularList.slice(4, 18);
    }
    const watchedIds = new Set(history.map(h => h.animeId));
    const recs = popularList.filter(a => !watchedIds.has(a.id));
    return recs.length > 0 ? recs.slice(0, 16) : popularList.slice(0, 16);
  }, [history, popularList]);

  return (
    <div className="home-page-root">
      
      {/* Fallback Notice Banner (Non-intrusive) */}
      {isFallbackActive && (
        <div className="fallback-notice-bar">
          <div className="container fallback-notice-content">
            <AlertCircle size={15} />
            <span>
              {lang === 'bn' 
                ? 'লাইভ ডেটা সাময়িকভাবে পাওয়া যাচ্ছে না। সংরক্ষিত কনটেন্ট দেখানো হচ্ছে।' 
                : 'Live API data temporarily unavailable. Showing high-speed cached content.'}
            </span>
          </div>
        </div>
      )}

      {/* 1. Ultra-Cinematic 720px Hero Carousel */}
      <HeroSlider featuredList={heroList || []} onOpenDownload={onOpenDownload} />

      {/* 2. Quick Genre Selector Chips */}
      <div className="container mt-6">
        <QuickGenrePills />
      </div>

      <div className="container home-rows-stack">
        
        {/* 3. Continue Watching Rail (Local Storage Persisted) */}
        {history.length > 0 && (
          <section className="continue-watching-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <div className="section-indicator" />
                <PlayCircle size={20} className="text-crimson" />
                <h2 className="section-title">{t('continueWatching')}</h2>
              </div>
            </div>

            <div className="continue-watching-scroll">
              {history.slice(0, 8).map(item => (
                <div key={`${item.animeId}_${item.episodeNumber}`} className="continue-card glass-panel">
                  <div className="continue-thumb-wrap" onClick={() => navigate(`/watch/${item.animeId}/${item.episodeNumber}`)}>
                    <img src={item.posterImage} alt="" className="continue-thumb-img" />
                    <div className="continue-play-hover">
                      <Play size={20} fill="currentColor" />
                    </div>
                    <div className="continue-progress-bar">
                      <div className="continue-fill" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>

                  <div className="continue-info">
                    <div className="continue-title-line">
                      <h4 className="continue-title">{lang === 'bn' ? (item.banglaTitle || item.animeTitle) : item.animeTitle}</h4>
                      <button 
                        className="continue-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.animeId, item.episodeNumber);
                        }}
                        title={t('remove')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <span className="continue-ep">Episode {item.episodeNumber} • {item.percentage}%</span>
                    <button 
                      className="btn-resume-link"
                      onClick={() => navigate(`/watch/${item.animeId}/${item.episodeNumber}`)}
                    >
                      <span>{t('resume')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. 🔥 Trending Now */}
        <AnimeRow 
          title={t('trendingNow')} 
          icon={Flame} 
          animeList={trendingList || []} 
          viewAllLink="/popular"
          onOpenDownload={onOpenDownload}
        />

        {/* 5. 🏆 Top 10 Today */}
        <TopTenRow animeList={popularList || []} />

        {/* 6. 🆕 Latest Releases */}
        <AnimeRow 
          title={t('latestReleases')} 
          icon={Clock} 
          animeList={latestList || []} 
          viewAllLink="/latest"
          onOpenDownload={onOpenDownload}
        />

        {/* 7. ⚡ Popular Anime */}
        <AnimeRow 
          title={t('popular')} 
          icon={Sparkles} 
          animeList={popularList || []} 
          viewAllLink="/popular"
          onOpenDownload={onOpenDownload}
        />

        {/* 8. 🎙 Hindi Dubbed */}
        <AnimeRow 
          title={t('hindiDubbed')} 
          icon={Mic} 
          animeList={hindiDubList || []} 
          viewAllLink="/dubbed"
          onOpenDownload={onOpenDownload}
        />

        {/* 9. 🎧 English Dubbed */}
        <AnimeRow 
          title={t('englishDubbed')} 
          icon={Mic} 
          animeList={englishDubList || []} 
          viewAllLink="/dubbed"
          onOpenDownload={onOpenDownload}
        />

        {/* 10. 🎬 Blockbuster Anime Movies */}
        <AnimeRow 
          title={t('animeMovies')} 
          icon={Film} 
          animeList={moviesList || []} 
          viewAllLink="/movies"
          onOpenDownload={onOpenDownload}
        />

        {/* 11. 📺 Popular Series */}
        <AnimeRow 
          title={t('popularSeries')} 
          icon={Sparkles} 
          animeList={seriesList || []} 
          viewAllLink="/series"
          onOpenDownload={onOpenDownload}
        />

        {/* 12. ⚔️ Action Anime */}
        <AnimeRow 
          title={t('actionCollection')} 
          icon={Swords} 
          animeList={actionList || []} 
          viewAllLink="/browse?genre=Action"
          onOpenDownload={onOpenDownload}
        />

        {/* 13. ❤️ Romance Anime */}
        <AnimeRow 
          title={t('romanceCollection')} 
          icon={Heart} 
          animeList={romanceList || []} 
          viewAllLink="/browse?genre=Romance"
          onOpenDownload={onOpenDownload}
        />

        {/* 14. 🧙 Fantasy Worlds */}
        <AnimeRow 
          title={t('fantasyWorlds')} 
          icon={Wand2} 
          animeList={fantasyList || []} 
          viewAllLink="/browse?genre=Fantasy"
          onOpenDownload={onOpenDownload}
        />

        {/* 15. ⭐ Top Rated Masterpieces */}
        <AnimeRow 
          title={t('highestRated')} 
          icon={Star} 
          animeList={topRatedList || []} 
          viewAllLink="/popular"
          onOpenDownload={onOpenDownload}
        />

        {/* 16. ✨ Recommended For You */}
        {recommendedList.length > 0 && (
          <AnimeRow 
            title={t('recommendedForYou')} 
            icon={Star} 
            animeList={recommendedList} 
            onOpenDownload={onOpenDownload}
          />
        )}

      </div>
    </div>
  );
};
