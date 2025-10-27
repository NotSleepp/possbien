import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { ImageUpload } from '../shared/components/forms';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listPaymentMethodsByEmpresa,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../features/settings/api/paymentMethods.api';
import { validatePaymentMethod } from '../features/settings/schemas/paymentMethod.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  imagen: '',
  requiereReferencia: false,
});

const PaymentMethodsPage = () => {
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

  // Query para listar métodos de pago
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['payment-methods', idEmpresa],
    queryFn: () => listPaymentMethodsByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      success('Método de pago creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear método de pago'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updatePaymentMethod(id, payload),
    onSuccess: () => {
      success('Método de pago actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar método de pago'),
  });

  const deleteMut = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      success('Método de pago eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar método de pago'),
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
      descripcion: item.descripcion || '',
      imagen: item.imagen || '',
      requiereReferencia: item.requiere_referencia || false,
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
    const validation = validatePaymentMethod(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validatePaymentMethod(form);
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
    {
      key: 'imagen',
      label: 'Imagen',
      render: (value) =>
        value ? (
          <img src={value} alt="Método de pago" className="h-8 w-8 object-contain" />
        ) : (
          <span className="text-base-content/40">Sin imagen</span>
        ),
    },
    {
      key: 'requiere_referencia',
      label: 'Requiere Referencia',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-info/20 text-info' : 'bg-base-300 text-base-content/60'}`}>
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
      placeholder: 'EFECTIVO',
      required: true,
      hint: 'Código único del método de pago (solo mayúsculas, números, guiones)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Efectivo',
      required: true,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción del método de pago (opcional)',
      rows: 2,
    },
    {
      name: 'requiereReferencia',
      label: 'Requiere número de referencia',
      type: 'checkbox',
      hint: 'Solicitar número de referencia al usar este método (ej: número de operación)',
    },
  ];

  return (
    <ConfigurationLayout
      title="Métodos de Pago"
      description="Gestiona los métodos de pago disponibles en tu sistema"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nuevo Método
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Métodos de Pago' },
      ]}
    >
      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Método de Pago"
        onConfirm={handleSubmitCreate}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <div className="space-y-4">
          <ConfigurationForm
            fields={formFields}
            values={form}
            onChange={handleChange}
            onSubmit={handleSubmitCreate}
            isSubmitting={createMut.isLoading}
            errors={errors}
            onCancel={() => setIsCreateOpen(false)}
          />
          
          {/* Sección de imagen */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Imagen del Método de Pago
            </label>
            <ImageUpload
              value={form.imagen}
              onChange={(url) => handleChange('imagen', url)}
              placeholder="Sube una imagen o ingresa una URL"
            />
            {form.imagen && (
              <div className="mt-2">
                <p className="text-xs text-base-content/60 mb-1">Vista previa:</p>
                <img
                  src={form.imagen}
                  alt="Preview"
                  className="h-16 w-16 object-contain border border-base-300 rounded p-2"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Método de Pago"
        onConfirm={handleSubmitEdit}
        confirmText={updateMut.isLoading ? 'Guardando...' : 'Guardar'}
      >
        <div className="space-y-4">
          <ConfigurationForm
            fields={formFields}
            values={form}
            onChange={handleChange}
            onSubmit={handleSubmitEdit}
            isSubmitting={updateMut.isLoading}
            errors={errors}
            onCancel={() => setIsEditOpen(false)}
          />
          
          {/* Sección de imagen */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Imagen del Método de Pago
            </label>
            <ImageUpload
              value={form.imagen}
              onChange={(url) => handleChange('imagen', url)}
              placeholder="Sube una imagen o ingresa una URL"
            />
            {form.imagen && (
              <div className="mt-2">
                <p className="text-xs text-base-content/60 mb-1">Vista previa:</p>
                <img
                  src={form.imagen}
                  alt="Preview"
                  className="h-16 w-16 object-contain border border-base-300 rounded p-2"
                />
              </div>
            )}
          </div>
        </div>
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
        <p>¿Seguro que deseas eliminar el método de pago "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no esté siendo usado en transacciones activas.
        </p>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No hay métodos de pago registrados. Crea tu primer método de pago para comenzar."
      />
    </ConfigurationLayout>
  );
};

export default PaymentMethodsPage;
