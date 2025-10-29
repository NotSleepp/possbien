import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiPackage } from 'react-icons/fi';
import { formatCurrency } from '../../../shared/utils/formatters';
import TouchButton from '../../../shared/components/ui/TouchButton';

/**
 * ProductGrid Component
 * Responsive grid with virtual scrolling for large product lists
 * 
 * @param {Object} props
 * @param {Array} props.products - Products to display
 * @param {Function} props.onProductSelect - Product selection handler
 * @param {boolean} props.isLoading - Loading state
 * @param {number} props.columns - Number of columns (auto-calculated if not provided)
 * @param {boolean} props.showStock - Show stock information
 * @param {boolean} props.enableVirtualScroll - Enable virtual scrolling for large lists
 */
const ProductGrid = ({
  products = [],
  onProductSelect,
  isLoading = false,
  columns,
  showStock = true,
  enableVirtualScroll = true,
}) => {
  const containerRef = useRef(null);
  const [gridDimensions, setGridDimensions] = useState({
    width: 0,
    height: 0,
    columns: columns || 3,
  });

  // Calculate responsive columns based on container width
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      // Calculate columns based on width
      let calculatedColumns = columns;
      if (!columns) {
        if (width < 640) calculatedColumns = 2;
        else if (width < 768) calculatedColumns = 3;
        else if (width < 1024) calculatedColumns = 4;
        else if (width < 1280) calculatedColumns = 5;
        else calculatedColumns = 6;
      }

      setGridDimensions({
        width,
        height,
        columns: calculatedColumns,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [columns]);

  // Product Card Component
  const ProductCard = ({ product, onClick }) => {
    const isLowStock = product.stock_actual <= (product.stock_minimo || 5);
    const hasPromotion = product.tiene_promocion;

    return (
      <button
        onClick={() => onClick(product)}
        className="relative group w-full h-full flex flex-col border-2 border-base-300 rounded-xl hover:shadow-xl hover:border-primary hover:scale-[1.02] transition-all duration-200 bg-base-100 overflow-hidden"
      >
        {/* Badges - Posición fija */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {hasPromotion && (
            <span className="badge badge-success badge-sm font-semibold shadow-md">Promo</span>
          )}
          {isLowStock && (
            <span className="badge badge-warning badge-sm font-semibold shadow-md">Bajo</span>
          )}
        </div>

        {/* Product Image/Icon - Altura fija */}
        <div className="w-full h-40 bg-base-200 flex items-center justify-center overflow-hidden">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <FiPackage className="w-16 h-16 text-base-content/30" />
          )}
        </div>

        {/* Product Info - Altura fija y alineación consistente */}
        <div className="flex flex-col p-4 gap-2 flex-1">
          {/* Nombre - 2 líneas fijas */}
          <h3 
            className="font-semibold text-sm text-base-content text-center line-clamp-2 h-10 flex items-center justify-center" 
            title={product.nombre}
          >
            {product.nombre}
          </h3>
          
          {/* Precio - Siempre en la misma posición */}
          <p className="text-success font-bold text-xl text-center">
            {formatCurrency(product.precio_venta)}
          </p>

          {/* Stock - Siempre en la misma posición */}
          {showStock && (
            <p className={`text-xs font-medium text-center ${isLowStock ? 'text-warning' : 'text-base-content/60'}`}>
              Stock: {product.stock_actual}
            </p>
          )}
        </div>
      </button>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)` }}>
      {[...Array(gridDimensions.columns * 3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-base-300 aspect-square rounded-lg mb-2"></div>
          <div className="bg-base-300 h-4 rounded mb-1"></div>
          <div className="bg-base-300 h-4 rounded w-2/3 mx-auto"></div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-base-content/50">
      <FiPackage className="w-16 h-16 mb-4" />
      <p className="text-lg font-medium">No hay productos disponibles</p>
      <p className="text-sm">Ajusta la búsqueda o verifica el inventario</p>
    </div>
  );

  if (isLoading) {
    return (
      <div ref={containerRef} className="w-full h-full p-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <EmptyState />
      </div>
    );
  }

  // Regular grid (virtual scrolling disabled for compatibility)
  return (
    <div ref={containerRef} className="w-full h-full p-3">
      <div
        className="grid gap-3 auto-rows-fr"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.columns}, minmax(0, 1fr))`,
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="h-full min-h-[260px]">
            <ProductCard
              product={product}
              onClick={onProductSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.array,
  onProductSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  columns: PropTypes.number,
  showStock: PropTypes.bool,
  enableVirtualScroll: PropTypes.bool,
};

export default ProductGrid;
