/**
 * POS Configuration
 * Centralized configuration for the POS system
 */

export const posConfig = {
  // Tax configuration
  tax: {
    enabled: true,
    rate: 0.19, // 19% IVA
    label: 'IVA',
  },

  // Payment methods
  paymentMethods: {
    available: ['cash', 'card', 'transfer'],
    allowSplit: true, // Allow split payments
    labels: {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
    },
  },

  // Discount configuration
  discount: {
    requiresAuthorization: true,
    maxPercentWithoutAuth: 10, // Maximum discount % without supervisor
    allowReasons: true, // Allow discount reason input
  },

  // Sound configuration
  sound: {
    enabled: false, // Enable/disable sounds globally
    volume: 0.3, // 0-1
    events: {
      productAdded: true,
      saleCompleted: true,
      error: true,
      barcodeScanned: true,
    },
  },

  // Search configuration
  search: {
    debounceMs: 150, // Debounce delay for search
    minCharsForBackend: 2, // Minimum characters before backend search
    enableBarcode: true, // Enable barcode scanner detection
    barcodeDetectionMs: 50, // Max ms between keystrokes for barcode
  },

  // Product grid configuration
  grid: {
    enableVirtualScroll: true, // Enable virtual scrolling for large lists
    virtualScrollThreshold: 50, // Number of products before virtual scroll
    showStock: true, // Show stock information
    showPromotions: true, // Show promotion badges
  },

  // Cart configuration
  cart: {
    showTax: true,
    allowNegativeQuantity: false,
    confirmBeforeClear: true,
    maxItemsWarning: 50, // Warn if cart has too many items
  },

  // Keyboard shortcuts
  shortcuts: {
    enabled: true,
    keys: {
      focusSearch: 'ctrl+k',
      openPayment: 'ctrl+p',
      applyDiscount: 'ctrl+d',
      newSale: 'ctrl+n',
      closeModal: 'escape',
    },
  },

  // Toast notifications
  toast: {
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
    maxVisible: 3, // Maximum number of visible toasts
    defaultDuration: {
      success: 3000,
      error: 5000,
      warning: 4000,
      info: 3000,
    },
  },

  // Receipt configuration
  receipt: {
    autoPrint: false, // Auto-print after sale
    printMethod: 'browser', // 'browser', 'thermal', 'email'
    includeCustomerInfo: true,
    includeTaxBreakdown: true,
  },

  // Performance
  performance: {
    enableMonitoring: process.env.NODE_ENV === 'development',
    logSlowOperations: true,
    slowOperationThreshold: 500, // ms
  },

  // UI preferences
  ui: {
    theme: 'auto', // 'light', 'dark', 'auto'
    animations: true,
    hapticFeedback: false, // Enable haptic feedback on mobile
    touchButtonSize: 'lg', // 'sm', 'md', 'lg', 'xl'
  },
};

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path (e.g., 'tax.rate')
 * @returns {any} Configuration value
 */
export const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], posConfig);
};

/**
 * Update configuration value
 * @param {string} path - Dot notation path
 * @param {any} value - New value
 */
export const setConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key], posConfig);
  target[lastKey] = value;
};

export default posConfig;
