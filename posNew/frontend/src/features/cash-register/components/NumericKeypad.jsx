import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TouchButton from '../../../shared/components/ui/TouchButton';
import { FiDelete, FiCheck } from 'react-icons/fi';
import { playSound, SOUND_TYPES } from '../../../shared/utils/sound';

/**
 * NumericKeypad Component
 * Touch-optimized numeric keypad for entering quantities and amounts
 * 
 * @param {Object} props
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onEnter - Enter key handler
 * @param {number} props.maxLength - Maximum length (default: 10)
 * @param {boolean} props.allowDecimals - Allow decimal point (default: true)
 * @param {'sm' | 'md' | 'lg'} props.size - Keypad size
 * @param {boolean} props.soundEnabled - Enable sound feedback
 */
const NumericKeypad = ({
  value = '',
  onChange,
  onEnter,
  maxLength = 10,
  allowDecimals = true,
  size = 'md',
  soundEnabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Button size mapping
  const buttonSizes = {
    sm: 'lg',  // TouchButton lg = 60px
    md: 'xl',  // TouchButton xl = 72px
    lg: 'xl',  // TouchButton xl = 72px with larger text
  };

  const buttonSize = buttonSizes[size];

  // Handle number button click
  const handleNumberClick = (num) => {
    if (displayValue.length >= maxLength) return;

    const newValue = displayValue + num;
    setDisplayValue(newValue);
    onChange(newValue);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }
  };

  // Handle decimal point
  const handleDecimalClick = () => {
    if (!allowDecimals) return;
    if (displayValue.includes('.')) return;
    if (displayValue.length >= maxLength) return;

    const newValue = displayValue === '' ? '0.' : displayValue + '.';
    setDisplayValue(newValue);
    onChange(newValue);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    const newValue = displayValue.slice(0, -1);
    setDisplayValue(newValue);
    onChange(newValue);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }
  };

  // Handle clear
  const handleClear = () => {
    setDisplayValue('');
    onChange('');
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }
  };

  // Handle enter
  const handleEnter = () => {
    if (onEnter) {
      onEnter(displayValue);
      
      if (soundEnabled) {
        playSound(SOUND_TYPES.PRODUCT_ADDED, { enabled: true, volume: 0.3 });
      }
    }
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      // Only handle if keypad is visible and not typing in another input
      if (event.target.tagName === 'INPUT' && event.target.type !== 'hidden') {
        return;
      }

      if (key >= '0' && key <= '9') {
        event.preventDefault();
        handleNumberClick(key);
      } else if (key === '.' && allowDecimals) {
        event.preventDefault();
        handleDecimalClick();
      } else if (key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (key === 'Delete' || key === 'Escape') {
        event.preventDefault();
        handleClear();
      } else if (key === 'Enter') {
        event.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [displayValue, allowDecimals]);

  return (
    <div className="flex flex-col gap-3 p-5 bg-base-200 rounded-xl shadow-inner">
      {/* Display */}
      <div className="bg-base-100 rounded-xl p-5 mb-2 shadow-md border-2 border-base-300">
        <div className="text-right text-4xl font-bold text-primary min-h-[56px] flex items-center justify-end">
          {displayValue || '0'}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Numbers 1-9 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchButton
            key={num}
            size={buttonSize}
            variant="secondary"
            onClick={() => handleNumberClick(num.toString())}
            hapticFeedback
            className="font-bold text-xl"
          >
            {num}
          </TouchButton>
        ))}

        {/* Bottom row: Clear, 0, Decimal */}
        <TouchButton
          size={buttonSize}
          variant="ghost"
          onClick={handleClear}
          hapticFeedback
          className="font-bold"
          title="Limpiar (Esc)"
        >
          C
        </TouchButton>

        <TouchButton
          size={buttonSize}
          variant="secondary"
          onClick={() => handleNumberClick('0')}
          hapticFeedback
          className="font-bold text-xl"
        >
          0
        </TouchButton>

        <TouchButton
          size={buttonSize}
          variant="secondary"
          onClick={handleDecimalClick}
          disabled={!allowDecimals || displayValue.includes('.')}
          hapticFeedback
          className="font-bold text-xl"
        >
          .
        </TouchButton>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <TouchButton
          size={buttonSize}
          variant="danger"
          onClick={handleBackspace}
          icon={<FiDelete size={24} />}
          hapticFeedback
          title="Borrar (Backspace)"
        >
          Borrar
        </TouchButton>

        <TouchButton
          size={buttonSize}
          variant="success"
          onClick={handleEnter}
          icon={<FiCheck size={24} />}
          hapticFeedback
          title="Confirmar (Enter)"
        >
          OK
        </TouchButton>
      </div>
    </div>
  );
};

NumericKeypad.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  maxLength: PropTypes.number,
  allowDecimals: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  soundEnabled: PropTypes.bool,
};

export default NumericKeypad;
