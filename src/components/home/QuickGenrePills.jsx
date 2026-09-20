// src/components/home/QuickGenrePills.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Compass, Heart, Swords, Wand2, Ghost, Trophy, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const QUICK_GENRES = [
  { id: "Action", label: "Action", bangla: "অ্যাকশন", icon: Swords },
  { id: "Adventure", label: "Adventure", bangla: "রোমাঞ্চকর", icon: Compass },
  { id: "Fantasy", label: "Fantasy", bangla: "ফ্যান্টাসি", icon: Wand2 },
  { id: "Romance", label: "Romance", bangla: "রোমান্স", icon: Heart },
  { id: "Comedy", label: "Comedy", bangla: "কমেডি", icon: Sparkles },
  { id: "Sports", label: "Sports", bangla: "স্পোর্টস", icon: Trophy },
  { id: "Supernatural", label: "Supernatural", bangla: "অলৌকিক", icon: Ghost },
  { id: "Hindi Dub", label: "Hindi Dub", bangla: "হিন্দি ডাব 🇮🇳", icon: Flame, isDub: true }
];

export const QuickGenrePills = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const handlePillClick = (genreItem) => {
    if (genreItem.isDub) {
      navigate('/dubbed');
    } else {
      navigate(`/series?genre=${encodeURIComponent(genreItem.id)}`);
    }
  };

  return (
    <div className="quick-genres-container">
      <div className="quick-genres-scroll">
        {QUICK_GENRES.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="quick-genre-chip"
              onClick={() => handlePillClick(item)}
            >
              <Icon size={16} className="genre-chip-icon" />
              <span>{lang === 'bn' ? item.bangla : item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
