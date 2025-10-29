import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../shared/components/ui/Modal';
import TouchButton from '../../../shared/components/ui/TouchButton';
import NumericKeypad from './NumericKeypad';
import { formatCurrency, formatPercentage } from '../../../shared/utils/formatters';
import { FiPercent, FiDollarSign, FiLock } from 'react-icons/fi';

/**
 * DiscountModal Component
 * Modal for applying manual discounts with authorization
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {number} props.currentTotal - Current cart total
 * @param {Function} props.onApplyDiscount - Discount application handler
 * @param {boolean} props.requiresAuthorization - Requires supervisor authorization
 * @param {number} props.maxDiscountPercent - Maximum discount percentage without auth
 * @param {object} props.user - Current user object
 */
const DiscountModal = ({
  isOpen,
  onClose,
  currentTotal,
  onApplyDiscount,
  requiresAuthorization = true,
  maxDiscountPercent = 10,
  user = null,
}) => {
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'fixed'
  const [discountValue, setDiscountValue] = useState('');
  const [reason, setReason] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showAuthInput, setShowAuthInput] = useState(false);

  // Calculate discount preview
  const calculateDiscount = () => {
    const value = parseFloat(discountValue) || 0;
    
    if (discountType === 'percentage') {
      return (currentTotal * value) / 100;
    }
    
    return value;
  };

  const discountAmount = calculateDiscount();
  const newTotal = Math.max(0, currentTotal - discountAmount);
  const discountPercent = currentTotal > 0 ? (discountAmount / currentTotal) * 100 : 0;

  // Check if authorization is needed
  const needsAuthorization = () => {
    if (!requiresAuthorization) return false;
    
    // Check if discount exceeds maximum
    if (discountPercent > maxDiscountPercent) {
      return true;
    }
    
    return false;
  };

  // Handle discount application
  const handleApply = () => {
    const value = parseFloat(discountValue) || 0;
    
    if (value <= 0) {
      alert('El descuento debe ser mayor a 0');
      return;
    }

    if (discountAmount >= currentTotal) {
      alert('El descuento no puede ser mayor o igual al total');
      return;
    }

    // Check authorization
    if (needsAuthorization() && !authCode) {
      setShowAuthInput(true);
      return;
    }

    // Build discount object
    const discount = {
      type: discountType,
      value: value,
      amount: discountAmount,
      reason: reason || 'Descuento manual',
      authorized_by: authCode ? 'supervisor' : user?.nombre || 'unknown',
      applied_at: new Date().toISOString(),
    };

    onApplyDiscount(discount);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setDiscountType('percentage');
    setDiscountValue('');
    setReason('');
    setAuthCode('');
    setShowAuthInput(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Aplicar Descuento"
    >
      <div className="space-y-4">
        {/* Discount Type Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de descuento:</label>
          <div className="grid grid-cols-2 gap-3">
            <TouchButton
              variant={discountType === 'percentage' ? 'primary' : 'ghost'}
              size="lg"
              onClick={() => setDiscountType('percentage')}
              icon={<FiPercent size={24} />}
            >
              Porcentaje
            </TouchButton>
            
            <TouchButton
              variant={discountType === 'fixed' ? 'primary' : 'ghost'}
              size="lg"
              onClick={() => setDiscountType('fixed')}
              icon={<FiDollarSign size={24} />}
            >
              Monto Fijo
            </TouchButton>
          </div>
        </div>

        {/* Value Input with Keypad */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {discountType === 'percentage' ? 'Porcentaje de descuento:' : 'Monto de descuento:'}
          </label>
          
          <NumericKeypad
            value={discountValue}
            onChange={setDiscountValue}
            allowDecimals={true}
            maxLength={discountType === 'percentage' ? 5 : 10}
            size="sm"
          />
        </div>

        {/* Preview */}
        {discountValue && parseFloat(discountValue) > 0 && (
          <div className="bg-base-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total actual:</span>
              <span className="font-medium">{formatCurrency(currentTotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Descuento:</span>
              <span className="font-medium text-warning">
                -{formatCurrency(discountAmount)}
                {discountType === 'percentage' && ` (${formatPercentage(parseFloat(discountValue))})`}
              </span>
            </div>
            
            <div className="flex justify-between text-lg font-bold border-t border-base-300 pt-2">
              <span>Nuevo total:</span>
              <span className="text-success">{formatCurrency(newTotal)}</span>
            </div>

            {/* Authorization Warning */}
            {needsAuthorization() && (
              <div className="flex items-center gap-2 text-warning text-sm mt-2">
                <FiLock />
                <span>Este descuento requiere autorización de supervisor</span>
              </div>
            )}
          </div>
        )}

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Motivo (opcional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Cliente frecuente, promoción especial..."
            className="input w-full"
          />
        </div>

        {/* Authorization Input */}
        {showAuthInput && (
          <div>
            <label className="block text-sm font-medium mb-2 text-warning">
              Código de autorización:
            </label>
            <input
              type="password"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="Ingresa el código de supervisor"
              className="input w-full"
              autoFocus
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <TouchButton
            variant="ghost"
            size="lg"
            onClick={handleClose}
          >
            Cancelar
          </TouchButton>

          <TouchButton
            variant="success"
            size="lg"
            onClick={handleApply}
            disabled={!discountValue || parseFloat(discountValue) <= 0}
          >
            Aplicar
          </TouchButton>
        </div>
      </div>
    </Modal>
  );
};

DiscountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentTotal: PropTypes.number.isRequired,
  onApplyDiscount: PropTypes.func.isRequired,
  requiresAuthorization: PropTypes.bool,
  maxDiscountPercent: PropTypes.number,
  user: PropTypes.object,
};

export default DiscountModal;
