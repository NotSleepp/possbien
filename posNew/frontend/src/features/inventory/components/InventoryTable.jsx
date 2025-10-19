import React from 'react';
import { Card, Button, Badge } from '../../../shared/components/ui';

const InventoryTable = ({ inventory = [], onUpdateStock, onViewDetails, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-base-300 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (inventory.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-base-content/70">
          <svg className="mx-auto h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-base-content">No hay productos en inventario</h3>
          <p className="mt-1 text-sm text-base-content/70">Agrega productos para comenzar a gestionar tu inventario.</p>
        </div>
      </Card>
    );
  }

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock === 0) {
      return { variant: 'error', text: 'Sin Stock', status: 'out-of-stock' };
    } else if (currentStock <= minStock) {
      return { variant: 'warning', text: 'Stock Bajo', status: 'low-stock' };
    } else {
      return { variant: 'success', text: 'En Stock', status: 'in-stock' };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-base-300">
          <thead className="bg-base-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Stock Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Stock Mínimo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-300">
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item.stock_actual, item.stock_minimo);
              
              return (
                <tr key={item.id} className="hover:bg-base-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-base-content">
                          {item.nombre}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {item.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                    {item.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                    <span className={`font-medium ${stockStatus.status === 'out-of-stock' ? 'text-error' : stockStatus.status === 'low-stock' ? 'text-warning' : 'text-success'}`}>
                      {item.stock_actual}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/70">
                    {item.stock_minimo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                    {formatCurrency(item.precio_venta)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStock(item)}
                    >
                      Actualizar Stock
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(item)}
                    >
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default InventoryTable;