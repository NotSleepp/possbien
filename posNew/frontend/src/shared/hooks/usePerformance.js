import { useEffect, useRef } from 'react';

/**
 * Hook to measure component render performance
 * @param {string} componentName - Name of the component
 * @param {boolean} enabled - Whether to enable performance tracking
 */
export const usePerformance = (componentName, enabled = process.env.NODE_ENV === 'development') => {
  const renderCount = useRef(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;

    if (!startTime.current) {
      startTime.current = performance.now();
    }

    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(
        `[Performance] ${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = null;
  });

  return {
    renderCount: renderCount.current,
  };
};

/**
 * Hook to measure async operation performance
 * @returns {object} Performance measurement utilities
 */
export const useAsyncPerformance = () => {
  const measureAsync = async (operationName, asyncFn) => {
    const startTime = performance.now();
    
    try {
      const result = await asyncFn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 500) {
        console.warn(`[Performance] ${operationName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };

  return { measureAsync };
};

/**
 * Hook to track Core Web Vitals
 */
export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Largest Contentful Paint (LCP)
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[Web Vitals] LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }
    };

    // First Input Delay (FID)
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          console.log('[Web Vitals] FID:', fid);
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID not supported
      }
    };

    // Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      let clsScore = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        console.log('[Web Vitals] CLS:', clsScore);
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }
    };

    observeLCP();
    observeFID();
    observeCLS();
  }, []);
};
