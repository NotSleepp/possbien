import { useState, useMemo } from 'react';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import { useProducts } from '../features/products/hooks/useProducts';
import { ProductTable, ProductCard, ProductFilters, Pagination, EmptyState } from '../features/products';
import { Button, LoadingSpinner, Modal } from '../shared/components/ui';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const { products, isLoading, isError, error, deleteProduct, isDeleting } = useProducts();
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for delete confirmation modal
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchLower) ||
          product.codigo?.toLowerCase().includes(searchLower) ||
          product.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((product) => product.activo);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((product) => !product.activo);
    }

    return filtered;
  }, [products, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Handle edit product
  const handleEdit = (product) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit product:', product);
    alert('Funcionalidad de edición pendiente de implementación');
  };

  // Handle delete product
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle add product
  const handleAddProduct = () => {
    // TODO: Navigate to add product page or open add modal
    console.log('Add product');
    alert('Funcionalidad de agregar producto pendiente de implementación');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FiAlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Error al cargar productos</h3>
        </div>
        <p className="text-red-700 mb-4">
          {error?.userMessage || 'No se pudieron cargar los productos. Por favor, intenta nuevamente.'}
        </p>
        <Button variant="danger" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const hasFilters = searchTerm || statusFilter !== 'all';
  const hasProducts = products.length > 0;
  const hasFilteredProducts = filteredProducts.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Productos</h1>
          <p className="text-gray-600">
            Gestiona el inventario de productos del sistema
          </p>
        </div>
        {hasProducts && (
          <Button variant="primary" icon={<FiPlus />} onClick={handleAddProduct}>
            Agregar Producto
          </Button>
        )}
      </div>

      {/* Filters */}
      {hasProducts && (
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {!hasProducts ? (
          // Empty state - no products at all
          <div className="p-6">
            <EmptyState
              hasFilters={false}
              onAddProduct={handleAddProduct}
            />
          </div>
        ) : !hasFilteredProducts ? (
          // Empty state - no products match filters
          <div className="p-6">
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        ) : (
          <>
            {/* Desktop view - Table */}
            <div className="hidden md:block">
              <ProductTable
                products={paginatedProducts}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isDeleting={isDeleting}
              />
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden p-4 space-y-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title="Confirmar eliminación"
      >
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            ¿Estás seguro de que deseas eliminar el producto?
          </p>
          {productToDelete && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="font-semibold text-gray-900">{productToDelete.nombre}</p>
              <p className="text-sm text-gray-600">Código: {productToDelete.codigo}</p>
            </div>
          )}
          <p className="text-sm text-red-600 mt-4">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={isDeleting}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;