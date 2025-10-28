import { useState, useMemo, useEffect } from 'react';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import { useProducts } from '../features/products/hooks/useProducts';
import { ProductTable, ProductCard, ProductFilters, Pagination, EmptyState } from '../features/products';
import { Button, LoadingSpinner, Modal } from '../shared/components/ui';
import { ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { useCategories } from '../features/settings/hooks/useCategories';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import { listWarehousesByBranch, getWarehouse } from '../features/settings/api/warehouses.api';
import { createStock, updateStock, getStocksByProduct } from '../features/inventory/api/stocks.api';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const { products, isLoading, isError, error, deleteProduct, isDeleting, createProduct, isCreating, updateProduct, isUpdating, refetch } = useProducts();
  const user = useAuthStore((state) => state.user);
  const { success, error: showError } = useToastStore();
  const { categories = [] } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    idEmpresa: user?.id_empresa || null,
    idCategoria: null,
    idSucursal: '',
    idAlmacen: '',
    codigo: '',
    codigoBarras: '',
    codigoInterno: '',
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: '',
    sevendePor: '',
    manejaInventarios: true,
    manejaMultiprecios: false,
    imagenUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [branchOptions, setBranchOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseCache, setWarehouseCache] = useState({}); // idAlmacen -> warehouse detail
  const [stockSummary, setStockSummary] = useState({}); // productId -> [{ label, cantidad }]
  const [summaryRefresh, setSummaryRefresh] = useState(0); // trigger manual rebuild after save

  const categoryOptions = (categories || []).map((cat) => ({
    value: cat.id,
    label: `${cat.nombre} (${cat.codigo})`,
  }));

  const baseFields = [
    { name: 'codigo', label: 'Código', type: 'text', placeholder: 'SKU-001', required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Nombre del producto', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Descripción del producto (opcional)', rows: 3 },
    { name: 'idCategoria', label: 'Categoría', type: 'select', required: true, options: categoryOptions, hint: 'Selecciona la categoría a la que pertenece' },
    { name: 'precioCompra', label: 'Precio de compra', type: 'number', placeholder: '0.00', required: true },
    { name: 'precioVenta', label: 'Precio de venta', type: 'number', placeholder: '0.00', required: true, hint: 'Debe ser mayor o igual al precio de compra' },
    { name: 'unidadMedida', label: 'Unidad de medida', type: 'text', placeholder: 'unidad, kg, lt, pack', hint: 'Define la unidad de medida (opcional)' },
    { name: 'codigoBarras', label: 'Código de barras', type: 'text', placeholder: 'EAN/UPC (opcional)' },
    { name: 'codigoInterno', label: 'Código interno', type: 'text', placeholder: 'Código interno (opcional)' },
    { name: 'sevendePor', label: 'Se vende por', type: 'text', placeholder: 'unidad, paquete, caja (opcional)' },
    { name: 'manejaInventarios', label: 'Maneja inventarios', type: 'checkbox', hint: 'Habilita control por almacenes y stock' },
    { name: 'manejaMultiprecios', label: 'Maneja multiprecios', type: 'checkbox', hint: 'Permite múltiples niveles de precio' },
    { name: 'imagenUrl', label: 'URL de imagen', type: 'text', placeholder: 'https://...' },
    { name: 'stockActual', label: 'Stock actual', type: 'number', placeholder: '0', required: true },
    { name: 'stockMinimo', label: 'Stock mínimo', type: 'number', placeholder: '0', required: true },
  ];

  const inventoryFields = form.manejaInventarios
    ? [
        { name: 'idSucursal', label: 'Sucursal para stock inicial', type: 'select', options: branchOptions, hint: 'Requerido si defines stock inicial > 0' },
        { name: 'idAlmacen', label: 'Almacén para stock inicial', type: 'select', options: warehouseOptions, hint: 'Selecciona el almacén para el stock inicial' },
      ]
    : [];

  const formFields = [...baseFields, ...inventoryFields];

  const resetForm = () => {
    setForm({
      idEmpresa: user?.id_empresa || null,
      idCategoria: null,
      idSucursal: '',
      idAlmacen: '',
      codigo: '',
      codigoBarras: '',
      codigoInterno: '',
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 0,
      unidadMedida: '',
      sevendePor: '',
      manejaInventarios: true,
      manejaMultiprecios: false,
      imagenUrl: '',
    });
    setErrors({});
    setSelectedProduct(null);
    setWarehouseOptions([]);
  };

  const validateProduct = (values) => {
    const v = { ...values };
    console.log('[ProductsPage] validateProduct INPUT', v);
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
    if (v.manejaInventarios && stockA > 0) {
      if (!v.idSucursal) errs.idSucursal = 'Selecciona la sucursal para el stock inicial';
      if (!v.idAlmacen) errs.idAlmacen = 'Selecciona el almacén para el stock inicial';
    }
    console.log('[ProductsPage] validateProduct OUTPUT errors', errs);
    return errs;
  };

  const handleChange = (name, value) => {
    console.log('[ProductsPage] handleChange', { name, value, type: typeof value });
    setForm((prev) => {
      // Al cambiar sucursal, limpiar almacén para evitar valores inválidos
      if (name === 'idSucursal') {
        return { ...prev, idSucursal: value, idAlmacen: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchLower) ||
          product.codigo?.toLowerCase().includes(searchLower) ||
          product.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter((product) => product.activo);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((product) => !product.activo);
    }

    return filtered;
  }, [products, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    const total = Array.isArray(products) ? products.length : 0;
    const filtered = Array.isArray(filteredProducts) ? filteredProducts.length : 0;
    const paginated = Array.isArray(paginatedProducts) ? paginatedProducts.length : 0;
    console.log('[ProductsPage] METRICS', {
      total,
      filtered,
      paginated,
      currentPage,
      perPage: ITEMS_PER_PAGE,
      searchTerm,
      statusFilter,
    });
  }, [products, filteredProducts, paginatedProducts, currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (value) => {
    console.log('[ProductsPage] handleSearchChange', { value });
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    console.log('[ProductsPage] handleStatusFilterChange', { value });
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    console.log('[ProductsPage] handleClearFilters');
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    console.log('[ProductsPage] handleEdit START', { product });
    const nextForm = {
      idEmpresa: user?.id_empresa || product.id_empresa || null,
      idCategoria: product.id_categoria ?? product.idCategoria ?? null,
      idSucursal: '',
      idAlmacen: '',
      codigo: product.codigo || '',
      codigoBarras: product.codigo_barras ?? product.codigoBarras ?? '',
      codigoInterno: product.codigo_interno ?? product.codigoInterno ?? '',
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precioCompra: product.precio_compra ?? product.precioCompra ?? 0,
      precioVenta: product.precio_venta ?? product.precioVenta ?? 0,
      stockActual: product.stock_actual ?? product.stockActual ?? 0,
      stockMinimo: product.stock_minimo ?? product.stockMinimo ?? 0,
      unidadMedida: product.unidad_medida ?? product.unidadMedida ?? '',
      sevendePor: product.sevende_por ?? product.sevendePor ?? '',
      manejaInventarios: (product.maneja_inventarios ?? product.manejaInventarios ?? true) ? true : false,
      manejaMultiprecios: (product.maneja_multiprecios ?? product.manejaMultiprecios ?? false) ? true : false,
      imagenUrl: product.imagen_url ?? product.imagenUrl ?? '',
    };
    console.log('[ProductsPage] handleEdit nextForm', nextForm);
    setSelectedProduct(product);
    setForm(nextForm);
    setErrors({});
    setIsEditOpen(true);

    // Prefill idSucursal / idAlmacen si existe un único stock
    (async () => {
      try {
        const stocks = await getStocksByProduct(product.id);
        const list = Array.isArray(stocks) ? stocks : [];
        console.log('[ProductsPage] handleEdit stocks list:', list);
        if (list.length === 1 && list[0]?.idAlmacen) {
          const idAlmacen = Number(list[0].idAlmacen ?? list[0].id_almacen);
          const wh = await getWarehouse(idAlmacen);
          const idSucursal = Number(wh?.id_sucursal ?? wh?.idSucursal);
          console.log('[ProductsPage] handleEdit prefill:', { idSucursal, idAlmacen, warehouse: wh });
          setForm((prev) => ({
            ...prev,
            idSucursal: idSucursal || prev.idSucursal || '',
            idAlmacen: idAlmacen || prev.idAlmacen || '',
          }));
        }
      } catch (e) {
        console.error('[ProductsPage] handleEdit prefill error', e);
      }
    })();
  };

  const handleDeleteClick = (product) => {
    console.log('[ProductsPage] handleDeleteClick', { product });
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log('[ProductsPage] handleConfirmDelete', { productToDelete });
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          console.log('[ProductsPage] deleteProduct onSuccess');
          setShowDeleteModal(false);
          setProductToDelete(null);
          // tras eliminar, refrescar productos y resumen
          refetch?.().catch((e) => console.warn('[ProductsPage] refetch after delete failed', e));
          setSummaryRefresh((v) => v + 1);
        },
        onError: (err) => {
          console.error('[ProductsPage] deleteProduct onError', err);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    console.log('[ProductsPage] handleCancelDelete');
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleAddProduct = () => {
    console.log('[ProductsPage] handleAddProduct');
    resetForm();
    setIsCreateOpen(true);
  };

  // Cargar sucursales al abrir modal de creación o edición
  useEffect(() => {
    const loadBranches = async () => {
      try {
        if (!user?.id_empresa) return;
        const data = await listBranchesByEmpresa(user.id_empresa);
        const options = (Array.isArray(data) ? data : []).map((b) => ({ value: b.id, label: `${b.nombre} (${b.codigo || b.id})` }));
        setBranchOptions(options);
      } catch (e) {
        console.error('[ProductsPage] loadBranches error', e);
      }
    };
    if (isCreateOpen || isEditOpen) loadBranches();
  }, [isCreateOpen, isEditOpen, user?.id_empresa]);

  // Cargar almacenes cuando cambia la sucursal
  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        if (!form.idSucursal) {
          setWarehouseOptions([]);
          return;
        }
        const data = await listWarehousesByBranch(form.idSucursal);
        const options = (Array.isArray(data) ? data : []).map((w) => ({ value: w.id, label: `${w.nombre} (${w.codigo || w.id})` }));
        setWarehouseOptions(options);
      } catch (e) {
        console.error('[ProductsPage] loadWarehouses error', e);
        setWarehouseOptions([]);
      }
    };
    loadWarehouses();
  }, [form.idSucursal]);

  // Construir resumen de stock por almacén para productos paginados
  useEffect(() => {
    let cancelled = false;
    const buildSummary = async () => {
      try {
        const ids = (paginatedProducts || []).map((p) => p.id);
        console.log('[ProductsPage] buildSummary - product ids:', ids);
        const stocksLists = await Promise.all(
          ids.map((id) =>
            getStocksByProduct(id)
              .then((res) => (Array.isArray(res) ? res : []))
              .catch((err) => {
                console.error('[ProductsPage] buildSummary getStocksByProduct error', { id, err });
                return [];
              })
          )
        );

        // Recolectar almacenes necesarios
        const neededWarehouseIds = new Set();
        stocksLists.forEach((list) => {
          list.forEach((s) => {
            const idA = Number(s.idAlmacen ?? s.id_almacen);
            if (idA) neededWarehouseIds.add(idA);
          });
        });

        // Completar cache de almacenes
        const cache = { ...warehouseCache };
        await Promise.all(
          Array.from(neededWarehouseIds).map(async (idA) => {
            if (!cache[idA]) {
              try {
                const wh = await getWarehouse(idA);
                cache[idA] = wh;
              } catch (e) {
                console.error('[ProductsPage] buildSummary getWarehouse error', { idA, e });
              }
            }
          })
        );

        // Armar resumen por producto
        const summaryMap = {};
        stocksLists.forEach((list, idx) => {
          const pid = ids[idx];
          const items = list.map((s) => {
            const idA = Number(s.idAlmacen ?? s.id_almacen);
            const wh = cache[idA];
            const label = wh ? `${wh.nombre} (${wh.codigo || wh.id})` : `Almacén #${idA}`;
            const cantidad = Number(s.cantidadActual ?? s.cantidad_actual ?? 0);
            return { label, cantidad };
          });
          summaryMap[pid] = items;
        });

        if (!cancelled) {
          setWarehouseCache(cache);
          setStockSummary(summaryMap);
        }
      } catch (e) {
        console.error('[ProductsPage] buildSummary unexpected error', e);
      }
    };

    buildSummary();
    return () => {
      cancelled = true;
    };
  }, [paginatedProducts, summaryRefresh]);

  const handleSubmitCreate = () => {
    console.group('[ProductsPage] CREATE product flow');
    console.log('[ProductsPage] Raw form (pre-normalization):', JSON.parse(JSON.stringify(form)));
    const numericForm = {
      ...form,
      idEmpresa: user?.id_empresa || form.idEmpresa,
      idCategoria: form.idCategoria ? Number(form.idCategoria) : null,
      idSucursal: form.idSucursal ? Number(form.idSucursal) : undefined,
      idAlmacen: form.idAlmacen ? Number(form.idAlmacen) : undefined,
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      stockActual: Number(form.stockActual),
      stockMinimo: Number(form.stockMinimo),
    };
    console.table({
      idEmpresa: numericForm.idEmpresa,
      idCategoria: numericForm.idCategoria,
      idSucursal: numericForm.idSucursal,
      idAlmacen: numericForm.idAlmacen,
      precioCompra: numericForm.precioCompra,
      precioVenta: numericForm.precioVenta,
      stockActual: numericForm.stockActual,
      stockMinimo: numericForm.stockMinimo,
      manejaInventarios: numericForm.manejaInventarios,
    });
    const validationErrors = validateProduct(numericForm);
    console.log('[ProductsPage] Validation errors:', validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Por favor corrige los campos marcados.');
      console.groupEnd();
      return;
    }

    createProduct(numericForm, {
      onSuccess: async (created) => {
        console.group('[ProductsPage] createProduct onSuccess');
        console.log('[ProductsPage] Backend response (created):', created);
        const createdId = created?.id || created?.datos?.id;
        const shouldCreateInitialStock = Boolean(
          numericForm.manejaInventarios && numericForm.stockActual > 0 && numericForm.idAlmacen
        );
        console.log('[ProductsPage] createdId:', createdId);
        console.log('[ProductsPage] shouldCreateInitialStock:', shouldCreateInitialStock);
        if (!numericForm.idAlmacen) {
          console.warn('[ProductsPage] No idAlmacen seleccionado: no se creará stock inicial.');
        }
        if (createdId && shouldCreateInitialStock) {
          try {
            const stockPayload = {
              idEmpresa: numericForm.idEmpresa,
              idProducto: createdId,
              idAlmacen: numericForm.idAlmacen,
              cantidadActual: numericForm.stockActual,
              stockMinimo: numericForm.stockMinimo,
            };
            console.group('[ProductsPage] createStock request');
            console.log('[ProductsPage] stockPayload:', stockPayload);
            await createStock({
              ...stockPayload,
            });
            console.groupEnd();
            success('Producto y stock inicial creados.');
          } catch (err) {
            console.error('[ProductsPage] createStock error', err);
            showError('Producto creado, pero falló crear el stock inicial.');
          }
        } else {
          success('Producto creado exitosamente.');
        }
        console.groupEnd();
        try {
          await refetch();
        } catch (e) {
          console.warn('[ProductsPage] refetch after create failed', e);
        }
        setSummaryRefresh((v) => v + 1);
        setIsCreateOpen(false);
        resetForm();
        console.groupEnd();
      },
      onError: (err) => {
        console.error('[ProductsPage] createProduct onError', err);
        showError(err?.userMessage || 'Error al crear el producto.');
        console.groupEnd();
      },
    });
  };

  const handleSubmitEdit = () => {
    if (!selectedProduct?.id) return;
    console.log('[ProductsPage] handleSubmitEdit START', { form, selectedProduct });
    const numericForm = {
      ...form,
      idEmpresa: user?.id_empresa || form.idEmpresa,
      idCategoria: form.idCategoria ? Number(form.idCategoria) : null,
      idSucursal: form.idSucursal ? Number(form.idSucursal) : undefined,
      idAlmacen: form.idAlmacen ? Number(form.idAlmacen) : undefined,
      precioCompra: Number(form.precioCompra),
      precioVenta: Number(form.precioVenta),
      stockActual: Number(form.stockActual),
      stockMinimo: Number(form.stockMinimo),
    };
    console.log('[ProductsPage] handleSubmitEdit numericForm', numericForm);
    const validationErrors = validateProduct(numericForm);
    console.log('[ProductsPage] handleSubmitEdit validationErrors', validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Por favor corrige los campos marcados.');
      return;
    }

    updateProduct({ id: selectedProduct.id, payload: numericForm }, {
      onSuccess: async () => {
        console.log('[ProductsPage] updateProduct onSuccess');
        let inventoryMessage = '';
        try {
          if (numericForm.manejaInventarios) {
            const stocks = await getStocksByProduct(selectedProduct.id);
            const list = Array.isArray(stocks) ? stocks : [];
            const byWarehouse = numericForm.idAlmacen
              ? list.find((s) => Number(s.idAlmacen ?? s.id_almacen) === Number(numericForm.idAlmacen))
              : undefined;
            const single = list.length === 1 ? list[0] : null;

            if (numericForm.idAlmacen) {
              if (byWarehouse) {
                await updateStock(byWarehouse.id, {
                  idEmpresa: numericForm.idEmpresa,
                  idProducto: selectedProduct.id,
                  idAlmacen: numericForm.idAlmacen,
                  cantidadActual: numericForm.stockActual,
                  stockMinimo: numericForm.stockMinimo,
                });
                inventoryMessage = ' e inventario actualizado.';
              } else if (single && Number(single.idAlmacen ?? single.id_almacen) !== Number(numericForm.idAlmacen)) {
                // Si existe un único registro de stock y se eligió otro almacén, mover el registro
                await updateStock(single.id, {
                  idEmpresa: numericForm.idEmpresa,
                  idProducto: selectedProduct.id,
                  idAlmacen: numericForm.idAlmacen,
                  cantidadActual: numericForm.stockActual,
                  stockMinimo: numericForm.stockMinimo,
                });
                inventoryMessage = ' e inventario movido al nuevo almacén.';
              } else {
                // No había registro en ese almacén y no es un caso de mover; crear adicional
                await createStock({
                  idEmpresa: numericForm.idEmpresa,
                  idProducto: selectedProduct.id,
                  idAlmacen: numericForm.idAlmacen,
                  cantidadActual: numericForm.stockActual,
                  stockMinimo: numericForm.stockMinimo,
                });
                inventoryMessage = ' e inventario creado.';
              }
            } else if (list.length === 1 && list[0]?.idAlmacen) {
              // Si no se seleccionó almacén pero existe un único registro de stock, lo actualizamos
              await updateStock(list[0].id, {
                idEmpresa: numericForm.idEmpresa,
                idProducto: selectedProduct.id,
                idAlmacen: list[0].idAlmacen,
                cantidadActual: numericForm.stockActual,
                stockMinimo: numericForm.stockMinimo,
              });
              inventoryMessage = ' e inventario actualizado.';
            }
          }
        } catch (invErr) {
          console.error('[ProductsPage] inventory update on edit error', invErr);
          // No bloqueamos la actualización del producto si el stock falla
          inventoryMessage = ' (inventario no pudo sincronizarse).';
        }

        success(`Producto actualizado exitosamente${inventoryMessage}`);
        try {
          await refetch();
        } catch (e) {
          console.warn('[ProductsPage] refetch after update failed', e);
        }
        setSummaryRefresh((v) => v + 1);
        setIsEditOpen(false);
        resetForm();
      },
      onError: (err) => {
        console.error('[ProductsPage] updateProduct onError', err);
        showError(err?.userMessage || 'Error al actualizar el producto.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content mb-1">Productos</h1>
          <p className="text-base-content/60">
            Gestiona el inventario de productos del sistema
          </p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={handleAddProduct}>
          Agregar Producto
        </Button>
      </div>

      {hasProducts && (
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />
      )}

      <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
        {!hasProducts ? (
          <div className="p-6">
            <EmptyState
              showAddButton={true}
              onAddClick={handleAddProduct}
            />
          </div>
        ) : !hasFilteredProducts ? (
          <div className="p-6">
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <ProductTable
                products={paginatedProducts}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isDeleting={isDeleting}
                stockSummary={stockSummary}
              />
            </div>

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