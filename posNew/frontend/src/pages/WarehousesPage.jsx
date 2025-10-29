import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { getValidationErrors, getErrorMessage } from '../utils/errorHandler';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import {
  listWarehousesByBranch,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../features/settings/api/warehouses.api';
import { validateWarehouse } from '../features/settings/schemas/warehouse.schema';

const defaultForm = (user, selectedBranchId) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: selectedBranchId || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  default: false,
});

const WarehousesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user, null));
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});

  const idEmpresa = user?.id_empresa;

  // Query para listar sucursales
  const { data: branches = [] } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: () => listBranchesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Query para listar almacenes
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['warehouses', selectedBranchId],
    queryFn: () => listWarehousesByBranch(selectedBranchId),
    enabled: !!selectedBranchId,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      success('Almacén creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user, selectedBranchId));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['warehouses', selectedBranchId] });
    },
    onError: (err) => {
      const fieldErrors = getValidationErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        showError(getErrorMessage(err));
        return;
      }
      showError(getErrorMessage(err) || 'Error al crear almacén');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateWarehouse(id, payload),
    onSuccess: () => {
      success('Almacén actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['warehouses', selectedBranchId] });
    },
    onError: (err) => {
      const fieldErrors = getValidationErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        showError(getErrorMessage(err));
        return;
      }
      showError(getErrorMessage(err) || 'Error al actualizar almacén');
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      success('Almacén eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['warehouses', selectedBranchId] });
    },
    onError: (err) => showError(getErrorMessage(err) || 'Error al eliminar almacén'),
  });

  // Handlers
  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    setForm(defaultForm(user, branchId));
  };

  const handleOpenCreate = () => {
    if (!selectedBranchId) {
      showError('Selecciona una sucursal primero');
      return;
    }
    setForm(defaultForm(user, selectedBranchId));
    setErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item) => {
    console.log('[WarehousesPage] Opening edit for item:', item);
    setSelectedItem(item);
    const formData = {
      idEmpresa: item.id_empresa,
      idSucursal: item.id_sucursal,
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      default: Boolean(item.default), // Convertir a booleano
    };
    console.log('[WarehousesPage] Form data for edit:', formData);
    console.log('[WarehousesPage] default field - original:', item.default, 'type:', typeof item.default, 'converted:', formData.default);
    setForm(formData);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleChange = (field, value) => {
    console.log(`[WarehousesPage] Field changed: ${field} =`, value, `(type: ${typeof value})`);
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      console.log('[WarehousesPage] New form state:', newForm);
      return newForm;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    const validation = validateWarehouse(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    console.log('[WarehousesPage] ========== SUBMIT EDIT STARTED ==========');
    console.log('[WarehousesPage] Form data being submitted:', form);
    console.log('[WarehousesPage] Form field types:', {
      idEmpresa: typeof form.idEmpresa,
      idSucursal: typeof form.idSucursal,
      codigo: typeof form.codigo,
      nombre: typeof form.nombre,
      descripcion: typeof form.descripcion,
      default: typeof form.default,
    });
    console.log('[WarehousesPage] Starting validation...');
    const validation = validateWarehouse(form);
    console.log('[WarehousesPage] Validation result:', validation);
    if (!validation.success) {
      console.error('[WarehousesPage] Validation FAILED!');
      console.error('[WarehousesPage] Errors:', validation.errors);
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    console.log('[WarehousesPage] Validation SUCCESS! Sending to backend...');
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Configuración de columnas
  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'default',
      label: 'Predeterminado',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-primary/20 text-primary' : 'bg-base-300 text-base-content/60'}`}>
          {value ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'codigo',
      label: 'Código',
      type: 'text',
      placeholder: 'ALM001',
      required: true,
      hint: 'Código único del almacén (solo mayúsculas y números)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Almacén Principal',
      required: true,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción del almacén (opcional)',
      rows: 2,
    },
    {
      name: 'default',
      label: 'Establecer como almacén predeterminado',
      type: 'checkbox',
      hint: 'Solo puede haber un almacén predeterminado por sucursal',
    },
  ];

  return (
    <ConfigurationLayout
      title="Almacenes"
      description="Gestiona los almacenes de tus sucursales"
      actions={
        <Button variant="primary" onClick={handleOpenCreate} disabled={!selectedBranchId}>
          Nuevo Almacén
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Almacenes' },
      ]}
    >
      {/* Selector de Sucursal */}
      <div className="mb-6 bg-base-100 p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-base-content mb-2">
          Seleccionar Sucursal
        </label>
        <select
          value={selectedBranchId || ''}
          onChange={(e) => handleBranchChange(Number(e.target.value) || null)}
          className="w-full md:w-96 px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Selecciona una sucursal...</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.nombre} ({branch.codigo})
            </option>
          ))}
        </select>
      </div>

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Almacén"
        onConfirm={handleSubmitCreate}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <ConfigurationForm
          fields={formFields}
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmitCreate}
          isSubmitting={createMut.isLoading}
          errors={errors}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Almacén"
        onConfirm={handleSubmitEdit}
        confirmText={updateMut.isLoading ? 'Guardando...' : 'Guardar'}
      >
        <ConfigurationForm
          fields={formFields}
          values={form}
          onChange={handleChange}
          onSubmit={handleSubmitEdit}
          isSubmitting={updateMut.isLoading}
          errors={errors}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirmar eliminación"
        onConfirm={() => deleteMut.mutate(selectedItem?.id)}
        confirmText={deleteMut.isLoading ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        variant="danger"
      >
        <p>¿Seguro que deseas eliminar el almacén "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no haya productos con stock en este almacén.
        </p>
      </Modal>

      {/* Tabla */}
      {!selectedBranchId ? (
        <div className="bg-base-100 p-12 rounded-lg shadow text-center">
          <svg
            className="mx-auto h-12 w-12 text-base-content/40 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-base-content/60 text-lg">
            Selecciona una sucursal para ver sus almacenes
          </p>
        </div>
      ) : (
        <ConfigurationTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          emptyMessage="No hay almacenes registrados en esta sucursal. Crea tu primer almacén para comenzar."
        />
      )}
    </ConfigurationLayout>
  );
};

export default WarehousesPage;
