import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner, Modal } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listPrintersByEmpresa, createPrinter, updatePrinter, deletePrinter } from '../features/settings/api/printers.api';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import { listCajasBySucursal, createCaja } from '../features/settings/api/cajas.api';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: user?.id_sucursal || null,
  idCaja: user?.id_caja || null,
  name: '',
  nombre: '',
  tipo: 'termica',
  puerto: '',
  pcName: '',
  ipLocal: '',
  state: true,
  configuracion: {},
});

const PrintersPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user));
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  // Submodal para crear caja
  const [isCajaModalOpen, setIsCajaModalOpen] = useState(false);
  const [cajaForm, setCajaForm] = useState({ codigo: '', nombre: '', saldoInicial: 0 });

  const idEmpresa = user?.id_empresa;

  const { data: printers = [], isLoading, isError } = useQuery({
    queryKey: ['printers', idEmpresa],
    queryFn: async () => {
      const data = await listPrintersByEmpresa(idEmpresa);
      return data;
    },
    enabled: !!idEmpresa,
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: async () => listBranchesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: cajas = [] } = useQuery({
    queryKey: ['cajas', form.idSucursal],
    queryFn: async () => listCajasBySucursal(form.idSucursal),
    enabled: !!form.idSucursal,
  });

  const createMut = useMutation({
    mutationFn: async (payload) => createPrinter(payload),
    onSuccess: () => {
      success('Impresora creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => {
      showError(err?.userMessage || 'Error al crear impresora');
    },
  });

  // Crear caja desde modal
  const createCajaMut = useMutation({
    mutationFn: async (payload) => createCaja(payload),
    onSuccess: (newCaja) => {
      success('Caja creada correctamente');
      setIsCajaModalOpen(false);
      // Refrescar lista de cajas de la sucursal seleccionada
      queryClient.invalidateQueries({ queryKey: ['cajas', form.idSucursal] });
      // Preseleccionar la nueva caja en el formulario de impresoras
      setForm((prev) => ({ ...prev, idCaja: newCaja?.id ?? prev.idCaja }));
      // Reset form de caja
      setCajaForm({ codigo: '', nombre: '', saldoInicial: 0 });
    },
    onError: (err) => {
      showError(err?.userMessage || 'Error al crear caja');
    },
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }) => updatePrinter(id, payload),
    onSuccess: () => {
      success('Impresora actualizada correctamente');
      setIsEditOpen(false);
      setSelectedPrinter(null);
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => {
      showError(err?.userMessage || 'Error al actualizar impresora');
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => deletePrinter(id),
    onSuccess: () => {
      success('Impresora eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedPrinter(null);
      queryClient.invalidateQueries({ queryKey: ['printers', idEmpresa] });
    },
    onError: (err) => {
      showError(err?.userMessage || 'Error al eliminar impresora');
    },
  });

  const handleOpenCreate = () => {
    setForm(defaultForm(user));
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (printer) => {
    setSelectedPrinter(printer);
    setForm({
      idEmpresa: printer.id_empresa,
      idSucursal: printer.id_sucursal,
      idCaja: printer.id_caja,
      name: printer.name || '',
      nombre: printer.nombre || '',
      tipo: printer.tipo || 'termica',
      puerto: printer.puerto || '',
      pcName: printer.pc_name || '',
      ipLocal: printer.ip_local || '',
      state: printer.state ?? true,
      configuracion: printer.configuracion || {},
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (printer) => {
    setSelectedPrinter(printer);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const tipos = useMemo(() => ([
    { value: 'termica', label: 'Térmica' },
    { value: 'matricial', label: 'Matricial' },
    { value: 'laser', label: 'Láser' },
  ]), []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Impresoras</h1>
        <p className="text-base-content/60 mt-2">Gestiona las impresoras de la empresa</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>Nueva Impresora</Button>
      </div>

      <Card title="Listado de Impresoras">
        {isLoading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : isError ? (
          <p className="text-error">No se pudo cargar el listado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-300">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">IP Local</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {printers.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{p.name || p.nombre}</td>
                    <td className="px-4 py-3 capitalize">{p.tipo}</td>
                    <td className="px-4 py-3">{p.ip_local || '-'}</td>
                    <td className="px-4 py-3">{p.state ? 'Activa' : 'Inactiva'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(p)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleOpenDelete(p)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Crear Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva Impresora"
        onConfirm={() => createMut.mutate(form)}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">Sucursal</label>
              <select
                className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.idSucursal || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, idSucursal: Number(e.target.value) || null, idCaja: null }))}
              required
            >
              <option value="" disabled>Seleccione una sucursal</option>
              {branches.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre || s.codigo || `Sucursal ${s.id}`}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-base-content">Caja</label>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!form.idSucursal) {
                    showError('Seleccione una sucursal antes de crear caja');
                    return;
                  }
                  setCajaForm({ codigo: '', nombre: '', saldoInicial: 0 });
                  setIsCajaModalOpen(true);
                }}
                disabled={!form.idSucursal}
              >
                Nueva Caja
              </Button>
            </div>
            <select
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.idCaja ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, idCaja: Number(e.target.value) || null }))}
              disabled={!form.idSucursal}
            >
              <option value="">Sin caja</option>
              {cajas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre || c.codigo || `Caja ${c.id}`}</option>
              ))}
            </select>
          </div>
          <Input label="Nombre" value={form.name} onChange={(v) => handleFormChange('name', v)} required />
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">Tipo</label>
              <select
                className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.tipo}
              onChange={(e) => handleFormChange('tipo', e.target.value)}
            >
              {tipos.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input label="Puerto" value={form.puerto} onChange={(v) => handleFormChange('puerto', v)} />
          <Input label="Nombre PC" value={form.pcName} onChange={(v) => handleFormChange('pcName', v)} />
          <Input label="IP Local" value={form.ipLocal} onChange={(v) => handleFormChange('ipLocal', v)} />
        </div>
      </Modal>

      {/* Submodal Crear Caja */}
      <Modal
        isOpen={isCajaModalOpen}
        onClose={() => setIsCajaModalOpen(false)}
        title="Nueva Caja"
        onConfirm={() => {
          if (!form.idSucursal) {
            showError('Seleccione una sucursal');
            return;
          }
          if (!cajaForm.codigo?.trim() || !cajaForm.nombre?.trim()) {
            showError('Complete código y nombre de la caja');
            return;
          }
          createCajaMut.mutate({
            idSucursal: form.idSucursal,
            codigo: cajaForm.codigo.trim(),
            nombre: cajaForm.nombre.trim(),
            saldoInicial: Number(cajaForm.saldoInicial) || 0,
          });
        }}
        confirmText={createCajaMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <div className="space-y-4">
          <Input label="Código" value={cajaForm.codigo} onChange={(v) => setCajaForm((p) => ({ ...p, codigo: v }))} required />
          <Input label="Nombre" value={cajaForm.nombre} onChange={(v) => setCajaForm((p) => ({ ...p, nombre: v }))} required />
          <Input label="Saldo inicial" type="number" value={cajaForm.saldoInicial} onChange={(v) => setCajaForm((p) => ({ ...p, saldoInicial: v }))} />
        </div>
      </Modal>

      {/* Editar Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Impresora"
        onConfirm={() => updateMut.mutate({ id: selectedPrinter?.id, payload: form })}
        confirmText={updateMut.isLoading ? 'Actualizando...' : 'Guardar'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">Sucursal</label>
            <select
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.idSucursal || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, idSucursal: Number(e.target.value) || null, idCaja: null }))}
              required
            >
              <option value="" disabled>Seleccione una sucursal</option>
              {branches.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre || s.codigo || `Sucursal ${s.id}`}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-base-content">Caja</label>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!form.idSucursal) {
                    showError('Seleccione una sucursal antes de crear caja');
                    return;
                  }
                  setCajaForm({ codigo: '', nombre: '', saldoInicial: 0 });
                  setIsCajaModalOpen(true);
                }}
                disabled={!form.idSucursal}
              >
                Nueva Caja
              </Button>
            </div>
            <select
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.idCaja ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, idCaja: Number(e.target.value) || null }))}
              disabled={!form.idSucursal}
            >
              <option value="">Sin caja</option>
              {cajas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre || c.codigo || `Caja ${c.id}`}</option>
              ))}
            </select>
          </div>
          <Input label="Nombre" value={form.name} onChange={(v) => handleFormChange('name', v)} required />
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">Tipo</label>
            <select
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.tipo}
              onChange={(e) => handleFormChange('tipo', e.target.value)}
            >
              {tipos.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <Input label="Puerto" value={form.puerto} onChange={(v) => handleFormChange('puerto', v)} />
          <Input label="Nombre PC" value={form.pcName} onChange={(v) => handleFormChange('pcName', v)} />
          <Input label="IP Local" value={form.ipLocal} onChange={(v) => handleFormChange('ipLocal', v)} />
        </div>
      </Modal>

      {/* Eliminar Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirmar eliminación"
        onConfirm={() => deleteMut.mutate(selectedPrinter?.id)}
        confirmText={deleteMut.isLoading ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        variant="danger"
      >
        <p>¿Seguro que deseas eliminar la impresora "{selectedPrinter?.name || selectedPrinter?.nombre}"?</p>
      </Modal>
    </div>
  );
};

export default PrintersPage;