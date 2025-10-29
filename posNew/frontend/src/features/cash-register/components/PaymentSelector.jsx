import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiDollarSign, FiCreditCard, FiSend, FiCheck } from 'react-icons/fi';
import TouchButton from '../../../shared/components/ui/TouchButton';
import NumericKeypad from './NumericKeypad';
import { formatCurrency } from '../../../shared/utils/formatters';
import { playSound, SOUND_TYPES } from '../../../shared/utils/sound';

/**
 * PaymentSelector Component
 * Payment method selection with cash calculator and split payment support
 * 
 * @param {Object} props
 * @param {number} props.total - Total amount to pay
 * @param {Function} props.onPaymentComplete - Payment completion handler
 * @param {Array} props.availableMethods - Available payment methods
 * @param {boolean} props.allowSplit - Allow split payments
 * @param {boolean} props.soundEnabled - Enable sound feedback
 */
const PaymentSelector = ({
  total,
  onPaymentComplete,
  availableMethods = ['cash', 'card', 'transfer'],
  allowSplit = false,
  soundEnabled = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cashReceived, setCashReceived] = useState('');
  const [splitPayments, setSplitPayments] = useState([]);
  const [showKeypad, setShowKeypad] = useState(false);

  // Payment method configurations
  const paymentMethods = {
    cash: {
      id: 'cash',
      name: 'Efectivo',
      icon: FiDollarSign,
      color: 'success',
      requiresAmount: true,
    },
    card: {
      id: 'card',
      name: 'Tarjeta',
      icon: FiCreditCard,
      color: 'primary',
      requiresAmount: false,
    },
    transfer: {
      id: 'transfer',
      name: 'Transferencia',
      icon: FiSend,
      color: 'secondary',
      requiresAmount: false,
    },
  };

  // Calculate change for cash payment
  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    const remaining = total - splitPayments.reduce((sum, p) => sum + p.amount, 0);
    return received - remaining;
  };

  // Calculate remaining amount for split payments
  const getRemainingAmount = () => {
    return total - splitPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  // Handle method selection
  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    const method = paymentMethods[methodId];
    
    if (method.requiresAmount) {
      setShowKeypad(true);
    }
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }
  };

  // Handle cash amount input
  const handleCashAmountChange = (value) => {
    setCashReceived(value);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    if (!selectedMethod) return;

    const method = paymentMethods[selectedMethod];
    const remaining = getRemainingAmount();

    // Validate cash payment
    if (method.requiresAmount) {
      const received = parseFloat(cashReceived) || 0;
      if (received < remaining) {
        alert(`El monto recibido (${formatCurrency(received)}) es menor al total (${formatCurrency(remaining)})`);
        return;
      }
    }

    // Build payment object
    const payment = {
      method: selectedMethod,
      amount: remaining,
    };

    if (method.requiresAmount) {
      payment.received = parseFloat(cashReceived);
      payment.change = calculateChange();
    }

    // Handle split payment
    if (allowSplit && remaining > 0) {
      const newSplitPayments = [...splitPayments, payment];
      const totalPaid = newSplitPayments.reduce((sum, p) => sum + p.amount, 0);

      if (totalPaid < total) {
        setSplitPayments(newSplitPayments);
        setSelectedMethod(null);
        setCashReceived('');
        setShowKeypad(false);
        
        if (soundEnabled) {
          playSound(SOUND_TYPES.PRODUCT_ADDED, { enabled: true, volume: 0.3 });
        }
        return;
      }
    }

    // Complete payment
    const finalPayment = allowSplit && splitPayments.length > 0
      ? {
          method: 'mixed',
          amount: total,
          splits: [...splitPayments, payment],
        }
      : payment;

    onPaymentComplete(finalPayment);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.SALE_COMPLETED, { enabled: true, volume: 0.3 });
    }
  };

  // Remove split payment
  const handleRemoveSplit = (index) => {
    setSplitPayments(prev => prev.filter((_, i) => i !== index));
  };

  const remaining = getRemainingAmount();
  const change = selectedMethod === 'cash' ? calculateChange() : 0;
  const canConfirm = selectedMethod && (
    !paymentMethods[selectedMethod].requiresAmount ||
    parseFloat(cashReceived) >= remaining
  );

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Amount Display */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="text-sm text-base-content/70 mb-1">Total a pagar:</div>
        <div className="text-3xl font-bold text-success">
          {formatCurrency(remaining)}
        </div>
        
        {splitPayments.length > 0 && (
          <div className="mt-2 text-sm text-base-content/70">
            Original: {formatCurrency(total)}
          </div>
        )}
      </div>

      {/* Split Payments Display */}
      {splitPayments.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Pagos parciales:</div>
          {splitPayments.map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-base-200 rounded-lg p-3"
            >
              <div>
                <div className="font-medium">{paymentMethods[payment.method].name}</div>
                <div className="text-sm text-base-content/70">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSplit(index)}
                className="text-error"
              >
                Eliminar
              </TouchButton>
            </div>
          ))}
        </div>
      )}

      {/* Payment Method Buttons */}
      {!selectedMethod && (
        <div className="space-y-2">
          <div className="text-sm font-medium mb-2">Selecciona método de pago:</div>
          <div className="grid grid-cols-1 gap-3">
            {availableMethods.map((methodId) => {
              const method = paymentMethods[methodId];
              if (!method) return null;

              const Icon = method.icon;

              return (
                <TouchButton
                  key={methodId}
                  variant={method.color}
                  size="xl"
                  onClick={() => handleMethodSelect(methodId)}
                  icon={<Icon size={32} />}
                  hapticFeedback
                  className="justify-start text-left"
                >
                  <span className="text-xl font-semibold">{method.name}</span>
                </TouchButton>
              );
            })}
          </div>
        </div>
      )}

      {/* Cash Payment Input */}
      {selectedMethod === 'cash' && showKeypad && (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Monto recibido:</div>
            <div className="bg-base-100 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {cashReceived ? formatCurrency(parseFloat(cashReceived)) : formatCurrency(0)}
              </div>
              {cashReceived && parseFloat(cashReceived) >= remaining && (
                <div className="mt-2 text-success">
                  Cambio: {formatCurrency(change)}
                </div>
              )}
            </div>
          </div>

          <NumericKeypad
            value={cashReceived}
            onChange={handleCashAmountChange}
            allowDecimals={true}
            size="sm"
            soundEnabled={soundEnabled}
          />
        </div>
      )}

      {/* Non-cash Payment Confirmation */}
      {selectedMethod && selectedMethod !== 'cash' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">
              {paymentMethods[selectedMethod].name}
            </div>
            <div className="text-3xl font-bold text-success">
              {formatCurrency(remaining)}
            </div>
            <p className="text-sm text-base-content/70 mt-2">
              Procesa el pago en el terminal
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedMethod && (
        <div className="grid grid-cols-2 gap-3">
          <TouchButton
            variant="ghost"
            size="lg"
            onClick={() => {
              setSelectedMethod(null);
              setCashReceived('');
              setShowKeypad(false);
            }}
          >
            Cancelar
          </TouchButton>

          <TouchButton
            variant="success"
            size="lg"
            onClick={handleConfirmPayment}
            disabled={!canConfirm}
            icon={<FiCheck size={24} />}
            hapticFeedback
          >
            Confirmar
          </TouchButton>
        </div>
      )}
    </div>
  );
};

PaymentSelector.propTypes = {
  total: PropTypes.number.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
  availableMethods: PropTypes.arrayOf(PropTypes.string),
  allowSplit: PropTypes.bool,
  soundEnabled: PropTypes.bool,
};

export default PaymentSelector;
