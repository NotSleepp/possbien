import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import {
  listCajasBySucursal,
  createCaja,
  updateCaja,
  deleteCaja,
} from '../features/settings/api/cajas.api';
import { validateCashRegister } from '../features/settings/schemas/cashRegister.schema';

const defaultForm = (user, selectedBranchId) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: selectedBranchId || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  montoInicial: 0,
  print: true,
});

const CashRegistersPage = () => {
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

  // Query para listar cajas
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cajas', selectedBranchId],
    queryFn: () => listCajasBySucursal(selectedBranchId),
    enabled: !!selectedBranchId,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createCaja,
    onSuccess: () => {
      success('Caja registradora creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user, selectedBranchId));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['cajas', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear caja'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateCaja(id, payload),
    onSuccess: () => {
      success('Caja registradora actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['cajas', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar caja'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCaja,
    onSuccess: () => {
      success('Caja registradora eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['cajas', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar caja'),
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
    setSelectedItem(item);
    setForm({
      idEmpresa: item.id_empresa,
      idSucursal: item.id_sucursal,
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      montoInicial: Number(item.monto_inicial) || 0,
      print: item.print !== undefined ? item.print : true,
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    const validation = validateCashRegister(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateCashRegister(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Configuración de columnas
  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'monto_inicial',
      label: 'Monto Inicial',
      render: (value) => `S/ ${Number(value || 0).toFixed(2)}`,
    },
    {
      key: 'print',
      label: 'Imprime',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-success/20 text-success' : 'bg-base-300 text-base-content/60'}`}>
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
      placeholder: 'CAJ001',
      required: true,
      hint: 'Código único de la caja (solo mayúsculas y números)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Caja Principal',
      required: true,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción de la caja (opcional)',
      rows: 2,
    },
    {
      name: 'montoInicial',
      label: 'Monto Inicial',
      type: 'number',
      placeholder: '0.00',
      hint: 'Monto con el que inicia la caja cada día',
    },
    {
      name: 'print',
      label: 'Habilitar impresión de tickets',
      type: 'checkbox',
      hint: 'Permite imprimir tickets desde esta caja',
    },
  ];

  return (
    <ConfigurationLayout
      title="Cajas Registradoras"
      description="Gestiona las cajas registradoras de tus sucursales"
      actions={
        <Button variant="primary" onClick={handleOpenCreate} disabled={!selectedBranchId}>
          Nueva Caja
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Cajas' },
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
        title="Nueva Caja Registradora"
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
        title="Editar Caja Registradora"
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
        <p>¿Seguro que deseas eliminar la caja "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no haya sesiones activas en esta caja.
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <p className="text-base-content/60 text-lg">
            Selecciona una sucursal para ver sus cajas registradoras
          </p>
        </div>
      ) : (
        <ConfigurationTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          emptyMessage="No hay cajas registradas en esta sucursal. Crea tu primera caja para comenzar."
        />
      )}
    </ConfigurationLayout>
  );
};

export default CashRegistersPage;
