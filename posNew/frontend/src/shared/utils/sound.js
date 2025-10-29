/**
 * Sound utility functions for audio feedback
 */

// Sound types
export const SOUND_TYPES = {
  PRODUCT_ADDED: 'product-added',
  SALE_COMPLETED: 'sale-completed',
  ERROR: 'error',
  BARCODE_SCAN: 'barcode-scan',
  BUTTON_CLICK: 'button-click',
  WARNING: 'warning',
};

// Audio context for Web Audio API
let audioContext = null;

/**
 * Initialize audio context
 */
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a beep sound with specified frequency and duration
 * @param {number} frequency - Frequency in Hz
 * @param {number} duration - Duration in milliseconds
 * @param {number} volume - Volume (0-1)
 */
const playBeep = (frequency, duration, volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (error) {
    console.error('Error playing beep:', error);
  }
};

/**
 * Sound configurations for different events
 */
const soundConfigs = {
  [SOUND_TYPES.PRODUCT_ADDED]: { frequency: 800, duration: 100 },
  [SOUND_TYPES.SALE_COMPLETED]: { frequency: 1000, duration: 200 },
  [SOUND_TYPES.ERROR]: { frequency: 400, duration: 300 },
  [SOUND_TYPES.BARCODE_SCAN]: { frequency: 1200, duration: 80 },
  [SOUND_TYPES.BUTTON_CLICK]: { frequency: 600, duration: 50 },
  [SOUND_TYPES.WARNING]: { frequency: 700, duration: 150 },
};

/**
 * Play sound by type
 * @param {string} soundType - Type of sound to play
 * @param {object} settings - Sound settings (enabled, volume)
 */
export const playSound = (soundType, settings = { enabled: true, volume: 0.3 }) => {
  if (!settings.enabled) return;

  const config = soundConfigs[soundType];
  if (!config) {
    console.warn(`Unknown sound type: ${soundType}`);
    return;
  }

  playBeep(config.frequency, config.duration, settings.volume);
};

/**
 * Play success sound (multi-tone)
 */
export const playSuccessSound = (settings = { enabled: true, volume: 0.3 }) => {
  if (!settings.enabled) return;

  playBeep(800, 100, settings.volume);
  setTimeout(() => playBeep(1000, 150, settings.volume), 120);
};

/**
 * Play error sound (descending tone)
 */
export const playErrorSound = (settings = { enabled: true, volume: 0.3 }) => {
  if (!settings.enabled) return;

  playBeep(600, 100, settings.volume);
  setTimeout(() => playBeep(400, 200, settings.volume), 120);
};

/**
 * Resume audio context (required after user interaction)
 */
export const resumeAudioContext = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};
