// src/components/common/Loader.jsx
import React from 'react';
import { Play } from 'lucide-react';

export const Loader = ({ message = "Loading AnimeBox..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-pulse-ring">
        <div className="loader-icon-box">
          <Play size={28} fill="currentColor" />
        </div>
      </div>
      <p className="loader-text">{message}</p>
    </div>
  );
};
