import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import { listDocumentTypesByEmpresa } from '../features/settings/api/documentTypes.api';
import {
  listSerializationsByBranch,
  createSerialization,
  updateSerialization,
  deleteSerialization,
} from '../features/settings/api/serialization.api';
import { validateSerialization } from '../features/settings/schemas/serialization.schema';

const defaultForm = (user, selectedBranchId) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: selectedBranchId || null,
  idTipoComprobante: null,
  serie: '',
  numeroInicial: 1,
  numeroActual: 1,
  numeroFinal: null,
  porDefault: false,
});

const SerializationPage = () => {
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

  // Query para listar tipos de comprobantes
  const { data: documentTypes = [] } = useQuery({
    queryKey: ['document-types', idEmpresa],
    queryFn: () => listDocumentTypesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Query para listar serializaciones
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['serializations', selectedBranchId],
    queryFn: () => listSerializationsByBranch(selectedBranchId),
    enabled: !!selectedBranchId,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createSerialization,
    onSuccess: () => {
      success('Serialización creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user, selectedBranchId));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear serialización'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateSerialization(id, payload),
    onSuccess: () => {
      success('Serialización actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar serialización'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSerialization,
    onSuccess: () => {
      success('Serialización eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar serialización'),
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
      idTipoComprobante: item.id_tipo_comprobante,
      serie: item.serie || '',
      numeroInicial: Number(item.numero_inicial) || 1,
      numeroActual: Number(item.numero_actual) || 1,
      numeroFinal: item.numero_final ? Number(item.numero_final) : null,
      porDefault: item.por_default || false,
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
    const validation = validateSerialization(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateSerialization(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Obtener nombre de tipo de comprobante
  const getDocumentTypeName = (idTipoComprobante) => {
    const docType = documentTypes.find((dt) => dt.id === idTipoComprobante);
    return docType ? docType.nombre : 'N/A';
  };

  // Calcular progreso de numeración
  const getProgress = (item) => {
    if (!item.numero_final) return null;
    const total = item.numero_final - item.numero_inicial + 1;
    const used = item.numero_actual - item.numero_inicial;
    const percentage = (used / total) * 100;
    return { percentage: Math.min(percentage, 100), used, total };
  };

  // Configuración de columnas
  const columns = [
    {
      key: 'id_tipo_comprobante',
      label: 'Tipo de Comprobante',
      render: (value) => getDocumentTypeName(value),
    },
    { key: 'serie', label: 'Serie' },
    {
      key: 'numero_actual',
      label: 'Número Actual',
      render: (value, item) => {
        const progress = getProgress(item);
        return (
          <div>
            <div className="font-medium">{value}</div>
            {progress && (
              <div className="text-xs text-base-content/60">
                {progress.used} de {progress.total} usados
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'numero_inicial',
      label: 'Rango',
      render: (value, item) => {
        const final = item.numero_final || '∞';
        return `${value} - ${final}`;
      },
    },
    {
      key: 'por_default',
      label: 'Predeterminada',
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
          {value ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'idTipoComprobante',
      label: 'Tipo de Comprobante',
      type: 'select',
      required: true,
      options: documentTypes.map((dt) => ({
        value: dt.id,
        label: `${dt.nombre} (${dt.codigo})`,
      })),
      hint: 'Selecciona el tipo de comprobante para esta serie',
    },
    {
      name: 'serie',
      label: 'Serie',
      type: 'text',
      placeholder: 'B001',
      required: true,
      hint: 'Serie del comprobante (ej: B001, F001)',
    },
    {
      name: 'numeroInicial',
      label: 'Número Inicial',
      type: 'number',
      placeholder: '1',
      required: true,
      hint: 'Primer número de la serie',
    },
    {
      name: 'numeroActual',
      label: 'Número Actual',
      type: 'number',
      placeholder: '1',
      required: true,
      hint: 'Número actual de la serie (debe ser >= número inicial)',
    },
    {
      name: 'numeroFinal',
      label: 'Número Final (Opcional)',
      type: 'number',
      placeholder: 'Dejar vacío para ilimitado',
      hint: 'Último número de la serie (opcional)',
    },
    {
      name: 'porDefault',
      label: 'Establecer como serie predeterminada',
      type: 'checkbox',
      hint: 'Solo puede haber una serie predeterminada por sucursal y tipo de comprobante',
    },
  ];

  return (
    <ConfigurationLayout
      title="Serialización de Comprobantes"
      description="Gestiona las series de numeración de tus comprobantes"
      actions={
        <Button variant="primary" onClick={handleOpenCreate} disabled={!selectedBranchId}>
          Nueva Serie
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Serialización' },
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

      {/* Alerta de números cercanos al límite */}
      {items.some((item) => {
        const progress = getProgress(item);
        return progress && progress.percentage > 80;
      }) && (
        <div className="mb-6 bg-warning/10 border border-warning/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-warning flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-warning">Atención: Series cercanas al límite</h3>
              <p className="text-sm text-base-content/70 mt-1">
                Algunas series están cerca de alcanzar su número final. Considera crear nuevas series.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva Serie de Comprobantes"
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
        title="Editar Serie de Comprobantes"
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
        <p>¿Seguro que deseas eliminar la serie "{selectedItem?.serie}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer.
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-base-content/60 text-lg">
            Selecciona una sucursal para ver sus series de comprobantes
          </p>
        </div>
      ) : (
        <ConfigurationTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          emptyMessage="No hay series de comprobantes registradas en esta sucursal. Crea tu primera serie para comenzar."
        />
      )}
    </ConfigurationLayout>
  );
};

export default SerializationPage;
