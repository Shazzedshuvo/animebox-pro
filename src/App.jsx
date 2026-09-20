// src/App.jsx - Root Route Switchboard & Global Modals
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { SearchOverlay } from './components/anime/SearchOverlay';
import { DownloadModal } from './components/anime/DownloadModal';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/Browse';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { DubbedPage } from './pages/DubbedPage';
import { LatestPage } from './pages/LatestPage';
import { PopularPage } from './pages/PopularPage';
import { MyListPage } from './pages/MyListPage';
import { HistoryPage } from './pages/HistoryPage';
import { SearchPage } from './pages/SearchPage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState({
    isOpen: false,
    anime: null,
    episodeNumber: 1
  });

  const handleOpenDownload = (anime, episodeNumber = 1) => {
    setDownloadModalData({
      isOpen: true,
      anime,
      episodeNumber
    });
  };

  const handleCloseDownload = () => {
    setDownloadModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="app-container">
      {/* Top Fixed Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Routed Page Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage onOpenDownload={handleOpenDownload} />} />
          <Route path="/browse" element={<BrowsePage onOpenDownload={handleOpenDownload} />} />
          <Route path="/genre/:genre" element={<BrowsePage onOpenDownload={handleOpenDownload} />} />
          <Route path="/movies" element={<MoviesPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/series" element={<SeriesPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/dubbed" element={<DubbedPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/latest" element={<LatestPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/popular" element={<PopularPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/my-list" element={<MyListPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/search" element={<SearchPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/anime/:id" element={<AnimeDetailsPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/watch/:id/:episode" element={<WatchPage onOpenDownload={handleOpenDownload} />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Real-Time Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Global Safe Demo Download Modal */}
      <DownloadModal 
        isOpen={downloadModalData.isOpen}
        anime={downloadModalData.anime}
        initialEpisode={downloadModalData.episodeNumber}
        onClose={handleCloseDownload}
      />

      {/* Mobile Fixed Glassmorphic Bottom Navigation */}
      <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Scroll-to-Top Button */}
      <ScrollToTop />

      {/* Global Floating Toast Stack */}
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
