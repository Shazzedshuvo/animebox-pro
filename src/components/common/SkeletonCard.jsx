// src/components/common/SkeletonCard.jsx
import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card-wrap">
      <div className="skeleton skeleton-poster" />
      <div className="skeleton-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton-meta">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-badge" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 12 }) => {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
