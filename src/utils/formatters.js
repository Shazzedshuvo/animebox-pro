// src/utils/formatters.js - Number, Duration & Language Formatters

/**
 * Format score out of 10
 */
export const formatRating = (score) => {
  if (!score) return "8.5";
  const num = typeof score === 'number' ? score : parseFloat(score);
  if (isNaN(num)) return "8.5";
  if (num > 10) return (num / 10).toFixed(1);
  return num.toFixed(1);
};

/**
 * Format minutes into hours & mins (e.g. 24m, 1h 45m)
 */
export const formatDuration = (mins, format = "TV") => {
  if (!mins) return format === "MOVIE" ? "1h 50m" : "24m";
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hours}h ${remainder > 0 ? `${remainder}m` : ''}`;
  }
  return `${mins}m`;
};

/**
 * Converts English digits to Bengali numerals if needed
 */
export const toBengaliNumber = (num) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
};
