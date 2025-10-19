import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { Card, Button, Badge } from '../../../shared/components/ui';

/**
 * ProductCard Component
 * Displays product information in card format (mobile view)
 */
const ProductCard = ({ product, onEdit, onDelete, isDeleting }) => {
  const isLowStock = (product.stock_actual || 0) <= (product.stock_minimo || 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base-content">{product.nombre}</h3>
            <p className="text-sm text-base-content/70">Código: {product.codigo}</p>
          </div>
        </div>
        <Badge variant={product.activo ? 'success' : 'danger'}>
          {product.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      {product.descripcion && (
        <p className="text-sm text-base-content/70 mb-3 line-clamp-2">{product.descripcion}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-base-content/60 mb-1">Precio</p>
          <p className="text-lg font-semibold text-base-content">
            ${parseFloat(product.precio_venta || 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-base-content/60 mb-1">Stock</p>
          <p
            className={`text-lg font-semibold ${
              isLowStock ? 'text-error' : 'text-base-content'
            }`}
          >
            {product.stock_actual || 0}
            {isLowStock && (
              <span className="text-xs ml-1 text-error">(Bajo)</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-base-300">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(product)}
          icon={<FiEdit2 />}
          className="flex-1"
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(product)}
          icon={<FiTrash2 />}
          isLoading={isDeleting}
          className="flex-1"
        >
          Eliminar
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
