import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner, Modal, Badge } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import {
  listWarehousesByEmpresa,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../features/settings/api/warehouses.api';

const defaultWarehouseForm = (user, selectedBranchId) => ({
  idEmpresa: user?.id_empresa || null,
  idSucursal: selectedBranchId || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  default: false,
});

const WarehousesPage = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;
  const { success: showSuccess, error: showError } = useToastStore();

  // UI state
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(defaultWarehouseForm(user, null));
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Queries
  const {
    data: branches = [],
    isLoading: isBranchesLoading,
    isError: isBranchesError,
  } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) throw new Error('No se encontró la empresa del usuario');
      return await listBranchesByEmpresa(idEmpresa);
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: warehouses = [],
    isLoading: isWarehousesLoading,
    isError: isWarehousesError,
    error: warehousesError,
  } = useQuery({
    queryKey: ['warehouses', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) throw new Error('No se encontró la empresa del usuario');
      return await listWarehousesByEmpresa(idEmpresa);
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000,
  });

  const filteredWarehouses = selectedBranchId
    ? warehouses.filter((w) => w.id_sucursal === selectedBranchId)
    : warehouses;

  // Mutations
  const createMut = useMutation({
    mutationFn: async (payload) => {
      return await createWarehouse(payload);
    },
    onSuccess: () => {
      showSuccess('Almacén creado exitosamente');
      setIsCreateOpen(false);
      setForm(defaultWarehouseForm(user, selectedBranchId));
      queryClient.invalidateQueries(['warehouses', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al crear almacén');
    },
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      // Solo enviar campos permitidos por el backend
      const { codigo, nombre, descripcion, default: isDefault } = payload;
      return await updateWarehouse(id, { codigo, nombre, descripcion, default: isDefault });
    },
    onSuccess: () => {
      showSuccess('Almacén actualizado exitosamente');
      setIsEditOpen(false);
      setSelectedWarehouse(null);
      queryClient.invalidateQueries(['warehouses', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al actualizar almacén');
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      return await deleteWarehouse(id);
    },
    onSuccess: () => {
      showSuccess('Almacén eliminado exitosamente');
      setIsDeleteOpen(false);
      setSelectedWarehouse(null);
      queryClient.invalidateQueries(['warehouses', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al eliminar almacén');
    },
  });

  // Handlers
  const handleOpenCreate = () => {
    setForm(defaultWarehouseForm(user, selectedBranchId));
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (w) => {
    setSelectedWarehouse(w);
    setForm({
      idEmpresa: w.id_empresa ?? idEmpresa,
      idSucursal: w.id_sucursal ?? selectedBranchId,
      codigo: w.codigo || '',
      nombre: w.nombre || '',
      descripcion: w.descripcion || '',
      default: !!w.default,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (w) => {
    setSelectedWarehouse(w);
    setIsDeleteOpen(true);
  };

  const canSubmit = () => {
    const codeOk = form.codigo && form.codigo.trim();
    const nameOk = form.nombre && form.nombre.trim();
    const branchOk = !!form.idSucursal;
    return codeOk && nameOk && branchOk;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content">Almacenes</h1>
      <p className="text-base-content/70 mb-4">Gestiona tus almacenes por sucursales</p>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Listado de Almacenes</h2>
            <select
              className="px-3 py-2 border border-base-300 rounded-md"
              value={selectedBranchId || ''}
              onChange={(e) => {
                const id = Number(e.target.value) || null;
                setSelectedBranchId(id);
                setForm(defaultWarehouseForm(user, id));
              }}
            >
              <option value="">Todas las sucursales</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre || b.codigo || `Sucursal ${b.id}`}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleOpenCreate}>Nuevo Almacén</Button>
        </div>

        {isWarehousesLoading || isBranchesLoading ? (
          <div className="py-8 flex justify-center"><LoadingSpinner /></div>
        ) : isWarehousesError ? (
          <div className="text-error">{warehousesError?.message || 'Error al cargar almacenes'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-base-100">
              <thead>
                <tr className="bg-base-200 text-left">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Sucursal</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Por defecto</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3" colSpan={6}>No hay almacenes registrados</td>
                  </tr>
                ) : (
                  filteredWarehouses.map((w) => {
                    const branch = branches.find((b) => b.id === w.id_sucursal);
                    return (
                      <tr key={w.id} className="border-t">
                        <td className="px-4 py-3">{w.codigo || `ALM-${w.id}`}</td>
                        <td className="px-4 py-3">{w.nombre}</td>
                        <td className="px-4 py-3">{branch?.nombre || branch?.codigo || `Sucursal ${w.id_sucursal}`}</td>
                        <td className="px-4 py-3">{w.descripcion || '-'}</td>
                        <td className="px-4 py-3">
                          {w.default ? (
                            <Badge variant="success">Sí</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(w)}>Editar</Button>
                            <Button variant="danger" size="sm" onClick={() => handleOpenDelete(w)}>Eliminar</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Crear Almacén */}
      <Modal
        title="Crear Almacén"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onConfirm={() => createMut.mutate(form)}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
        confirmDisabled={!canSubmit()}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-base-content mb-1.5">Sucursal</label>
            <select
              className="w-full px-3 py-2 border border-base-300 rounded-md"
              value={form.idSucursal || ''}
              onChange={(e) => setForm({ ...form, idSucursal: Number(e.target.value) || null })}
            >
              <option value="" disabled>Selecciona una sucursal</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.nombre || b.codigo || `Sucursal ${b.id}`}</option>
              ))}
            </select>
          </div>
          <Input label="Código" value={form.codigo} onChange={(v) => setForm({ ...form, codigo: v })} />
          <Input label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="almacen_default"
              checked={!!form.default}
              onChange={(e) => setForm({ ...form, default: e.target.checked })}
            />
            <label htmlFor="almacen_default">Por defecto en sucursal</label>
          </div>
        </div>
      </Modal>

      {/* Editar Almacén */}
      <Modal
        title="Editar Almacén"
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onConfirm={() => updateMut.mutate({ id: selectedWarehouse?.id, payload: form })}
        confirmText={updateMut.isLoading ? 'Actualizando...' : 'Guardar'}
        confirmDisabled={!canSubmit()}
      >
        <div className="space-y-4">
          <Input label="Código" value={form.codigo} onChange={(v) => setForm({ ...form, codigo: v })} />
          <Input label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="almacen_default_edit"
              checked={!!form.default}
              onChange={(e) => setForm({ ...form, default: e.target.checked })}
            />
            <label htmlFor="almacen_default_edit">Por defecto en sucursal</label>
          </div>
        </div>
      </Modal>

      {/* Eliminar Almacén */}
      <Modal
        title="Eliminar Almacén"
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMut.mutate(selectedWarehouse?.id)}
        confirmText={deleteMut.isLoading ? 'Eliminando...' : 'Eliminar'}
      >
        <p>¿Seguro que deseas eliminar el almacén "{selectedWarehouse?.nombre}"?</p>
      </Modal>
    </div>
  );
};

export default WarehousesPage;