import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner, Modal } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listCategoriesByEmpresa, createCategory, updateCategory, deleteCategory } from '../features/settings/api/categories.api';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  descripcion: '',
});

const CategoriesPage = () => {
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
    queryKey: ['categories', idEmpresa],
    queryFn: async () => listCategoriesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const createMut = useMutation({
    mutationFn: async (payload) => createCategory(payload),
    onSuccess: () => {
      success('Categoría creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear categoría'),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      success('Categoría actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar categoría'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    onSuccess: () => {
      success('Categoría eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar categoría'),
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

  const canSubmit = (f) => !!(f.codigo && f.codigo.trim() && f.nombre && f.nombre.trim());

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Categorías</h1>
        <p className="text-base-content/60 mt-2">Administra las categorías de tus productos</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>Nueva Categoría</Button>
      </div>

      {/* Crear Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva Categoría"
        onConfirm={() => {
          if (!canSubmit(form)) {
            showError('Complete código y nombre');
            return;
          }
          createMut.mutate(form);
        }}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <div className="space-y-4">
          <Input label="Código" value={form.codigo} onChange={(v) => handleFormChange('codigo', v)} required />
          <Input label="Nombre" value={form.nombre} onChange={(v) => handleFormChange('nombre', v)} required />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => handleFormChange('descripcion', v)} />
        </div>
      </Modal>

      {/* Editar Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Categoría"
        onConfirm={() => {
          if (!canSubmit(form)) {
            showError('Complete código y nombre');
            return;
          }
          updateMut.mutate({ id: selectedItem?.id, payload: form });
        }}
        confirmText={updateMut.isLoading ? 'Guardando...' : 'Guardar'}
      >
        <div className="space-y-4">
          <Input label="Código" value={form.codigo} onChange={(v) => handleFormChange('codigo', v)} required />
          <Input label="Nombre" value={form.nombre} onChange={(v) => handleFormChange('nombre', v)} required />
          <Input label="Descripción" value={form.descripcion} onChange={(v) => handleFormChange('descripcion', v)} />
        </div>
      </Modal>

      <Card title="Listado de Categorías">
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3">{i.codigo}</td>
                    <td className="px-4 py-3">{i.nombre}</td>
                    <td className="px-4 py-3">{i.descripcion || '-'}</td>
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
        <p>¿Seguro que deseas eliminar la categoría "{selectedItem?.nombre}"?</p>
      </Modal>
    </div>
  );
};

export default CategoriesPage;