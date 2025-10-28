import { useState, useMemo } from 'react';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import { useProducts } from '../features/products/hooks/useProducts';
import { ProductTable, ProductCard, ProductFilters, Pagination, EmptyState } from '../features/products';
import { Button, LoadingSpinner, Modal } from '../shared/components/ui';
import { ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useCategories } from '../features/settings/hooks/useCategories';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const { products, isLoading, isError, error, deleteProduct, isDeleting, createProduct, isCreating, updateProduct, isUpdating } = useProducts();
  const user = useAuthStore((state) => state.user);
  const { success, error: showError } = useToastStore();
  const { categories = [] } = useCategories();
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for delete confirmation modal
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for create/edit modals and form
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    idEmpresa: user?.id_empresa || null,
    idCategoria: null,
    codigo: '',
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: '',
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = (categories || []).map((cat) => ({
    value: cat.id,
    label: `${cat.nombre} (${cat.codigo})`,
  }));

  const formFields = [
    { name: 'codigo', label: 'Código', type: 'text', placeholder: 'SKU-001', required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Nombre del producto', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Descripción del producto (opcional)', rows: 3 },
    { name: 'idCategoria', label: 'Categoría', type: 'select', required: true, options: categoryOptions, hint: 'Selecciona la categoría a la que pertenece' },
    { name: 'precioCompra', label: 'Precio de compra', type: 'number', placeholder: '0.00', required: true },
    { name: 'precioVenta', label: 'Precio de venta', type: 'number', placeholder: '0.00', required: true, hint: 'Debe ser mayor o igual al precio de compra' },
    { name: 'unidadMedida', label: 'Unidad de medida', type: 'text', placeholder: 'unidad, kg, lt, pack', hint: 'Define la unidad de medida (opcional)' },
    { name: 'stockActual', label: 'Stock actual', type: 'number', placeholder: '0', required: true },
    { name: 'stockMinimo', label: 'Stock mínimo', type: 'number', placeholder: '0', required: true },
  ];

  const resetForm = () => {
    setForm({
      idEmpresa: user?.id_empresa || null,
      idCategoria: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 0,
      unidadMedida: '',
    });
    setErrors({});
    setSelectedProduct(null);
  };

  const validateProduct = (values) => {
    const v = { ...values };
    const errs = {};
    if (!v.idEmpresa) errs.idEmpresa = 'Empresa no definida';
    if (!v.idCategoria) errs.idCategoria = 'La categoría es obligatoria';
    if (!v.codigo?.trim()) errs.codigo = 'El código es obligatorio';
    if (!v.nombre?.trim()) errs.nombre = 'El nombre es obligatorio';
    const compra = Number(v.precioCompra);
    const venta = Number(v.precioVenta);
    if (isNaN(compra) || compra < 0) errs.precioCompra = 'Precio de compra inválido';
    if (isNaN(venta) || venta < 0) errs.precioVenta = 'Precio de venta inválido';
    if (!errs.precioCompra && !errs.precioVenta && venta < compra) errs.precioVenta = 'El precio de venta debe ser ≥ compra';
    const stockA = Number(v.stockActual);
    const stockM = Number(v.stockMinimo);
    if (isNaN(stockA) || stockA < 0) errs.stockActual = 'Stock actual inválido';
    if (isNaN(stockM) || stockM < 0) errs.stockMinimo = 'Stock mínimo inválido';
    return errs;
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    setSelectedProduct(product);
    setForm({
      idEmpresa: user?.id_empresa || product.id_empresa || null,
      idCategoria: product.id_categoria ?? product.idCategoria ?? null,
      codigo: product.codigo || '',
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precioCompra: product.precio_compra ?? product.precioCompra ?? 0,
      precioVenta: product.precio_venta ?? product.precioVenta ?? 0,
      stockActual: product.stock_actual ?? product.stockActual ?? 0,
      stockMinimo: product.stock_minimo ?? product.stockMinimo ?? 0,
      unidadMedida: product.unidad_medida ?? product.unidadMedida ?? '',
    });
    setErrors({});
    setIsEditOpen(true);
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
    resetForm();
    setIsCreateOpen(true);
  };

  const handleSubmitCreate = () => {
    const numericForm = {
      ...form,
      idEmpresa: user?.id_empresa || form.idEmpresa,
      idCategoria: form.idCategoria ? Number(form.idCategoria) : null,
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      stockActual: Number(form.stockActual),
      stockMinimo: Number(form.stockMinimo),
    };
    const validationErrors = validateProduct(numericForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Por favor corrige los campos marcados.');
      return;
    }

    createProduct(numericForm, {
      onSuccess: () => {
        success('Producto creado exitosamente.');
        setIsCreateOpen(false);
        resetForm();
      },
      onError: (err) => {
        showError(err?.userMessage || 'Error al crear el producto.');
      },
    });
  };

  const handleSubmitEdit = () => {
    if (!selectedProduct?.id) return;
    const numericForm = {
      ...form,
      idEmpresa: user?.id_empresa || form.idEmpresa,
      idCategoria: form.idCategoria ? Number(form.idCategoria) : null,
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      stockActual: Number(form.stockActual),
      stockMinimo: Number(form.stockMinimo),
    };
    const validationErrors = validateProduct(numericForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Por favor corrige los campos marcados.');
      return;
    }

    updateProduct({ id: selectedProduct.id, payload: numericForm }, {
      onSuccess: () => {
        success('Producto actualizado exitosamente.');
        setIsEditOpen(false);
        resetForm();
      },
      onError: (err) => {
        showError(err?.userMessage || 'Error al actualizar el producto.');
      },
    });
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
      <div className="bg-error/10 border border-error/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FiAlertCircle className="w-5 h-5 text-error" />
          <h3 className="text-lg font-semibold text-error">Error al cargar productos</h3>
        </div>
        <p className="text-error/80 mb-4">
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
          <h1 className="text-2xl font-bold text-base-content mb-1">Productos</h1>
          <p className="text-base-content/60">
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
      <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
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
          <p className="text-base-content/80 mb-2">
            ¿Estás seguro de que deseas eliminar el producto?
          </p>
          {productToDelete && (
            <div className="bg-base-200 rounded-lg p-4 mt-4">
              <p className="font-semibold text-base-content">{productToDelete.nombre}</p>
              <p className="text-sm text-base-content/60">Código: {productToDelete.codigo}</p>
            </div>
          )}
          <p className="text-sm text-error mt-4">
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

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Producto"
        onConfirm={handleSubmitCreate}
        confirmText={isCreating ? 'Creando...' : 'Crear'}
      >
        <ConfigurationForm
          fields={formFields}
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmitCreate}
          isSubmitting={isCreating}
          errors={errors}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Producto"
        onConfirm={handleSubmitEdit}
        confirmText={isUpdating ? 'Guardando...' : 'Guardar cambios'}
      >
        <ConfigurationForm
          fields={formFields}
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmitEdit}
          isSubmitting={isUpdating}
          errors={errors}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;