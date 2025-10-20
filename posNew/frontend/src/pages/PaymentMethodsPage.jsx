import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner, Modal } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listPaymentMethodsByEmpresa, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../features/settings/api/paymentMethods.api';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  imagen: '',
  requiereReferencia: false,
  activo: true,
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

  const idEmpresa = user?.id_empresa;

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['payment-methods', idEmpresa],
    queryFn: async () => {
      const data = await listPaymentMethodsByEmpresa(idEmpresa);
      return data;
    },
    enabled: !!idEmpresa,
  });

  const createMut = useMutation({
    mutationFn: async (payload) => createPaymentMethod(payload),
    onSuccess: () => {
      success('Método de pago creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear método de pago'),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }) => updatePaymentMethod(id, payload),
    onSuccess: () => {
      success('Método de pago actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar método de pago'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => deletePaymentMethod(id),
    onSuccess: () => {
      success('Método de pago eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['payment-methods', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar método de pago'),
  });

  const handleOpenCreate = () => {
    setForm(defaultForm(user));
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
      requiereReferencia: !!item.requiere_referencia,
      activo: item.activo ?? true,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métodos de Pago</h1>
          <p className="text-gray-600 mt-2">Administra los métodos de pago disponibles</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>Nuevo Método</Button>
      </div>

      <Card title="Listado de Métodos de Pago">
        {isLoading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : isError ? (
          <p className="text-error">No se pudo cargar el listado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-300">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Requiere Referencia</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3">{i.codigo}</td>
                    <td className="px-4 py-3">{i.nombre}</td>
                    <td className="px-4 py-3">{i.requiere_referencia ? 'Sí' : 'No'}</td>
                    <td className="px-4 py-3">{i.activo ? 'Activo' : 'Inactivo'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(i)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleOpenDelete(i)}>Eliminar</Button>
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
        title="Nuevo Método de Pago"
        onConfirm={() => createMut.mutate(form)}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <div className="space-y-4">
          <Input label="Código" value={form.codigo} onChange={(v) => handleFormChange('codigo', v)} required />
          <Input label="Nombre" value={form.nombre} onChange={(v) => handleFormChange('nombre', v)} required />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => handleFormChange('descripcion', v)} />
          <Input label="URL Imagen" value={form.imagen} onChange={(v) => handleFormChange('imagen', v)} />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiereReferencia"
              checked={form.requiereReferencia}
              onChange={(e) => handleFormChange('requiereReferencia', e.target.checked)}
            />
            <label htmlFor="requiereReferencia">Requiere referencia</label>
          </div>
        </div>
      </Modal>

      {/* Editar Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Método de Pago"
        onConfirm={() => updateMut.mutate({ id: selectedItem?.id, payload: form })}
        confirmText={updateMut.isLoading ? 'Actualizando...' : 'Guardar'}
      >
        <div className="space-y-4">
          <Input label="Código" value={form.codigo} onChange={(v) => handleFormChange('codigo', v)} required />
          <Input label="Nombre" value={form.nombre} onChange={(v) => handleFormChange('nombre', v)} required />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => handleFormChange('descripcion', v)} />
          <Input label="URL Imagen" value={form.imagen} onChange={(v) => handleFormChange('imagen', v)} />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiereReferenciaEdit"
              checked={form.requiereReferencia}
              onChange={(e) => handleFormChange('requiereReferencia', e.target.checked)}
            />
            <label htmlFor="requiereReferenciaEdit">Requiere referencia</label>
          </div>
        </div>
      </Modal>

      {/* Eliminar Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirmar eliminación"
        onConfirm={() => deleteMut.mutate(selectedItem?.id)}
        confirmText={deleteMut.isLoading ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        variant="danger"
      >
        <p>¿Seguro que deseas eliminar el método "{selectedItem?.nombre}"?</p>
      </Modal>
    </div>
  );
};

export default PaymentMethodsPage;