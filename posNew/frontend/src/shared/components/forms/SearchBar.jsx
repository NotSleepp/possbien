import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiSearch, FiX, FiMaximize2 } from 'react-icons/fi';
import { playSound, SOUND_TYPES } from '../../utils/sound';

/**
 * SearchBar Component
 * Enhanced search with incremental results, barcode scanner support, and keyboard navigation
 * 
 * @param {Object} props
 * @param {Function} props.onSearch - Search handler (receives search term)
 * @param {Function} props.onResultSelect - Result selection handler
 * @param {Array} props.results - Search results to display
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.showResults - Show results dropdown
 * @param {boolean} props.autoFocus - Auto focus on mount
 * @param {boolean} props.enableBarcode - Enable barcode scanner detection
 * @param {number} props.debounceMs - Debounce delay in ms (default: 150)
 * @param {boolean} props.soundEnabled - Enable sound feedback
 */
const SearchBar = ({
  onSearch,
  onResultSelect,
  results = [],
  placeholder = 'Buscar productos...',
  showResults = true,
  autoFocus = false,
  enableBarcode = true,
  debounceMs = 150,
  soundEnabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [barcodeDetected, setBarcodeDetected] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  // Auto focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search
  const debouncedSearch = useCallback((term) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(term);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    setIsOpen(true);
    debouncedSearch(value);
  };

  // Handle clear
  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle result selection
  const handleSelectResult = (result, index) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.PRODUCT_ADDED, { enabled: true, volume: 0.3 });
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && searchTerm) {
        // Submit search on Enter
        onSearch(searchTerm);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex], selectedIndex);
        } else if (results.length > 0) {
          handleSelectResult(results[0], 0);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      
      default:
        break;
    }
  };

  // Barcode scanner detection
  useEffect(() => {
    if (!enableBarcode) return;

    const handleBarcodeInput = (e) => {
      // Ignore if typing in another input
      if (e.target !== inputRef.current && e.target.tagName === 'INPUT') {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;

      // Scanner types very fast (< 50ms between keys)
      if (timeDiff < 50 && e.key.length === 1) {
        barcodeBuffer.current += e.key;
        e.preventDefault();
      } else if (timeDiff >= 50) {
        barcodeBuffer.current = e.key.length === 1 ? e.key : '';
      }

      lastKeyTime.current = currentTime;

      // Enter key signals end of barcode
      if (e.key === 'Enter' && barcodeBuffer.current.length > 3) {
        e.preventDefault();
        const barcode = barcodeBuffer.current;
        barcodeBuffer.current = '';
        
        // Show barcode detected indicator
        setBarcodeDetected(true);
        setTimeout(() => setBarcodeDetected(false), 1000);
        
        // Search for barcode
        setSearchTerm(barcode);
        onSearch(barcode);
        
        if (soundEnabled) {
          playSound(SOUND_TYPES.BARCODE_SCAN, { enabled: true, volume: 0.3 });
        }
      }
    };

    window.addEventListener('keypress', handleBarcodeInput);

    return () => {
      window.removeEventListener('keypress', handleBarcodeInput);
    };
  }, [enableBarcode, onSearch, soundEnabled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // Highlight matching text
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warning/30 text-base-content font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <FiSearch size={22} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="input w-full pl-12 pr-20 h-14 text-lg font-medium border-2 border-base-300 focus:border-primary rounded-xl shadow-sm"
          aria-label="Buscar productos"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen && results.length > 0}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Barcode indicator */}
          {barcodeDetected && (
            <div className="flex items-center gap-1 text-success animate-pulse">
              <FiMaximize2 size={20} />
            </div>
          )}

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className="text-base-content/50 hover:text-base-content transition-colors"
              aria-label="Limpiar búsqueda"
              type="button"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          id="search-results"
          className="absolute z-50 w-full mt-3 bg-base-100 border-2 border-base-300 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
          role="listbox"
        >
          {results.map((result, index) => (
            <button
              key={result.id || index}
              onClick={() => handleSelectResult(result, index)}
              className={`
                w-full text-left px-4 py-3 hover:bg-base-200 transition-colors
                ${selectedIndex === index ? 'bg-base-200' : ''}
                ${index !== results.length - 1 ? 'border-b border-base-300' : ''}
              `}
              role="option"
              aria-selected={selectedIndex === index}
              type="button"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-base-content">
                    {highlightMatch(result.nombre, searchTerm)}
                  </div>
                  {result.codigo && (
                    <div className="text-sm text-base-content/70">
                      Código: {highlightMatch(result.codigo, searchTerm)}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-success">
                    ${result.precio_venta?.toLocaleString('es-CO')}
                  </div>
                  {result.stock_actual !== undefined && (
                    <div className="text-sm text-base-content/70">
                      Stock: {result.stock_actual}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showResults && isOpen && searchTerm && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 text-center text-base-content/70">
          No se encontraron resultados para "{searchTerm}"
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onResultSelect: PropTypes.func,
  results: PropTypes.array,
  placeholder: PropTypes.string,
  showResults: PropTypes.bool,
  autoFocus: PropTypes.bool,
  enableBarcode: PropTypes.bool,
  debounceMs: PropTypes.number,
  soundEnabled: PropTypes.bool,
};

export default SearchBar;
