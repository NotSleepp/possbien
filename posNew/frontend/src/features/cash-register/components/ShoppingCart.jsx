import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import TouchButton from '../../../shared/components/ui/TouchButton';
import { formatCurrency } from '../../../shared/utils/formatters';
import { playSound, SOUND_TYPES } from '../../../shared/utils/sound';

/**
 * ShoppingCart Component
 * Optimized cart with inline controls and real-time calculations
 * 
 * @param {Object} props
 * @param {Array} props.items - Cart items
 * @param {Function} props.onUpdateQuantity - Quantity update handler
 * @param {Function} props.onRemoveItem - Item removal handler
 * @param {Function} props.onClearCart - Clear cart handler
 * @param {boolean} props.showTax - Show tax calculation
 * @param {number} props.taxRate - Tax rate (default: 0.19 for 19%)
 * @param {boolean} props.soundEnabled - Enable sound feedback
 */
const ShoppingCart = ({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  showTax = true,
  taxRate = 0.19,
  soundEnabled = false,
}) => {
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.precio_venta * item.quantity), 0);
  const tax = showTax ? subtotal * taxRate : 0;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Handle quantity increase
  const handleIncrease = (item) => {
    // Check stock availability
    if (item.stock_available && item.quantity >= item.stock_available) {
      if (soundEnabled) {
        playSound(SOUND_TYPES.WARNING, { enabled: true, volume: 0.3 });
      }
      return;
    }

    setAnimatingItems(prev => new Set(prev).add(item.id));
    onUpdateQuantity(item.id, item.quantity + 1);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }

    setTimeout(() => {
      setAnimatingItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 300);
  };

  // Handle quantity decrease
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      handleRemove(item.id);
      return;
    }

    setAnimatingItems(prev => new Set(prev).add(item.id));
    onUpdateQuantity(item.id, item.quantity - 1);
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }

    setTimeout(() => {
      setAnimatingItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 300);
  };

  // Handle item removal
  const handleRemove = (itemId) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    if (soundEnabled) {
      playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
    }

    setTimeout(() => {
      onRemoveItem(itemId);
      setRemovingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, 300);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      onClearCart();
      
      if (soundEnabled) {
        playSound(SOUND_TYPES.BUTTON_CLICK, { enabled: true, volume: 0.2 });
      }
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/50 p-8">
        <FiShoppingCart className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium mb-2">El carrito está vacío</p>
        <p className="text-sm text-center">
          Selecciona productos para agregar al carrito
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Carrito de Compras</h3>
            <p className="text-sm text-base-content/70">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>
        
        {items.length > 0 && (
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            icon={<FiTrash2 />}
            className="text-error hover:bg-error/10"
          >
            Vaciar
          </TouchButton>
        )}
      </div>

      {/* Items List - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {items.map((item) => {
          const isAnimating = animatingItems.has(item.id);
          const isRemoving = removingItems.has(item.id);
          const isLowStock = item.stock_available && item.quantity >= item.stock_available;

          return (
            <div
              key={item.id}
              className={`
                border border-base-300 rounded-lg p-3 transition-all duration-300
                ${isAnimating ? 'scale-105 shadow-md' : ''}
                ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100'}
              `}
            >
              {/* Item Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h4 className="font-medium text-sm mb-1">{item.nombre}</h4>
                  <p className="text-success text-sm font-semibold">
                    {formatCurrency(item.precio_venta)}
                  </p>
                  {item.discount && (
                    <p className="text-xs text-warning">
                      Descuento: {item.discount.type === 'percentage' ? `${item.discount.value}%` : formatCurrency(item.discount.value)}
                    </p>
                  )}
                </div>
                
                <TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  icon={<FiTrash2 />}
                  className="text-error"
                  aria-label="Eliminar item"
                />
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecrease(item)}
                    icon={<FiMinus size={16} />}
                    hapticFeedback
                    aria-label="Disminuir cantidad"
                  />
                  
                  <span className="min-w-[40px] text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <TouchButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncrease(item)}
                    icon={<FiPlus size={16} />}
                    disabled={isLowStock}
                    hapticFeedback
                    aria-label="Aumentar cantidad"
                  />
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(item.precio_venta * item.quantity)}
                  </p>
                  {isLowStock && (
                    <p className="text-xs text-warning">Stock limitado</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals Summary - Always visible at bottom */}
      <div className="border-t-2 border-base-300 p-4 bg-base-200 space-y-2 flex-shrink-0">
        <div className="flex justify-between text-base">
          <span className="text-base-content/70 font-medium">Subtotal:</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>

        {showTax && (
          <div className="flex justify-between text-base">
            <span className="text-base-content/70 font-medium">IVA ({(taxRate * 100).toFixed(0)}%):</span>
            <span className="font-semibold">{formatCurrency(tax)}</span>
          </div>
        )}

        <div className="flex justify-between text-2xl font-bold border-t-2 border-base-300 pt-3 mt-2">
          <span>Total:</span>
          <span className="text-success">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

ShoppingCart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
      precio_venta: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      stock_available: PropTypes.number,
      discount: PropTypes.shape({
        type: PropTypes.oneOf(['percentage', 'fixed']),
        value: PropTypes.number,
      }),
    })
  ),
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  showTax: PropTypes.bool,
  taxRate: PropTypes.number,
  soundEnabled: PropTypes.bool,
};

export default ShoppingCart;
