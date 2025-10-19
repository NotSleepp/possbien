import React from 'react';
import { Card, Button, Badge } from '../../../shared/components/ui';

const SalesTable = ({ sales = [], onViewDetails, onDeleteSale, isLoading }) => {
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

  if (sales.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-base-content/70">
          <svg className="mx-auto h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-base-content">No hay ventas</h3>
          <p className="mt-1 text-sm text-base-content/70">Comienza creando tu primera venta.</p>
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', text: 'Completada' },
      pending: { variant: 'warning', text: 'Pendiente' },
      cancelled: { variant: 'error', text: 'Cancelada' },
    };

    const config = statusConfig[status] || { variant: 'neutral', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-base-300">
          <thead className="bg-base-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                ID Venta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Total
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
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-base-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                  #{sale.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                  {sale.cliente_nombre || 'Cliente General'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/70">
                  {formatDate(sale.fecha_venta)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                  {formatCurrency(sale.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(sale.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(sale)}
                  >
                    Ver Detalles
                  </Button>
                  {sale.estado !== 'completed' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteSale(sale.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SalesTable;