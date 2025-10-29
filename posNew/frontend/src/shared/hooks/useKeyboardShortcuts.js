import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook to manage keyboard shortcuts
 * @param {object} shortcuts - Object mapping key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 * 
 * @example
 * useKeyboardShortcuts({
 *   'ctrl+k': () => focusSearch(),
 *   'ctrl+p': () => processPayment(),
 *   'f1': () => showHelp(),
 * });
 */
export const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape key even in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build key combination string
      let combination = '';
      if (ctrl) combination += 'ctrl+';
      if (shift) combination += 'shift+';
      if (alt) combination += 'alt+';
      combination += key;

      // Check if this combination has a handler
      const handler = shortcutsRef.current[combination];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);
};

/**
 * Hook for single key shortcut
 * @param {string} key - Key to listen for
 * @param {function} handler - Handler function
 * @param {boolean} enabled - Whether shortcut is enabled
 */
export const useKeyPress = (key, handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, handler, enabled]);
};

/**
 * Hook to detect escape key press
 * @param {function} handler - Handler function
 * @param {boolean} enabled - Whether to listen for escape
 */
export const useEscapeKey = (handler, enabled = true) => {
  useKeyPress('Escape', handler, enabled);
};

/**
 * Hook to detect enter key press
 * @param {function} handler - Handler function
 * @param {boolean} enabled - Whether to listen for enter
 */
export const useEnterKey = (handler, enabled = true) => {
  useKeyPress('Enter', handler, enabled);
};

/**
 * Hook for arrow key navigation
 * @param {object} handlers - Handlers for each arrow direction
 * @param {boolean} enabled - Whether navigation is enabled
 * 
 * @example
 * useArrowNavigation({
 *   up: () => selectPrevious(),
 *   down: () => selectNext(),
 *   left: () => goBack(),
 *   right: () => goForward(),
 * });
 */
export const useArrowNavigation = (handlers, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const { key } = event;
      
      switch (key) {
        case 'ArrowUp':
          if (handlers.up) {
            event.preventDefault();
            handlers.up(event);
          }
          break;
        case 'ArrowDown':
          if (handlers.down) {
            event.preventDefault();
            handlers.down(event);
          }
          break;
        case 'ArrowLeft':
          if (handlers.left) {
            event.preventDefault();
            handlers.left(event);
          }
          break;
        case 'ArrowRight':
          if (handlers.right) {
            event.preventDefault();
            handlers.right(event);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
};

/**
 * Get list of available shortcuts for help display
 * @param {object} shortcuts - Shortcuts object
 * @returns {array} Array of shortcut descriptions
 */
export const getShortcutsList = (shortcuts) => {
  return Object.entries(shortcuts).map(([key, handler]) => ({
    key: key.replace('ctrl+', 'Ctrl+').replace('shift+', 'Shift+').replace('alt+', 'Alt+'),
    description: handler.description || 'No description',
  }));
};
