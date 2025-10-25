import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner, Modal } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listBranchesByEmpresa,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../features/settings/api/branches.api';
import {
  listCajasBySucursal,
  createCaja,
  updateCaja,
  deleteCaja,
} from '../features/settings/api/cajas.api';

const defaultBranchForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  direccion: '',
  direccionFiscal: '',
  telefono: '',
  email: '',
});

const defaultCajaForm = (selectedBranchId) => ({
  idSucursal: selectedBranchId || null,
  codigo: '',
  nombre: '',
  saldoInicial: 0,
});

const BranchesCajasPage = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;
  const { success: showSuccess, error: showError } = useToastStore();

  // UI state
  const [isCreateBranchOpen, setIsCreateBranchOpen] = useState(false);
  const [isEditBranchOpen, setIsEditBranchOpen] = useState(false);
  const [isDeleteBranchOpen, setIsDeleteBranchOpen] = useState(false);
  const [branchForm, setBranchForm] = useState(defaultBranchForm(user));
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isCreateCajaOpen, setIsCreateCajaOpen] = useState(false);
  const [isEditCajaOpen, setIsEditCajaOpen] = useState(false);
  const [isDeleteCajaOpen, setIsDeleteCajaOpen] = useState(false);
  const [cajaForm, setCajaForm] = useState(defaultCajaForm(null));
  const [selectedCaja, setSelectedCaja] = useState(null);

  // Queries
  const {
    data: branches = [],
    isLoading: isBranchesLoading,
    isError: isBranchesError,
    error: branchesError,
  } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) throw new Error('No se encontró la empresa del usuario');
      return await listBranchesByEmpresa(idEmpresa);
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000,
  });

  const selectedBranchId = selectedBranch?.id || null;

  const {
    data: cajas = [],
    isLoading: isCajasLoading,
    isError: isCajasError,
    error: cajasError,
  } = useQuery({
    queryKey: ['cajas', selectedBranchId],
    queryFn: async () => {
      if (!selectedBranchId) return [];
      return await listCajasBySucursal(selectedBranchId);
    },
    enabled: !!selectedBranchId,
    staleTime: 5 * 60 * 1000,
  });

  // Branch mutations
  const createBranchMut = useMutation({
    mutationFn: async (payload) => {
      return await createBranch(payload);
    },
    onSuccess: () => {
      showSuccess('Sucursal creada exitosamente');
      setIsCreateBranchOpen(false);
      setBranchForm(defaultBranchForm(user));
      queryClient.invalidateQueries(['branches', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al crear sucursal');
    },
  });

  const updateBranchMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await updateBranch(id, payload);
    },
    onSuccess: () => {
      showSuccess('Sucursal actualizada exitosamente');
      setIsEditBranchOpen(false);
      setSelectedBranch(null);
      queryClient.invalidateQueries(['branches', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al actualizar sucursal');
    },
  });

  const deleteBranchMut = useMutation({
    mutationFn: async (id) => {
      return await deleteBranch(id);
    },
    onSuccess: () => {
      showSuccess('Sucursal eliminada exitosamente');
      setIsDeleteBranchOpen(false);
      setSelectedBranch(null);
      queryClient.invalidateQueries(['branches', idEmpresa]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al eliminar sucursal');
    },
  });

  // Caja mutations
  const createCajaMut = useMutation({
    mutationFn: async (payload) => {
      return await createCaja(payload);
    },
    onSuccess: () => {
      showSuccess('Caja creada exitosamente');
      setIsCreateCajaOpen(false);
      setCajaForm(defaultCajaForm(selectedBranchId));
      queryClient.invalidateQueries(['cajas', selectedBranchId]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al crear caja');
    },
  });

  const updateCajaMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await updateCaja(id, payload);
    },
    onSuccess: () => {
      showSuccess('Caja actualizada exitosamente');
      setIsEditCajaOpen(false);
      setSelectedCaja(null);
      queryClient.invalidateQueries(['cajas', selectedBranchId]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al actualizar caja');
    },
  });

  const deleteCajaMut = useMutation({
    mutationFn: async (id) => {
      return await deleteCaja(id);
    },
    onSuccess: () => {
      showSuccess('Caja eliminada exitosamente');
      setIsDeleteCajaOpen(false);
      setSelectedCaja(null);
      queryClient.invalidateQueries(['cajas', selectedBranchId]);
    },
    onError: (err) => {
      showError(err?.userMessage || err?.message || 'Error al eliminar caja');
    },
  });

  // Handlers Branches
  const handleOpenCreateBranch = () => {
    setBranchForm(defaultBranchForm(user));
    setIsCreateBranchOpen(true);
  };

  const handleOpenEditBranch = (branch) => {
    setSelectedBranch(branch);
    setBranchForm({
      idEmpresa: branch.id_empresa ?? idEmpresa,
      codigo: branch.codigo || '',
      nombre: branch.nombre || '',
      direccion: branch.direccion || '',
      direccionFiscal: branch.direccion_fiscal || '',
      telefono: branch.telefono || '',
      email: branch.email || '',
    });
    setIsEditBranchOpen(true);
  };

  const handleOpenDeleteBranch = (branch) => {
    setSelectedBranch(branch);
    setIsDeleteBranchOpen(true);
  };

  const canSubmitBranch = () => {
    return branchForm.codigo?.trim() && branchForm.nombre?.trim();
  };

  // Handlers Cajas
  const handleOpenCreateCaja = () => {
    if (!selectedBranchId) {
      showError('Selecciona una sucursal antes de crear una caja');
      return;
    }
    setCajaForm(defaultCajaForm(selectedBranchId));
    setIsCreateCajaOpen(true);
  };

  const handleOpenEditCaja = (caja) => {
    setSelectedCaja(caja);
    setCajaForm({
      idSucursal: caja.id_sucursal || selectedBranchId,
      codigo: caja.codigo || '',
      nombre: caja.nombre || '',
      saldoInicial: Number(caja.monto_inicial ?? 0),
    });
    setIsEditCajaOpen(true);
  };

  const handleOpenDeleteCaja = (caja) => {
    setSelectedCaja(caja);
    setIsDeleteCajaOpen(true);
  };

  const canSubmitCaja = () => {
    return cajaForm.idSucursal && cajaForm.codigo?.trim() && cajaForm.nombre?.trim();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content">Sucursales y cajas</h1>
      <p className="text-base-content/70 mb-4">Gestiona tus sucursales y cajas</p>

      {/* Sucursales */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sucursales</h2>
          <Button onClick={handleOpenCreateBranch}>Nueva Sucursal</Button>
        </div>
        {isBranchesLoading ? (
          <div className="py-8 flex justify-center"><LoadingSpinner /></div>
        ) : isBranchesError ? (
          <div className="text-red-600">{branchesError?.message || 'Error al cargar sucursales'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-base-100">
            <thead>
              <tr className="bg-base-200 text-left">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Dirección</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {branches.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3" colSpan={6}>No hay sucursales registradas</td>
                  </tr>
                ) : (
                  branches.map((branch) => (
                    <tr key={branch.id} className="border-t">
                      <td className="px-4 py-3">{branch.codigo || `SUC-${branch.id}`}</td>
                      <td className="px-4 py-3">{branch.nombre}</td>
                      <td className="px-4 py-3">{branch.direccion || branch.direccion_fiscal || '-'}</td>
                      <td className="px-4 py-3">{branch.telefono || '-'}</td>
                      <td className="px-4 py-3">{branch.email || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleOpenEditBranch(branch)}>Editar</Button>
                          <Button variant="danger" size="sm" onClick={() => handleOpenDeleteBranch(branch)}>Eliminar</Button>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBranch(branch)}>Ver Cajas</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Cajas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Cajas</h2>
            <select
              className="px-3 py-2 border border-base-300 rounded-md"
              value={selectedBranchId || ''}
              onChange={(e) => {
                const id = Number(e.target.value) || null;
                const branch = branches.find((b) => b.id === id);
                setSelectedBranch(branch || null);
                setCajaForm(defaultCajaForm(id));
              }}
            >
              <option value="" disabled>Selecciona una sucursal</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.nombre || b.codigo || `Sucursal ${b.id}`}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleOpenCreateCaja} disabled={!selectedBranchId}>Nueva Caja</Button>
        </div>
        {!selectedBranchId ? (
          <div className="text-base-content/60">Selecciona una sucursal para ver sus cajas</div>
        ) : isCajasLoading ? (
          <div className="py-8 flex justify-center"><LoadingSpinner /></div>
        ) : isCajasError ? (
          <div className="text-red-600">{cajasError?.message || 'Error al cargar cajas'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-base-100">
              <thead>
                <tr className="bg-base-200 text-left">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Saldo inicial</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cajas.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3" colSpan={4}>No hay cajas registradas en esta sucursal</td>
                  </tr>
                ) : (
                  cajas.map((caja) => (
                    <tr key={caja.id} className="border-t">
                      <td className="px-4 py-3">{caja.codigo || `CAJ-${caja.id}`}</td>
                      <td className="px-4 py-3">{caja.nombre}</td>
                      <td className="px-4 py-3">{Number(caja.monto_inicial ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleOpenEditCaja(caja)}>Editar</Button>
                          <Button variant="danger" size="sm" onClick={() => handleOpenDeleteCaja(caja)}>Eliminar</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modales Sucursales */}
      <Modal
        title="Crear Sucursal"
        isOpen={isCreateBranchOpen}
        onClose={() => setIsCreateBranchOpen(false)}
        onConfirm={() => createBranchMut.mutate(branchForm)}
        confirmText={createBranchMut.isLoading ? 'Creando...' : 'Crear'}
        confirmDisabled={!canSubmitBranch()}
      >
        <div className="space-y-4">
          <Input label="Código" value={branchForm.codigo} onChange={(val) => setBranchForm({ ...branchForm, codigo: val })} />
          <Input label="Nombre" value={branchForm.nombre} onChange={(val) => setBranchForm({ ...branchForm, nombre: val })} />
          <Input label="Dirección" value={branchForm.direccion} onChange={(val) => setBranchForm({ ...branchForm, direccion: val })} />
          <Input label="Dirección Fiscal" value={branchForm.direccionFiscal} onChange={(val) => setBranchForm({ ...branchForm, direccionFiscal: val })} />
          <Input label="Teléfono" value={branchForm.telefono} onChange={(val) => setBranchForm({ ...branchForm, telefono: val })} />
          <Input label="Email" type="email" value={branchForm.email} onChange={(val) => setBranchForm({ ...branchForm, email: val })} />
        </div>
      </Modal>

      <Modal
        title="Editar Sucursal"
        isOpen={isEditBranchOpen}
        onClose={() => setIsEditBranchOpen(false)}
        onConfirm={() => updateBranchMut.mutate({ id: selectedBranch?.id, payload: branchForm })}
        confirmText={updateBranchMut.isLoading ? 'Actualizando...' : 'Guardar'}
        confirmDisabled={!canSubmitBranch()}
      >
        <div className="space-y-4">
          <Input label="Código" value={branchForm.codigo} onChange={(val) => setBranchForm({ ...branchForm, codigo: val })} />
          <Input label="Nombre" value={branchForm.nombre} onChange={(val) => setBranchForm({ ...branchForm, nombre: val })} />
          <Input label="Dirección" value={branchForm.direccion} onChange={(val) => setBranchForm({ ...branchForm, direccion: val })} />
          <Input label="Dirección Fiscal" value={branchForm.direccionFiscal} onChange={(val) => setBranchForm({ ...branchForm, direccionFiscal: val })} />
          <Input label="Teléfono" value={branchForm.telefono} onChange={(val) => setBranchForm({ ...branchForm, telefono: val })} />
          <Input label="Email" type="email" value={branchForm.email} onChange={(val) => setBranchForm({ ...branchForm, email: val })} />
        </div>
      </Modal>

      <Modal
        title="Eliminar Sucursal"
        isOpen={isDeleteBranchOpen}
        onClose={() => setIsDeleteBranchOpen(false)}
        onConfirm={() => deleteBranchMut.mutate(selectedBranch?.id)}
        confirmText={deleteBranchMut.isLoading ? 'Eliminando...' : 'Eliminar'}
      >
        <p>¿Seguro que deseas eliminar la sucursal "{selectedBranch?.nombre}"?</p>
      </Modal>

      {/* Modales Cajas */}
      <Modal
        title="Crear Caja"
        isOpen={isCreateCajaOpen}
        onClose={() => setIsCreateCajaOpen(false)}
        onConfirm={() => createCajaMut.mutate(cajaForm)}
        confirmText={createCajaMut.isLoading ? 'Creando...' : 'Crear'}
        confirmDisabled={!canSubmitCaja()}
      >
        <div className="space-y-4">
          <Input label="Código" value={cajaForm.codigo} onChange={(val) => setCajaForm({ ...cajaForm, codigo: val })} />
          <Input label="Nombre" value={cajaForm.nombre} onChange={(val) => setCajaForm({ ...cajaForm, nombre: val })} />
          <Input label="Saldo inicial" type="number" value={cajaForm.saldoInicial} onChange={(val) => setCajaForm({ ...cajaForm, saldoInicial: Number(val) })} />
        </div>
      </Modal>

      <Modal
        title="Editar Caja"
        isOpen={isEditCajaOpen}
        onClose={() => setIsEditCajaOpen(false)}
        onConfirm={() => updateCajaMut.mutate({ id: selectedCaja?.id, payload: cajaForm })}
        confirmText={updateCajaMut.isLoading ? 'Actualizando...' : 'Guardar'}
        confirmDisabled={!canSubmitCaja()}
      >
        <div className="space-y-4">
          <Input label="Código" value={cajaForm.codigo} onChange={(val) => setCajaForm({ ...cajaForm, codigo: val })} />
          <Input label="Nombre" value={cajaForm.nombre} onChange={(val) => setCajaForm({ ...cajaForm, nombre: val })} />
          <Input label="Saldo inicial" type="number" value={cajaForm.saldoInicial} onChange={(val) => setCajaForm({ ...cajaForm, saldoInicial: Number(val) })} />
        </div>
      </Modal>

      <Modal
        title="Eliminar Caja"
        isOpen={isDeleteCajaOpen}
        onClose={() => setIsDeleteCajaOpen(false)}
        onConfirm={() => deleteCajaMut.mutate(selectedCaja?.id)}
        confirmText={deleteCajaMut.isLoading ? 'Eliminando...' : 'Eliminar'}
      >
        <p>¿Seguro que deseas eliminar la caja "{selectedCaja?.nombre}"?</p>
      </Modal>
    </div>
  );
};

export default BranchesCajasPage;