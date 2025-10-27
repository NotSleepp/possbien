import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listDocumentTypesByEmpresa,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from '../features/settings/api/documentTypes.api';
import { validateDocumentType } from '../features/settings/schemas/documentType.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  destino: 'VENTA',
});

const DocumentTypesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user));
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [filterDestino, setFilterDestino] = useState('');

  const idEmpresa = user?.id_empresa;

  // Query para listar tipos de comprobantes
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['document-types', idEmpresa],
    queryFn: () => listDocumentTypesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Filtrar por destino
  const filteredItems = filterDestino
    ? items.filter((item) => item.destino === filterDestino)
    : items;

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createDocumentType,
    onSuccess: () => {
      success('Tipo de comprobante creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['document-types', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear tipo de comprobante'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateDocumentType(id, payload),
    onSuccess: () => {
      success('Tipo de comprobante actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['document-types', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar tipo de comprobante'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteDocumentType,
    onSuccess: () => {
      success('Tipo de comprobante eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['document-types', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar tipo de comprobante'),
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
      destino: item.destino || 'VENTA',
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
    const validation = validateDocumentType(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateDocumentType(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Obtener badge de destino
  const getDestinoBadge = (destino) => {
    const badges = {
      VENTA: { bg: 'bg-success/20', text: 'text-success', label: 'Venta' },
      COMPRA: { bg: 'bg-info/20', text: 'text-info', label: 'Compra' },
      INTERNO: { bg: 'bg-warning/20', text: 'text-warning', label: 'Interno' },
    };
    const badge = badges[destino] || badges.VENTA;
    return (
      <span className={`px-2 py-1 rounded text-xs ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Configuración de columnas
  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'destino',
      label: 'Destino',
      render: (value) => getDestinoBadge(value),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => value || '-',
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
      placeholder: 'BOLETA',
      required: true,
      hint: 'Código único del tipo de comprobante (solo mayúsculas, números, guiones)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Boleta de Venta',
      required: true,
    },
    {
      name: 'destino',
      label: 'Destino',
      type: 'select',
      required: true,
      options: [
        { value: 'VENTA', label: 'Venta' },
        { value: 'COMPRA', label: 'Compra' },
        { value: 'INTERNO', label: 'Interno' },
      ],
      hint: 'Define si este comprobante es para ventas, compras o uso interno',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción del tipo de comprobante (opcional)',
      rows: 2,
    },
  ];

  return (
    <ConfigurationLayout
      title="Tipos de Comprobantes"
      description="Gestiona los tipos de comprobantes (facturas, boletas, etc.)"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nuevo Tipo
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Tipos de Comprobantes' },
      ]}
    >
      {/* Filtro por Destino */}
      <div className="mb-6 bg-base-100 p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-base-content mb-2">
          Filtrar por Destino
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterDestino('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterDestino === ''
                ? 'bg-primary text-primary-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterDestino('VENTA')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterDestino === 'VENTA'
                ? 'bg-success text-success-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            Venta
          </button>
          <button
            onClick={() => setFilterDestino('COMPRA')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterDestino === 'COMPRA'
                ? 'bg-info text-info-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            Compra
          </button>
          <button
            onClick={() => setFilterDestino('INTERNO')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterDestino === 'INTERNO'
                ? 'bg-warning text-warning-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            Interno
          </button>
        </div>
      </div>

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Tipo de Comprobante"
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
        title="Editar Tipo de Comprobante"
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
        <p>¿Seguro que deseas eliminar el tipo de comprobante "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no esté siendo usado en ventas activas.
        </p>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={filteredItems}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage={
          filterDestino
            ? `No hay tipos de comprobantes de tipo "${filterDestino}". Crea uno para comenzar.`
            : 'No hay tipos de comprobantes registrados. Crea tu primer tipo de comprobante para comenzar.'
        }
      />
    </ConfigurationLayout>
  );
};

export default DocumentTypesPage;
