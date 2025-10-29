import { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../shared/components/ui';
import { useCashRegister } from '../hooks/useCashRegister';
import { useToastStore } from '../../../store/useToastStore';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';
import SearchBar from '../../../shared/components/forms/SearchBar';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';
import PaymentSelector from './PaymentSelector';
import DiscountModal from './DiscountModal';
import Modal from '../../../shared/components/ui/Modal';
import TouchButton from '../../../shared/components/ui/TouchButton';
import { FiDollarSign, FiPercent, FiShoppingCart } from 'react-icons/fi';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * CashRegisterOptimized Component
 * Refactored POS interface with all optimizations
 */
const CashRegisterOptimized = () => {
  // State
  const [cart, setCart] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });

  // Hooks
  const { user } = useAuthStore();
  const { success, error: showError } = useToastStore();
  const {
    products,
    isLoading,
    processSale,
    isProcessing,
    searchProducts,
  } = useCashRegister();

  // Initialize search results with all products
  useEffect(() => {
    setSearchResults(products);
  }, [products]);

  // Handle product search
  const handleSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults(products);
      return;
    }

    try {
      const results = await searchProducts(term);
      setSearchResults(results);
    } catch (err) {
      // Fallback to local search
      const filtered = products.filter(product =>
        product.nombre?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo_barras?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [products, searchProducts]);

  // Handle product selection from search
  const handleProductSelect = useCallback((product) => {
    addToCart(product);
  }, []);

  // Add product to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { 
        ...product, 
        quantity,
        stock_available: product.stock_actual,
      }];
    });

    success(`${product.nombre} agregado al carrito`);
  }, [success]);

  // Update cart item quantity
  const handleUpdateQuantity = useCallback((itemId, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== itemId);
      }

      return prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, []);

  // Remove item from cart
  const handleRemoveItem = useCallback((itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  // Clear cart
  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.precio_venta * item.quantity), 0);
  const tax = subtotal * 0.19;
  const discount = cart.reduce((sum, item) => {
    if (item.discount) {
      const discountAmount = item.discount.type === 'percentage'
        ? (item.precio_venta * item.quantity * item.discount.value) / 100
        : item.discount.value;
      return sum + discountAmount;
    }
    return sum;
  }, 0);
  const total = subtotal + tax - discount;

  // Handle discount application
  const handleApplyDiscount = useCallback((discountData) => {
    // Apply discount to entire cart (simplified - could be per item)
    setCart(prevCart => prevCart.map(item => ({
      ...item,
      discount: discountData,
    })));

    success('Descuento aplicado correctamente');
  }, [success]);

  // Handle payment completion
  const handlePaymentComplete = async (payment) => {
    if (cart.length === 0) return;

    const saleData = {
      items: cart.map(item => ({
        id_producto: item.id,
        cantidad: item.quantity,
        precio_unitario: item.precio_venta,
        subtotal: item.precio_venta * item.quantity,
        descuento: item.discount || null,
      })),
      cliente_info: customerInfo,
      payment: payment,
      subtotal: subtotal,
      impuestos: tax,
      descuento: discount,
      total: total,
    };

    try {
      await processSale(saleData);
      
      // Reset state
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      setShowPayment(false);
      
      success('¡Venta procesada exitosamente!', {
        duration: 3000,
        action: {
          label: 'Imprimir recibo',
          onClick: () => console.log('Print receipt'),
        },
      });
    } catch (err) {
      showError('Error al procesar la venta. Intenta nuevamente.');
      console.error('Error processing sale:', err);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': () => document.querySelector('input[type="text"]')?.focus(),
    'ctrl+p': () => cart.length > 0 && setShowPayment(true),
    'ctrl+d': () => cart.length > 0 && setShowDiscount(true),
    'ctrl+n': () => {
      setCart([]);
      setShowPayment(false);
    },
    'escape': () => {
      setShowPayment(false);
      setShowDiscount(false);
    },
  });

  return (
    <div className="h-full flex flex-col bg-base-200 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 overflow-hidden min-h-0">
        {/* Products Section - 2/3 width on desktop */}
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0 h-full">
          {/* Search Bar - Fixed height */}
          <div className="flex-shrink-0">
            <Card className="p-4 shadow-lg">
              <SearchBar
                onSearch={handleSearch}
                onResultSelect={handleProductSelect}
                results={searchResults}
                placeholder="Buscar productos (Ctrl+K)..."
                autoFocus
                enableBarcode
                soundEnabled
              />
            </Card>
          </div>

          {/* Product Grid - Takes remaining space with internal scroll */}
          <div className="flex-1 min-h-0">
            <Card className="h-full shadow-lg flex flex-col">
              <div className="p-4 border-b border-base-300 bg-base-200 flex-shrink-0">
                <h2 className="text-lg font-bold text-base-content">Productos Disponibles</h2>
                <p className="text-xs text-base-content/70 mt-1">
                  {searchResults.length} productos
                </p>
              </div>
              <div className="flex-1 overflow-auto">
                <ProductGrid
                  products={searchResults}
                  onProductSelect={addToCart}
                  isLoading={isLoading}
                  showStock
                  enableVirtualScroll
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Cart Section - 1/3 width on desktop */}
        <div className="flex flex-col gap-3 min-h-0 h-full">
          {/* Cart - Takes most space with internal scroll */}
          <div className="flex-1 min-h-0">
            <Card className="h-full shadow-lg flex flex-col">
              <ShoppingCart
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                showTax
                taxRate={0.19}
                soundEnabled
              />
            </Card>
          </div>

          {/* Action Buttons - Always visible at bottom */}
          {cart.length > 0 && (
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <TouchButton
                variant="secondary"
                size="lg"
                onClick={() => setShowDiscount(true)}
                icon={<FiPercent size={20} />}
                hapticFeedback
                className="font-bold"
              >
                Descuento
              </TouchButton>

              <TouchButton
                variant="success"
                size="lg"
                onClick={() => setShowPayment(true)}
                icon={<FiDollarSign size={20} />}
                hapticFeedback
                className="font-bold"
              >
                Pagar
              </TouchButton>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        title="Procesar Pago"
      >
        <PaymentSelector
          total={total}
          onPaymentComplete={handlePaymentComplete}
          availableMethods={['cash', 'card', 'transfer']}
          allowSplit
          soundEnabled
        />
      </Modal>

      {/* Discount Modal */}
      <DiscountModal
        isOpen={showDiscount}
        onClose={() => setShowDiscount(false)}
        currentTotal={total}
        onApplyDiscount={handleApplyDiscount}
        requiresAuthorization
        maxDiscountPercent={10}
        user={user}
      />
    </div>
  );
};

export default CashRegisterOptimized;
