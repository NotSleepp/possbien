import { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Button, Badge } from '../../../shared/components/ui';

/**
 * ProductTable Component
 * Displays products in a sortable table format (desktop view)
 */
const ProductTable = ({ products, onEdit, onDelete, isDeleting, stockSummary }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle column sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort products based on current sort configuration
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Render sort icon
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FiChevronUp className="opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-200">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-200 transition-colors"
              onClick={() => handleSort('codigo')}
            >
              <div className="flex items-center gap-2">
                Código
                <SortIcon columnKey="codigo" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-200 transition-colors"
              onClick={() => handleSort('nombre')}
            >
              <div className="flex items-center gap-2">
                Nombre
                <SortIcon columnKey="nombre" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-200 transition-colors"
              onClick={() => handleSort('precio_venta')}
            >
              <div className="flex items-center gap-2">
                Precio
                <SortIcon columnKey="precio_venta" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider cursor-pointer hover:bg-base-200 transition-colors"
              onClick={() => handleSort('stock_actual')}
            >
              <div className="flex items-center gap-2">
                Stock
                <SortIcon columnKey="stock_actual" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
              Inventario por almacén
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-base-content/70 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-base-100 divide-y divide-base-300">
          {sortedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-base-200 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                {product.codigo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-base-content">{product.nombre}</div>
                {product.descripcion && (
                  <div className="text-sm text-base-content/70 truncate max-w-xs">
                    {product.descripcion}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                ${parseFloat(product.precio_venta || 0).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                <span
                  className={`font-medium ${
                    (product.stock_actual || 0) <= (product.stock_minimo || 0)
                      ? 'text-error'
                      : 'text-base-content'
                  }`}
                >
                  {product.stock_actual || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={product.activo ? 'success' : 'danger'}>
                  {product.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content">
                <div className="flex flex-wrap gap-2 max-w-[420px]">
                  {(stockSummary?.[product.id] || []).length > 0 ? (
                    stockSummary[product.id].map((item, idx) => (
                      <Badge key={idx} variant="secondary">
                        {item.label}: {item.cantidad}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-base-content/60">—</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    icon={<FiEdit2 />}
                    aria-label="Editar producto"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(product)}
                    icon={<FiTrash2 />}
                    isLoading={isDeleting}
                    aria-label="Eliminar producto"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
