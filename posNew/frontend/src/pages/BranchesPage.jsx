import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listBranchesByEmpresa,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../features/settings/api/branches.api';
import { validateBranch } from '../features/settings/schemas/branch.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  direccion: '',
  direccionFiscal: '',
  telefono: '',
  email: '',
});

const BranchesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user));
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});

  const idEmpresa = user?.id_empresa;

  // Query para listar sucursales
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: () => listBranchesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      success('Sucursal creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['branches', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear sucursal'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateBranch(id, payload),
    onSuccess: () => {
      success('Sucursal actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['branches', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar sucursal'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      success('Sucursal eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['branches', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar sucursal'),
  });

  // Handlers
  const handleOpenCreate = () => {
    setForm(defaultForm(user));
    setErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setForm({
      idEmpresa: item.id_empresa,
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      direccion: item.direccion || '',
      direccionFiscal: item.direccion_fiscal || '',
      telefono: item.telefono || '',
      email: item.email || '',
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
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    const validation = validateBranch(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateBranch(form);
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
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
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
      placeholder: 'SUC001',
      required: true,
      hint: 'Código único de la sucursal (solo mayúsculas y números)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Sucursal Principal',
      required: true,
    },
    {
      name: 'direccion',
      label: 'Dirección',
      type: 'textarea',
      placeholder: 'Av. Principal 123, Lima',
      required: true,
      rows: 2,
    },
    {
      name: 'direccionFiscal',
      label: 'Dirección Fiscal',
      type: 'textarea',
      placeholder: 'Dirección fiscal (opcional)',
      rows: 2,
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      placeholder: '+51 999 999 999',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'sucursal@empresa.com',
    },
  ];

  return (
    <ConfigurationLayout
      title="Sucursales"
      description="Gestiona las sucursales de tu empresa"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nueva Sucursal
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Sucursales' },
      ]}
    >
      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva Sucursal"
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
        title="Editar Sucursal"
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
        <p>¿Seguro que deseas eliminar la sucursal "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no haya almacenes o cajas asociadas.
        </p>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No hay sucursales registradas. Crea tu primera sucursal para comenzar."
      />
    </ConfigurationLayout>
  );
};

export default BranchesPage;
