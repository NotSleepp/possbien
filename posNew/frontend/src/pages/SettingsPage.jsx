import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../shared/components/ui';
import { ROLE_NAMES } from '../shared/constants';

/**
 * SettingsPage Component
 * Example admin-only page to demonstrate role-based access control
 * This page should only be accessible to SUPER_ADMIN and ADMIN roles
 */
const SettingsPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la configuración general del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Información del Usuario">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Nombre:</span>
              <p className="text-gray-900">
                {user?.nombre} {user?.apellido}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Usuario:</span>
              <p className="text-gray-900">{user?.username}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-900">{user?.email || 'No disponible'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Rol:</span>
              <p className="text-gray-900">{ROLE_NAMES[user?.id_rol]}</p>
            </div>
          </div>
        </Card>

        <Card title="Configuración General">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mi Empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>USD - Dólar</option>
                <option>MXN - Peso Mexicano</option>
                <option>EUR - Euro</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Seguridad">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Autenticación de dos factores</p>
                <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Activar
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Cambiar contraseña</p>
                <p className="text-sm text-gray-500">Actualiza tu contraseña</p>
              </div>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Cambiar
              </button>
            </div>
          </div>
        </Card>

        <Card title="Notificaciones">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Notificaciones por email</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Alertas de ventas</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Reportes semanales</span>
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-yellow-400 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Página de Ejemplo - Solo Administradores
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Esta página demuestra el control de acceso basado en roles. Solo los usuarios con rol de
              Administrador o Super Administrador pueden ver este contenido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
