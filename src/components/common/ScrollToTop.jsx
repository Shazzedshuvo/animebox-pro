// src/components/common/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Scroll listener for progress calculation & visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button 
      className="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Scroll to top"
    >
      <svg className="progress-ring" width="48" height="48">
        <circle
          className="progress-ring-bg"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        <circle
          className="progress-ring-circle"
          stroke="var(--accent-color)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
      </svg>
      <ArrowUp size={18} className="scroll-arrow-icon" />
    </button>
  );
};
