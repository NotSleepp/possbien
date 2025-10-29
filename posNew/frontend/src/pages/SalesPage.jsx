import React from 'react';
import CashRegisterOptimized from '../features/cash-register/components/CashRegisterOptimized';

const SalesPage = () => {
  // La página de Ventas ahora renderiza la Caja/POS optimizada

  return (
    <div className="h-full overflow-hidden">
      <CashRegisterOptimized />
    </div>
  );
};

export default SalesPage;