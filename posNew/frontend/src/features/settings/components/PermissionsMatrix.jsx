import PropTypes from 'prop-types';

/**
 * Matriz de permisos para roles
 * Muestra una tabla con módulos y checkboxes para ver/crear/editar/eliminar
 */
const PermissionsMatrix = ({ modules, permissions, onChange, readOnly = false }) => {
  const handlePermissionChange = (moduleId, permission, value) => {
    if (readOnly) return;
    onChange(moduleId, permission, value);
  };

  const handleSelectAll = (permission) => {
    if (readOnly) return;
    const allChecked = modules.every((module) => permissions[module.id]?.[permission]);
    modules.forEach((module) => {
      onChange(module.id, permission, !allChecked);
    });
  };

  const handleSelectModule = (moduleId) => {
    if (readOnly) return;
    const allPermissions = ['puedeVer', 'puedeCrear', 'puedeEditar', 'puedeEliminar'];
    const allChecked = allPermissions.every((perm) => permissions[moduleId]?.[perm]);
    allPermissions.forEach((perm) => {
      onChange(moduleId, perm, !allChecked);
    });
  };

  const isAllChecked = (permission) => {
    return modules.every((module) => permissions[module.id]?.[permission]);
  };

  const isModuleAllChecked = (moduleId) => {
    const allPermissions = ['puedeVer', 'puedeCrear', 'puedeEditar', 'puedeEliminar'];
    return allPermissions.every((perm) => permissions[moduleId]?.[perm]);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-base-content">
              Módulo
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-base-content">
              <div className="flex flex-col items-center gap-1">
                <span>Ver</span>
                {!readOnly && (
                  <input
                    type="checkbox"
                    checked={isAllChecked('puedeVer')}
                    onChange={() => handleSelectAll('puedeVer')}
                    className="checkbox checkbox-sm"
                    title="Seleccionar todos"
                  />
                )}
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-base-content">
              <div className="flex flex-col items-center gap-1">
                <span>Crear</span>
                {!readOnly && (
                  <input
                    type="checkbox"
                    checked={isAllChecked('puedeCrear')}
                    onChange={() => handleSelectAll('puedeCrear')}
                    className="checkbox checkbox-sm"
                    title="Seleccionar todos"
                  />
                )}
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-base-content">
              <div className="flex flex-col items-center gap-1">
                <span>Editar</span>
                {!readOnly && (
                  <input
                    type="checkbox"
                    checked={isAllChecked('puedeEditar')}
                    onChange={() => handleSelectAll('puedeEditar')}
                    className="checkbox checkbox-sm"
                    title="Seleccionar todos"
                  />
                )}
              </div>
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-base-content">
              <div className="flex flex-col items-center gap-1">
                <span>Eliminar</span>
                {!readOnly && (
                  <input
                    type="checkbox"
                    checked={isAllChecked('puedeEliminar')}
                    onChange={() => handleSelectAll('puedeEliminar')}
                    className="checkbox checkbox-sm"
                    title="Seleccionar todos"
                  />
                )}
              </div>
            </th>
            {!readOnly && (
              <th className="px-4 py-3 text-center text-sm font-semibold text-base-content">
                Todos
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-base-100 divide-y divide-base-300">
          {modules.map((module) => (
            <tr key={module.id} className="hover:bg-base-200 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-base-content">
                {module.nombre}
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={permissions[module.id]?.puedeVer || false}
                  onChange={(e) =>
                    handlePermissionChange(module.id, 'puedeVer', e.target.checked)
                  }
                  disabled={readOnly}
                  className="checkbox checkbox-sm"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={permissions[module.id]?.puedeCrear || false}
                  onChange={(e) =>
                    handlePermissionChange(module.id, 'puedeCrear', e.target.checked)
                  }
                  disabled={readOnly}
                  className="checkbox checkbox-sm"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={permissions[module.id]?.puedeEditar || false}
                  onChange={(e) =>
                    handlePermissionChange(module.id, 'puedeEditar', e.target.checked)
                  }
                  disabled={readOnly}
                  className="checkbox checkbox-sm"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={permissions[module.id]?.puedeEliminar || false}
                  onChange={(e) =>
                    handlePermissionChange(module.id, 'puedeEliminar', e.target.checked)
                  }
                  disabled={readOnly}
                  className="checkbox checkbox-sm"
                />
              </td>
              {!readOnly && (
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isModuleAllChecked(module.id)}
                    onChange={() => handleSelectModule(module.id)}
                    className="checkbox checkbox-sm"
                    title="Seleccionar todos los permisos"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {modules.length === 0 && (
        <div className="text-center py-8 text-base-content/60">
          No hay módulos disponibles
        </div>
      )}
    </div>
  );
};

PermissionsMatrix.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  permissions: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

export default PermissionsMatrix;
