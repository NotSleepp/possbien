import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listCategoriesByEmpresa,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../features/settings/api/categories.api';
import { validateCategory } from '../features/settings/schemas/category.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  codigo: '',
  nombre: '',
  descripcion: '',
  color: '#3b82f6',
  icono: 'folder',
});

// Iconos disponibles (puedes expandir esta lista)
const availableIcons = [
  { value: 'folder', label: '📁 Carpeta', icon: '📁' },
  { value: 'box', label: '📦 Caja', icon: '📦' },
  { value: 'tag', label: '🏷️ Etiqueta', icon: '🏷️' },
  { value: 'star', label: '⭐ Estrella', icon: '⭐' },
  { value: 'heart', label: '❤️ Corazón', icon: '❤️' },
  { value: 'shopping', label: '🛒 Compras', icon: '🛒' },
  { value: 'food', label: '🍔 Comida', icon: '🍔' },
  { value: 'drink', label: '🥤 Bebida', icon: '🥤' },
  { value: 'tech', label: '💻 Tecnología', icon: '💻' },
  { value: 'home', label: '🏠 Hogar', icon: '🏠' },
  { value: 'clothes', label: '👕 Ropa', icon: '👕' },
  { value: 'book', label: '📚 Libros', icon: '📚' },
  { value: 'tool', label: '🔧 Herramientas', icon: '🔧' },
  { value: 'medical', label: '💊 Médico', icon: '💊' },
  { value: 'sport', label: '⚽ Deportes', icon: '⚽' },
];

// Colores predefinidos
const predefinedColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

const CategoriesPage = () => {
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

  // Query para listar categorías
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['categories', idEmpresa],
    queryFn: () => listCategoriesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      success('Categoría creada correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear categoría'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      success('Categoría actualizada correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar categoría'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      success('Categoría eliminada correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['categories', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar categoría'),
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
      color: item.color || '#3b82f6',
      icono: item.icono || 'folder',
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
    const validation = validateCategory(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateCategory(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  // Obtener ícono por valor
  const getIconEmoji = (iconValue) => {
    const icon = availableIcons.find((i) => i.value === iconValue);
    return icon ? icon.icon : '📁';
  };

  // Configuración de columnas
  const columns = [
    {
      key: 'icono',
      label: 'Ícono',
      render: (value) => (
        <span className="text-2xl">{getIconEmoji(value)}</span>
      ),
    },
    {
      key: 'color',
      label: 'Color',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-base-300"
            style={{ backgroundColor: value || '#3b82f6' }}
          />
          <span className="text-xs text-base-content/60">{value || '#3b82f6'}</span>
        </div>
      ),
    },
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
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
          {value ? 'Activa' : 'Inactiva'}
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
      placeholder: 'ELECTRO',
      required: true,
      hint: 'Código único de la categoría (solo mayúsculas, números, guiones)',
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Electrónica',
      required: true,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción de la categoría (opcional)',
      rows: 2,
    },
  ];

  return (
    <ConfigurationLayout
      title="Categorías"
      description="Gestiona las categorías de tus productos"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nueva Categoría
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Categorías' },
      ]}
    >
      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nueva Categoría"
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

          {/* Selector de Color */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Color de la Categoría
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-10 h-10 rounded border-2 transition-all ${
                    form.color === color ? 'border-base-content scale-110' : 'border-base-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 rounded border border-base-300 cursor-pointer"
            />
            <p className="text-xs text-base-content/60 mt-1">Color actual: {form.color}</p>
          </div>

          {/* Selector de Ícono */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Ícono de la Categoría
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => handleChange('icono', icon.value)}
                  className={`p-3 rounded border-2 transition-all text-2xl hover:scale-110 ${
                    form.icono === icon.value
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-base-content/30'
                  }`}
                  title={icon.label}
                >
                  {icon.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Vista Previa
            </label>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-base-300">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: form.color }}
              >
                {getIconEmoji(form.icono)}
              </div>
              <div>
                <p className="font-medium text-base-content">{form.nombre || 'Nombre de categoría'}</p>
                <p className="text-sm text-base-content/60">{form.codigo || 'CODIGO'}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Categoría"
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

          {/* Selector de Color */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Color de la Categoría
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-10 h-10 rounded border-2 transition-all ${
                    form.color === color ? 'border-base-content scale-110' : 'border-base-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={form.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 rounded border border-base-300 cursor-pointer"
            />
            <p className="text-xs text-base-content/60 mt-1">Color actual: {form.color}</p>
          </div>

          {/* Selector de Ícono */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Ícono de la Categoría
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => handleChange('icono', icon.value)}
                  className={`p-3 rounded border-2 transition-all text-2xl hover:scale-110 ${
                    form.icono === icon.value
                      ? 'border-primary bg-primary/10'
                      : 'border-base-300 hover:border-base-content/30'
                  }`}
                  title={icon.label}
                >
                  {icon.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Vista Previa */}
          <div className="border-t border-base-300 pt-4">
            <label className="block text-sm font-medium text-base-content mb-2">
              Vista Previa
            </label>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-base-300">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: form.color }}
              >
                {getIconEmoji(form.icono)}
              </div>
              <div>
                <p className="font-medium text-base-content">{form.nombre || 'Nombre de categoría'}</p>
                <p className="text-sm text-base-content/60">{form.codigo || 'CODIGO'}</p>
              </div>
            </div>
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
        <p>¿Seguro que deseas eliminar la categoría "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no haya productos asociados a esta categoría.
        </p>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No hay categorías registradas. Crea tu primera categoría para comenzar."
      />
    </ConfigurationLayout>
  );
};

export default CategoriesPage;
