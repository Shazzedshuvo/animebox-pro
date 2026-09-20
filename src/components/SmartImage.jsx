// src/components/SmartImage.jsx - Resilient Image Component with Shimmer and Fallback
import React, { useState, useEffect } from 'react';
import { DEFAULT_POSTER, DEFAULT_BANNER } from '../utils/imageUtils';

export const SmartImage = ({ 
  src, 
  alt = "Anime artwork", 
  className = "", 
  isBanner = false,
  fallbackSrc,
  loading = "lazy",
  ...props 
}) => {
  const defaultFallback = isBanner ? DEFAULT_BANNER : DEFAULT_POSTER;
  const initialSource = src || fallbackSrc || defaultFallback;
  
  const [imgSrc, setImgSrc] = useState(initialSource);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc || defaultFallback);
    setIsLoaded(false);
    setHasError(false);
  }, [src, fallbackSrc, defaultFallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(defaultFallback);
      }
    }
  };

  return (
    <div className={`smart-image-wrap ${className}`}>
      {!isLoaded && <div className="skeleton-image-shimmer" />}
      <img
        src={imgSrc}
        alt={alt}
        className={`smart-img-tag ${isLoaded ? 'loaded' : 'loading'}`}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        {...props}
      />
    </div>
  );
};
