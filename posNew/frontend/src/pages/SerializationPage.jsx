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
import { validateSerialization, validateSerializationUpdate } from '../features/settings/schemas/serialization.schema';

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
      console.log('[SerializationPage] createMut onSuccess');
      success('Serialización creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user, selectedBranchId));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => {
      console.error('[SerializationPage] createMut onError:', err);
      showError(err?.userMessage || 'Error al crear serialización');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateSerialization(id, payload),
    onSuccess: () => {
      console.log('[SerializationPage] updateMut onSuccess');
      success('Serialización actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => {
      console.error('[SerializationPage] updateMut onError:', err);
      showError(err?.userMessage || 'Error al actualizar serialización');
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteSerialization,
    onSuccess: () => {
      console.log('[SerializationPage] deleteMut onSuccess');
      success('Serialización eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['serializations', selectedBranchId] });
    },
    onError: (err) => {
      console.error('[SerializationPage] deleteMut onError:', err);
      showError(err?.userMessage || 'Error al eliminar serialización');
    },
  });

  // Handlers
  const handleBranchChange = (branchId) => {
    console.log('[SerializationPage] handleBranchChange branchId:', branchId);
    setSelectedBranchId(branchId);
    const df = defaultForm(user, branchId);
    setForm(df);
    console.log('[SerializationPage] defaultForm after branch change:', df);
  };

  const handleOpenCreate = () => {
    console.log('[SerializationPage] handleOpenCreate selectedBranchId:', selectedBranchId);
    if (!selectedBranchId) {
      showError('Selecciona una sucursal primero');
      return;
    }
    const df = defaultForm(user, selectedBranchId);
    setForm(df);
    setErrors({});
    setIsCreateOpen(true);
    console.log('[SerializationPage] form initialized for create:', df);
  };

  const handleOpenEdit = (item) => {
    console.log('[SerializationPage] handleOpenEdit item:', item);
    setSelectedItem(item);
    const mappedNumeroFinal = item.numeroFinal != null
      ? Number(item.numeroFinal)
      : (item.numero_final != null ? Number(item.numero_final) : null);

    const mappedForm = {
      idEmpresa: item.idEmpresa ?? item.id_empresa ?? user?.id_empresa ?? null,
      idSucursal: item.idSucursal ?? item.id_sucursal ?? selectedBranchId ?? null,
      idTipoComprobante: item.idTipoComprobante ?? item.id_tipo_comprobante ?? null,
      serie: item.serie || '',
      numeroInicial: Number(item.numeroInicial ?? item.numero_inicial ?? 1),
      numeroActual: Number(item.numeroActual ?? item.numero_actual ?? 1),
      numeroFinal: mappedNumeroFinal === 0 ? null : mappedNumeroFinal,
      porDefault: (item.porDefault === true || item.porDefault === 1 || item.por_default === 1 || item.por_default === true) ? true : false,
    };
    console.log('[SerializationPage] mappedForm for edit:', mappedForm);
    setForm(mappedForm);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    console.log('[SerializationPage] handleOpenDelete item:', item);
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleChange = (field, value) => {
    console.log('[SerializationPage] handleChange field:', field, 'value:', value);
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    console.log('[SerializationPage] handleSubmitCreate form before validate:', form);
    const validation = validateSerialization(form);
    if (!validation.success) {
      console.warn('[SerializationPage] create validation errors:', validation.errors);
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    console.log('[SerializationPage] create payload (validated):', validation.data);
    setErrors({});
    createMut.mutate(validation.data);
  };

  const handleSubmitEdit = () => {
    console.log('[SerializationPage] handleSubmitEdit form before validate:', form);
    // 1) Validación suave: coercer tipos y verificar campos individuales
    const soft = validateSerializationUpdate(form);
    if (!soft.success) {
      console.warn('[SerializationPage] edit soft validation errors:', soft.errors);
      setErrors(soft.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }

    // 2) Detectar si cambió la numeración respecto al valor original
    const originalNI = Number(selectedItem?.numeroInicial ?? selectedItem?.numero_inicial ?? 1);
    const originalNA = Number(selectedItem?.numeroActual ?? selectedItem?.numero_actual ?? 1);
    const originalNF = selectedItem?.numeroFinal != null
      ? Number(selectedItem?.numeroFinal)
      : (selectedItem?.numero_final != null ? Number(selectedItem?.numero_final) : null);

    const candNI = Number(soft.data.numeroInicial);
    const candNA = Number(soft.data.numeroActual);
    const candNF = soft.data.numeroFinal === '' ? null : soft.data.numeroFinal;

    console.log('[SerializationPage] original numbers:', { originalNI, originalNA, originalNF });
    console.log('[SerializationPage] candidate numbers:', { candNI, candNA, candNF });
    const numbersChanged = (
      candNI !== originalNI ||
      candNA !== originalNA ||
      ((candNF ?? null) !== (originalNF ?? null))
    );
    console.log('[SerializationPage] numbersChanged:', numbersChanged);

    // 3) Si cambió la numeración, aplicar validación estricta con reglas cruzadas
    let payload = soft.data;
    if (numbersChanged) {
      const strict = validateSerialization(soft.data);
      if (!strict.success) {
        console.warn('[SerializationPage] edit strict validation errors:', strict.errors);
        setErrors(strict.errors);
        showError('Por favor corrige los errores en el formulario');
        return;
      }
      console.log('[SerializationPage] edit payload (strict validated):', strict.data);
      payload = strict.data;
    }

    setErrors({});
    console.log('[SerializationPage] update mutate payload:', payload, 'id:', selectedItem?.id);
    updateMut.mutate({ id: selectedItem?.id, payload });
  };

  // Obtener nombre de tipo de comprobante
  const getDocumentTypeName = (idTipoComprobante) => {
    const docType = documentTypes.find((dt) => dt.id === idTipoComprobante);
    return docType ? docType.nombre : 'N/A';
  };

  // Calcular progreso de numeración
  const getProgress = (item) => {
    const numeroFinal = item.numeroFinal ?? item.numero_final;
    const numeroInicial = item.numeroInicial ?? item.numero_inicial;
    const numeroActual = item.numeroActual ?? item.numero_actual;
    if (!numeroFinal) return null;
    const total = numeroFinal - numeroInicial + 1;
    const used = numeroActual - numeroInicial;
    const percentage = (used / total) * 100;
    return { percentage: Math.min(percentage, 100), used, total };
  };

  // Configuración de columnas
  const columns = [
    {
      key: 'idTipoComprobante',
      label: 'Tipo de Comprobante',
      render: (value) => getDocumentTypeName(value),
    },
    { key: 'serie', label: 'Serie' },
    {
      key: 'numeroActual',
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
      key: 'numeroInicial',
      label: 'Rango',
      render: (value, item) => {
        const final = (item.numeroFinal ?? item.numero_final) || '∞';
        return `${value} - ${final}`;
      },
    },
    {
      key: 'porDefault',
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
