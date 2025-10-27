import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from '../shared/components/ui';
import {
  ConfigurationLayout,
  ConfigurationTable,
  ConfigurationForm,
  PermissionsMatrix,
} from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import {
  listRolesByEmpresa,
  createRole,
  updateRole,
  deleteRole,
} from '../features/settings/api/roles.api';
import {
  listModules,
  listPermissionsByRole,
  assignPermissions,
} from '../features/settings/api/permissions.api';
import { validateRole } from '../features/settings/schemas/role.schema';

const defaultForm = (user) => ({
  idEmpresa: user?.id_empresa || null,
  nombre: '',
  descripcion: '',
});

const RolesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [form, setForm] = useState(() => defaultForm(user));
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [permissions, setPermissions] = useState({});

  const idEmpresa = user?.id_empresa;

  // Query para listar roles
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['roles', idEmpresa],
    queryFn: () => listRolesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Query para listar módulos
  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: listModules,
  });

  // Query para listar permisos del rol seleccionado
  const { data: rolePermissions = [] } = useQuery({
    queryKey: ['permissions', selectedItem?.id],
    queryFn: () => listPermissionsByRole(selectedItem?.id),
    enabled: !!selectedItem?.id && isPermissionsOpen,
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      success('Rol creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al crear rol'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateRole(id, payload),
    onSuccess: () => {
      success('Rol actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar rol'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      success('Rol eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al eliminar rol'),
  });

  const assignPermissionsMut = useMutation({
    mutationFn: assignPermissions,
    onSuccess: () => {
      success('Permisos actualizados correctamente');
      setIsPermissionsOpen(false);
      setSelectedItem(null);
      setPermissions({});
      queryClient.invalidateQueries({ queryKey: ['permissions', selectedItem?.id] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar permisos'),
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
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
    });
    setErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleOpenPermissions = (item) => {
    setSelectedItem(item);
    setIsPermissionsOpen(true);
  };

  // Cuando se cargan los permisos del rol, inicializar el estado
  useEffect(() => {
    if (rolePermissions.length > 0) {
      const permsMap = {};
      rolePermissions.forEach((perm) => {
        permsMap[perm.id_modulo] = {
          puedeVer: perm.puede_ver,
          puedeCrear: perm.puede_crear,
          puedeEditar: perm.puede_editar,
          puedeEliminar: perm.puede_eliminar,
        };
      });
      setPermissions(permsMap);
    }
  }, [rolePermissions]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePermissionChange = (moduleId, permission, value) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value,
      },
    }));
  };

  const handleSubmitCreate = () => {
    const validation = validateRole(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    createMut.mutate(form);
  };

  const handleSubmitEdit = () => {
    const validation = validateRole(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }
    setErrors({});
    updateMut.mutate({ id: selectedItem?.id, payload: form });
  };

  const handleSubmitPermissions = () => {
    // Convertir el objeto de permisos a array para enviar al backend
    const permissionsArray = Object.entries(permissions).map(([moduleId, perms]) => ({
      idRol: selectedItem?.id,
      idModulo: Number(moduleId),
      puedeVer: perms.puedeVer || false,
      puedeCrear: perms.puedeCrear || false,
      puedeEditar: perms.puedeEditar || false,
      puedeEliminar: perms.puedeEliminar || false,
    }));

    assignPermissionsMut.mutate({
      idRol: selectedItem?.id,
      permisos: permissionsArray,
    });
  };

  // Configuración de columnas
  const columns = [
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
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Rol',
      type: 'text',
      placeholder: 'Administrador',
      required: true,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción del rol (opcional)',
      rows: 2,
    },
  ];

  return (
    <ConfigurationLayout
      title="Roles y Permisos"
      description="Gestiona los roles y sus permisos en el sistema"
      actions={
        <Button variant="primary" onClick={handleOpenCreate}>
          Nuevo Rol
        </Button>
      }
      breadcrumbs={[
        { label: 'Configuración', href: '/settings' },
        { label: 'Roles' },
      ]}
    >
      {/* Modal Crear */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Nuevo Rol"
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
        title="Editar Rol"
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
        <p>¿Seguro que deseas eliminar el rol "{selectedItem?.nombre}"?</p>
        <p className="text-sm text-base-content/60 mt-2">
          Esta acción no se puede deshacer. Asegúrate de que no haya usuarios asignados a este rol.
        </p>
      </Modal>

      {/* Modal Permisos */}
      <Modal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        title={`Permisos del Rol: ${selectedItem?.nombre}`}
        onConfirm={handleSubmitPermissions}
        confirmText={assignPermissionsMut.isLoading ? 'Guardando...' : 'Guardar Permisos'}
        size="large"
      >
        <div className="space-y-4">
          <p className="text-sm text-base-content/70">
            Selecciona los permisos que tendrá este rol en cada módulo del sistema.
          </p>
          <PermissionsMatrix
            modules={modules}
            permissions={permissions}
            onChange={handlePermissionChange}
          />
        </div>
      </Modal>

      {/* Tabla */}
      <ConfigurationTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        customActions={(item) => (
          <Button
            variant="info"
            size="sm"
            onClick={() => handleOpenPermissions(item)}
            aria-label={`Gestionar permisos de ${item.nombre}`}
          >
            Permisos
          </Button>
        )}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        emptyMessage="No hay roles registrados. Crea tu primer rol para comenzar."
      />
    </ConfigurationLayout>
  );
};

export default RolesPage;
