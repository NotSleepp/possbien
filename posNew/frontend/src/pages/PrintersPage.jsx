import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import { listCajasBySucursal } from '../features/settings/api/cajas.api';
import {
  listPrintersByEmpresa,
  createPrinter,
  updatePrinter,
  deletePrinter,
  testPrinter,
} from '../features/settings/api/printers.api';
import { validatePrinter } from '../features/settings/schemas/printer.schema';

const defaultForm = (user, selectedBranchId) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: selectedBranchId || null,
  idCaja: null,
  name: '',
  tipo: 'termica',
  puerto: '',
  pcName: '',
  ipLocal: '',
  state: true,
  configuracion: '',
});

const PrintersPage = () => {
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

  // Query para listar cajas de la sucursal seleccionada
  const { data: cajas = [] } = useQuery({
    queryKey: ['cajas', selectedBranchId],
    queryFn: () => listCajasBySucursal(selectedBranchId),
    enabled: !!selectedBranchId,
  });

  // Query para listar impresoras
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['printers', idEmpresa],
    queryFn: () => listPrintersByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Filtrar impresoras por sucursal seleccionada
  const filteredItems = selectedBranchId
    ? items.filter((item) => item.id_sucursal === selectedBranchId)
    : items;

  // Mutaciones
  const createMut = useMutation({
    mutationFn: (payload) => {
      console.log('[PrintersPage] CREATE Mutation started with payload:', payload);
      return createPrinter(payload);
    },
    onSuccess: (data) => {
      console.log('[PrintersPage] CREATE Mutation SUCCESS! Response:', data);
      success('Impresora creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user, selectedBranchId));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => {
      console.error('[PrintersPage] CREATE Mutation ERROR:', err);
      console.error('[PrintersPage] Error details:', {
        message: err?.message,
        userMessage: err?.userMessage,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      showError(err?.userMessage || 'Error al crear impresora');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => {
      console.log('[PrintersPage] UPDATE Mutation started - ID:', id, 'Payload:', payload);
      return updatePrinter(id, payload);
    },
    onSuccess: (data) => {
      console.log('[PrintersPage] UPDATE Mutation SUCCESS! Response:', data);
      success('Impresora actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => {
      console.error('[PrintersPage] UPDATE Mutation ERROR:', err);
      console.error('[PrintersPage] Error details:', {
        message: err?.message,
        userMessage: err?.userMessage,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      showError(err?.userMessage || 'Error al actualizar impresora');
    },
  });

  const deleteMut = useMutation({
    mutationFn: deletePrinter,
    onSuccess: () => {
      success('Impresora eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar impresora'),
  });

  const testMut = useMutation({
    mutationFn: testPrinter,
    onSuccess: () => {
      success('Prueba de impresión enviada correctamente');
    },
    onError: (err) => showError(err?.userMessage || 'Error al probar impresora'),
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
      idCaja: item.id_caja || null,
      name: item.name || '',
      tipo: item.tipo || 'termica',
      puerto: item.puerto || '',
      pcName: item.pc_name || '',
      ipLocal: item.ip_local || '',
      state: item.state !== undefined ? item.state : true,
      configuracion: typeof item.configuracion === 'object' 
        ? JSON.stringify(item.configuracion, null, 2) 
        : item.configuracion || '',
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleTestPrinter = (item) => {
    testMut.mutate(item.id);
  };

  const handleChange = (field, value) => {
    console.log(`[PrintersPage] Field changed: ${field} =`, value, `(type: ${typeof value})`);
    
    // Convertir a número si el campo es idCaja
    let processedValue = value;
    if (field === 'idCaja') {
      // Si es string vacío o "null", convertir a null, sino a número
      if (value === '' || value === 'null' || value === null) {
        processedValue = null;
      } else {
        processedValue = Number(value);
      }
      console.log(`[PrintersPage] Converted idCaja from "${value}" to`, processedValue, `(type: ${typeof processedValue})`);
    }
    
    setForm((prev) => {
      const newForm = { ...prev, [field]: processedValue };
      console.log('[PrintersPage] New form state:', newForm);
      return newForm;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    console.log('[PrintersPage] ========== SUBMIT CREATE STARTED ==========');
    console.log('[PrintersPage] Form data being submitted:', form);
    console.log('[PrintersPage] Form field types:', {
      idEmpresa: typeof form.idEmpresa,
      idSucursal: typeof form.idSucursal,
      idCaja: typeof form.idCaja,
      name: typeof form.name,
      tipo: typeof form.tipo,
      puerto: typeof form.puerto,
      pcName: typeof form.pcName,
      ipLocal: typeof form.ipLocal,
      state: typeof form.state,
      configuracion: typeof form.configuracion,
    });
    console.log('[PrintersPage] Starting validation...');
    const validation = validatePrinter(form);
    console.log('[PrintersPage] Validation result:', validation);
    if (!validation.success) {
      console.error('[PrintersPage] Validation FAILED!');
      console.error('[PrintersPage] Errors:', validation.errors);
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    console.log('[PrintersPage] Validation SUCCESS! Sending to backend...');
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    console.log('[PrintersPage] ========== SUBMIT EDIT STARTED ==========');
    console.log('[PrintersPage] Form data being submitted:', form);
    console.log('[PrintersPage] Form field types:', {
      idEmpresa: typeof form.idEmpresa,
      idSucursal: typeof form.idSucursal,
      idCaja: typeof form.idCaja,
      name: typeof form.name,
      tipo: typeof form.tipo,
      puerto: typeof form.puerto,
      pcName: typeof form.pcName,
      ipLocal: typeof form.ipLocal,
      state: typeof form.state,
      configuracion: typeof form.configuracion,
    });
    console.log('[PrintersPage] Starting validation...');
    const validation = validatePrinter(form);
    console.log('[PrintersPage] Validation result:', validation);
    if (!validation.success) {
      console.error('[PrintersPage] Validation FAILED!');
      console.error('[PrintersPage] Errors:', validation.errors);
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    console.log('[PrintersPage] Validation SUCCESS! Sending to backend...');
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Obtener nombre de sucursal
  const getBranchName = (idSucursal) => {
    const branch = branches.find((b) => b.id === idSucursal);
    return branch ? branch.nombre : 'N/A';
  };

  // Obtener nombre de caja
  const getCajaName = (idCaja) => {
    if (!idCaja) return 'Sin asignar';
    const caja = cajas.find((c) => c.id === idCaja);
    return caja ? caja.nombre : 'N/A';
  };

  // Configuración de columnas
  const columns = [
    { key: 'name', label: 'Nombre' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs bg-base-300 text-base-content capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'id_sucursal',
      label: 'Sucursal',
      render: (value) => getBranchName(value),
    },
    {
      key: 'id_caja',
      label: 'Caja',
      render: (value) => getCajaName(value),
    },
    {
      key: 'ip_local',
      label: 'IP',
      render: (value) => value || '-',
    },
    {
      key: 'state',
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
      name: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Impresora Principal',
      required: true,
    },
    {
      name: 'tipo',
      label: 'Tipo de Impresora',
      type: 'select',
      required: true,
      options: [
        { value: 'termica', label: 'Térmica' },
        { value: 'matricial', label: 'Matricial' },
        { value: 'laser', label: 'Láser' },
      ],
    },
    {
      name: 'idCaja',
      label: 'Caja Registradora (Opcional)',
      type: 'select',
      options: [
        { value: null, label: 'Sin asignar' },
        ...cajas.map((caja) => ({
          value: caja.id,
          label: `${caja.nombre} (${caja.codigo})`,
        })),
      ],
      hint: 'Asigna esta impresora a una caja específica',
    },
    {
      name: 'pcName',
      label: 'Nombre del PC',
      type: 'text',
      placeholder: 'PC-CAJA-01',
      hint: 'Nombre del equipo donde está conectada la impresora',
    },
    {
      name: 'ipLocal',
      label: 'Dirección IP',
      type: 'text',
      placeholder: '192.168.1.100',
      hint: 'IP local de la impresora (si es de red)',
    },
    {
      name: 'puerto',
      label: 'Puerto',
      type: 'text',
      placeholder: 'COM1 o 9100',
      hint: 'Puerto de conexión (COM1, USB, o puerto de red)',
    },
    {
      name: 'configuracion',
      label: 'Configuración JSON (Opcional)',
      type: 'textarea',
      placeholder: '{"ancho": 80, "velocidad": 9600}',
      rows: 4,
      hint: 'Configuración adicional en formato JSON',
    },
    {
      name: 'state',
      label: 'Impresora activa',
      type: 'checkbox',
      hint: 'Habilita o deshabilita esta impresora',
    },
  ];

  return (
    <ConfigurationLayout
      title="Impresoras"
      description="Gestiona las impresoras de tu sistema POS"
      actions={
        <Button variant="primary" onClick={handleOpenCreate} disabled={!selectedBranchId}>
          Nueva Impresora
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Impresoras' },
      ]}
    >
      {/* Selector de Sucursal */}
      <div className="mb-6 bg-base-100 p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-base-content mb-2">
          Filtrar por Sucursal
        </label>
        <select
          value={selectedBranchId || ''}
          onChange={(e) => handleBranchChange(Number(e.target.value) || null)}
          className="w-full md:w-96 px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las sucursales</option>
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
        title="Nueva Impresora"
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
        title="Editar Impresora"
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
        <p>¿Seguro que deseas eliminar la impresora "{selectedItem?.name}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={filteredItems}
        isLoading={isLoading}
        customActions={(item) => (
          <Button
            variant="info"
            size="sm"
            onClick={() => handleTestPrinter(item)}
            disabled={testMut.isLoading}
            aria-label={`Probar impresora ${item.name}`}
          >
            {testMut.isLoading ? 'Probando...' : 'Probar'}
          </Button>
        )}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage={
          selectedBranchId
            ? 'No hay impresoras registradas en esta sucursal. Crea tu primera impresora para comenzar.'
            : 'No hay impresoras registradas. Selecciona una sucursal y crea tu primera impresora.'
        }
      />
    </ConfigurationLayout>
  );
};

export default PrintersPage;
