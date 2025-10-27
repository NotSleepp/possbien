import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import { ConfigurationLayout, ConfigurationTable, ConfigurationForm } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { listRolesByEmpresa } from '../features/settings/api/roles.api';
import {
  listUsersByEmpresa,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from '../features/settings/api/users.api';
import { validateUser } from '../features/settings/schemas/user.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  idRol: null,
  username: '',
  password: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  idTipodocumento: null,
  nroDoc: '',
  tema: 'light',
  estado: 'ACTIVO',
});

const UsersSettingsPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user));
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [newPassword, setNewPassword] = useState('');

  const idEmpresa = user?.id_empresa;

  // Query para listar roles
  const { data: roles = [] } = useQuery({
    queryKey: ['roles', idEmpresa],
    queryFn: () => listRolesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Query para listar usuarios
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['users', idEmpresa],
    queryFn: () => listUsersByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      success('Usuario creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['users', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear usuario'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => {
      success('Usuario actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['users', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar usuario'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      success('Usuario eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['users', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar usuario'),
  });

  const resetPasswordMut = useMutation({
    mutationFn: ({ id, password }) => resetPassword(id, { password }),
    onSuccess: () => {
      success('Contraseña restablecida correctamente');
      setIsResetPasswordOpen(false);
      setSelectedItem(null);
      setNewPassword('');
    },
    onError: (err) => showError(err?.userMessage || 'Error al restablecer contraseña'),
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
      idRol: item.id_rol,
      username: item.username || '',
      password: '', // No mostrar contraseña actual
      nombres: item.nombres || '',
      apellidos: item.apellidos || '',
      email: item.email || '',
      telefono: item.telefono || '',
      idTipodocumento: item.id_tipodocumento || null,
      nroDoc: item.nro_doc || '',
      tema: item.tema || 'light',
      estado: item.estado || 'ACTIVO',
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleOpenResetPassword = (item) => {
    setSelectedItem(item);
    setNewPassword('');
    setIsResetPasswordOpen(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitCreate = () => {
    const validation = validateUser(form, true);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateUser(form, false);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  const handleSubmitResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    resetPasswordMut.mutate({ id: selectedItem?.id, password: newPassword });
  };

  // Obtener nombre de rol
  const getRoleName = (idRol) => {
    const role = roles.find((r) => r.id === idRol);
    return role ? role.nombre : 'N/A';
  };

  // Configuración de columnas
  const columns = [
    { key: 'username', label: 'Usuario' },
    {
      key: 'nombres',
      label: 'Nombre Completo',
      render: (value, item) => `${value} ${item.apellidos}`,
    },
    {
      key: 'id_rol',
      label: 'Rol',
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
          {getRoleName(value)}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value || '-',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${value === 'ACTIVO' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
          {value}
        </span>
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFieldsCreate = [
    {
      name: 'username',
      label: 'Nombre de Usuario',
      type: 'text',
      placeholder: 'usuario123',
      required: true,
      hint: 'Solo letras, números, guiones y guiones bajos',
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: '••••••',
      required: true,
      hint: 'Mínimo 6 caracteres',
    },
    {
      name: 'nombres',
      label: 'Nombres',
      type: 'text',
      placeholder: 'Juan Carlos',
      required: true,
    },
    {
      name: 'apellidos',
      label: 'Apellidos',
      type: 'text',
      placeholder: 'Pérez García',
      required: true,
    },
    {
      name: 'idRol',
      label: 'Rol',
      type: 'select',
      required: true,
      options: roles.map((role) => ({
        value: role.id,
        label: role.nombre,
      })),
      hint: 'Define los permisos del usuario',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'usuario@ejemplo.com',
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      placeholder: '+51 999 999 999',
    },
    {
      name: 'nroDoc',
      label: 'Número de Documento',
      type: 'text',
      placeholder: '12345678',
    },
    {
      name: 'tema',
      label: 'Tema',
      type: 'select',
      options: [
        { value: 'light', label: 'Claro' },
        { value: 'dark', label: 'Oscuro' },
      ],
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'ACTIVO', label: 'Activo' },
        { value: 'INACTIVO', label: 'Inactivo' },
      ],
    },
  ];

  const formFieldsEdit = formFieldsCreate.filter((field) => field.name !== 'password');

  return (
    <ConfigurationLayout
      title="Usuarios"
      description="Gestiona los usuarios del sistema"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nuevo Usuario
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Usuarios' },
      ]}
    >
      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Usuario"
        onConfirm={handleSubmitCreate}
        confirmText={createMut.isLoading ? 'Creando...' : 'Crear'}
      >
        <ConfigurationForm
          fields={formFieldsCreate}
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
        title="Editar Usuario"
        onConfirm={handleSubmitEdit}
        confirmText={updateMut.isLoading ? 'Guardando...' : 'Guardar'}
      >
        <ConfigurationForm
          fields={formFieldsEdit}
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
        <p>¿Seguro que deseas eliminar el usuario "{selectedItem?.username}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Se cerrarán todas las sesiones activas del usuario.
        </p>
      </Modal>

      {/* Modal Restablecer Contraseña */}
      <Modal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        title="Restablecer Contraseña"
        onConfirm={handleSubmitResetPassword}
        confirmText={resetPasswordMut.isLoading ? 'Restableciendo...' : 'Restablecer'}
      >
        <div className="space-y-4">
          <p className="text-sm text-base-content/70">
            Ingresa la nueva contraseña para el usuario "{selectedItem?.username}"
          </p>
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-base-content/60 mt-1">Mínimo 6 caracteres</p>
          </div>
        </div>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        customActions={(item) => (
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleOpenResetPassword(item)}
            aria-label={`Restablecer contraseña de ${item.username}`}
          >
            Resetear
          </Button>
        )}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No hay usuarios registrados. Crea tu primer usuario para comenzar."
      />
    </ConfigurationLayout>
  );
};

export default UsersSettingsPage;
