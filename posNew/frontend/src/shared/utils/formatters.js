/**
 * Utility functions for formatting currency, dates, and numbers
 */

/**
 * Format amount as currency
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale code (default: 'es-CO')
 * @param {string} currency - Currency code (default: 'COP')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = 'es-CO', currency = 'COP') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0, locale, currency);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale code (default: 'es-CO')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date, locale = 'es-CO', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(
    new Date(date)
  );
};

/**
 * Format date only (no time)
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale code (default: 'es-CO')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'es-CO') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @param {string} locale - Locale code (default: 'es-CO')
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'es-CO', decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${formatNumber(value, 'es-CO', decimals)}%`;
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and thousands separators
  const cleaned = currencyString.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Format time duration in seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
