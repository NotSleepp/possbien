import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../shared/components/ui';
import { useCashRegister } from '../hooks/useCashRegister';

const CashRegister = () => {
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    products,
    isLoading,
    processSale,
    isProcessing,
    searchProducts,
  } = useCashRegister();

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.precio_venta * item.quantity), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateTotal();
    return subtotal * 0.19; // 19% IVA
  };

  const handleProcessSale = async () => {
    if (cart.length === 0) return;

    const saleData = {
      items: cart.map(item => ({
        id_producto: item.id,
        cantidad: item.quantity,
        precio_unitario: item.precio_venta,
        subtotal: item.precio_venta * item.quantity,
      })),
      cliente_info: customerInfo,
      metodo_pago: paymentMethod,
      subtotal: calculateTotal(),
      impuestos: calculateTax(),
      total: calculateTotal() + calculateTax(),
    };

    try {
      await processSale(saleData);
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      setPaymentMethod('cash');
    } catch (error) {
      console.error('Error processing sale:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
      {/* Products Section */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="mb-4 p-4">
          <Input
            type="text"
            placeholder="Buscar productos por nombre o SKU..."
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            className="w-full"
          />
        </Card>

        <Card className="flex-1 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Productos</h2>
          </div>
          <div className="overflow-y-auto h-full p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="skeleton h-32 rounded-lg mb-2"></div>
                    <div className="skeleton h-4 rounded mb-1"></div>
                    <div className="skeleton h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              filteredProducts.length === 0 ? (
                <div className="text-center text-base-content/50">
                  <p>No hay productos para mostrar. Ajusta la búsqueda o verifica el stock.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => addToCart(product)}
                    >
                      <div className="bg-base-200 h-24 rounded-lg mb-2 flex items-center justify-center">
                        <svg className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-sm mb-1 truncate">{product.nombre}</h3>
                      <p className="text-success font-semibold text-sm">
                        {formatCurrency(product.precio_venta)}
                      </p>
                      <p className="text-base-content/50 text-xs">Stock: {product.stock_actual}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="flex flex-col">
        <Card className="flex-1 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Carrito de Compras</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-base-content/50 mt-8">
                <svg className="mx-auto h-12 w-12 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2a2 2 0 012 2v10.01M17 21v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
                <p className="mt-2">El carrito está vacío</p>
                <p className="text-sm">Selecciona productos para agregar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.nombre}</h4>
                      <p className="text-success text-sm">{formatCurrency(item.precio_venta)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="red"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Información del Cliente (Opcional)</h3>
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={customerInfo.name}
                  onChange={(value) => setCustomerInfo({ ...customerInfo, name: value })}
                  size="sm"
                />
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  value={customerInfo.phone}
                  onChange={(value) => setCustomerInfo({ ...customerInfo, phone: value })}
                  size="sm"
                />
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-medium text-sm mb-2">Método de Pago</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">Transferencia</option>
                </select>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%):</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal() + calculateTax())}</span>
                </div>
              </div>

              <Button
                onClick={handleProcessSale}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Procesando...' : 'Procesar Venta'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CashRegister;