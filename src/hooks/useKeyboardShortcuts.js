// src/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts = {}, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing inside an input or textarea
      const target = event.target;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const key = event.key;
      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, active]);
}
