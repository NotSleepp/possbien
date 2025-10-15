import { FiPackage, FiPlus } from 'react-icons/fi';
import Button from '../ui/Button';

/**
 * EmptyState Component
 * Displayed when no products are found
 */
const EmptyState = ({ hasFilters, onClearFilters, onAddProduct }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiPackage className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-gray-600 mb-6">
          No hay productos que coincidan con los filtros aplicados.
        </p>
        <Button variant="secondary" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiPackage className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No hay productos registrados
      </h3>
      <p className="text-gray-600 mb-6">
        Comienza agregando tu primer producto al inventario.
      </p>
      <Button variant="primary" icon={<FiPlus />} onClick={onAddProduct}>
        Agregar Producto
      </Button>
    </div>
  );
};

export default EmptyState;
