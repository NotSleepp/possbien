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
    onSuccess: (data) => {
      console.log('[RolesPage] useQuery roles - SUCCESS:', data);
    },
    onError: (error) => {
      console.error('[RolesPage] useQuery roles - ERROR:', error);
    },
  });

  // Query para listar módulos
  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: listModules,
    onSuccess: (data) => {
      console.log('[RolesPage] useQuery modules - SUCCESS:', data);
    },
    onError: (error) => {
      console.error('[RolesPage] useQuery modules - ERROR:', error);
    },
  });

  // Query para listar permisos del rol seleccionado
  const { data: rolePermissions = [] } = useQuery({
    queryKey: ['permissions', selectedItem?.id],
    queryFn: () => listPermissionsByRole(selectedItem?.id),
    enabled: !!selectedItem?.id && isPermissionsOpen,
    onSuccess: (data) => {
      console.log('[RolesPage] useQuery rolePermissions - SUCCESS:', data);
    },
    onError: (error) => {
      console.error('[RolesPage] useQuery rolePermissions - ERROR:', error);
    },
  });

  // Mutaciones
  const createMut = useMutation({
    mutationFn: createRole,
    onMutate: (variables) => {
      console.log('[RolesPage] createMut - MUTATE with variables:', variables);
    },
    onSuccess: (data) => {
      console.log('[RolesPage] createMut - SUCCESS response:', data);
      success('Rol creado correctamente');
      setIsCreateOpen(false);
      setForm(defaultForm(user));
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => {
      console.error('[RolesPage] createMut - ERROR:', err);
      showError(err?.userMessage || 'Error al crear rol');
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateRole(id, payload),
    onMutate: (variables) => {
      console.log('[RolesPage] updateMut - MUTATE with variables:', variables);
    },
    onSuccess: (data) => {
      console.log('[RolesPage] updateMut - SUCCESS response:', data);
      success('Rol actualizado correctamente');
      setIsEditOpen(false);
      setSelectedItem(null);
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => {
      console.error('[RolesPage] updateMut - ERROR:', err);
      showError(err?.userMessage || 'Error al actualizar rol');
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteRole,
    onMutate: (variables) => {
      console.log('[RolesPage] deleteMut - MUTATE with variables (id):', variables);
    },
    onSuccess: (data) => {
      console.log('[RolesPage] deleteMut - SUCCESS response:', data);
      success('Rol eliminado correctamente');
      setIsDeleteOpen(false);
      setSelectedItem(null);
      queryClient.invalidateQueries({ queryKey: ['roles', idEmpresa] });
    },
    onError: (err) => {
      console.error('[RolesPage] deleteMut - ERROR:', err);
      showError(err?.userMessage || 'Error al eliminar rol');
    },
  });

  const assignPermissionsMut = useMutation({
    mutationFn: assignPermissions,
    onMutate: (variables) => {
      console.log('[RolesPage] assignPermissionsMut - MUTATE with variables:', variables);
    },
    onSuccess: (data) => {
      console.log('[RolesPage] assignPermissionsMut - SUCCESS response:', data);
      success('Permisos actualizados correctamente');
      setIsPermissionsOpen(false);
      setSelectedItem(null);
      setPermissions({});
      queryClient.invalidateQueries({ queryKey: ['permissions', selectedItem?.id] });
    },
    onError: (err) => {
      console.error('[RolesPage] assignPermissionsMut - ERROR:', err);
      showError(err?.userMessage || 'Error al actualizar permisos');
    },
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
      idEmpresa: item.idEmpresa ?? item.id_empresa, // soporta camelCase o snake_case
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
    });
    setErrors({});
    setIsEditOpen(true);
    console.log('[RolesPage] handleOpenEdit - item:', item);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
    console.log('[RolesPage] handleOpenDelete - item:', item);
  };

  const handleOpenPermissions = (item) => {
    setSelectedItem(item);
    setIsPermissionsOpen(true);
    console.log('[RolesPage] handleOpenPermissions - item:', item);
  };

  // Cuando se cargan los permisos del rol, inicializar el estado
  useEffect(() => {
    console.log('[RolesPage] rolePermissions useEffect - rolePermissions:', rolePermissions);
    if (rolePermissions.length > 0) {
      const permsMap = {};
      rolePermissions.forEach((perm) => {
        const moduleId = perm.idModulo ?? perm.id_modulo;
        permsMap[moduleId] = {
          puedeVer: perm.puedeVer ?? perm.puede_ver,
          puedeCrear: perm.puedeCrear ?? perm.puede_crear,
          puedeEditar: perm.puedeEditar ?? perm.puede_editar,
          puedeEliminar: perm.puedeEliminar ?? perm.puede_eliminar,
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
    console.log('[RolesPage] handleChange - field:', field, 'value:', value);
  };

  const handlePermissionChange = (moduleId, permission, value) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value,
      },
    }));
    console.log('[RolesPage] handlePermissionChange - moduleId:', moduleId, 'permission:', permission, 'value:', value);
  };

  const handleSubmitCreate = () => {
    const validation = validateRole(form);
    console.log('[RolesPage] handleSubmitCreate - form:', form, 'validation:', validation);
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
    console.log('[RolesPage] handleSubmitEdit - form:', form, 'validation:', validation);
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

    const payload = {
      idRol: selectedItem?.id,
      permisos: permissionsArray,
      idEmpresa: idEmpresa,
    };
    console.log('[RolesPage] handleSubmitPermissions - payload:', payload);
    assignPermissionsMut.mutate(payload);
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
