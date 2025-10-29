import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../shared/components/ui';
import { useAuthStore } from '../store/useAuthStore';
import {
  FiPrinter,
  FiBriefcase,
  FiTag,
  FiPackage,
  FiUser,
  FiTruck,
  FiCreditCard,
  FiHome,
  FiUsers,
  FiArchive,
  FiFileText,
  FiHash,
  FiShield,
  FiMapPin,
} from 'react-icons/fi';
import { listBranchesByEmpresa } from '../features/settings/api/branches.api';
import { listWarehousesByBranch } from '../features/settings/api/warehouses.api';
import { listCajasBySucursal } from '../features/settings/api/cajas.api';
import { listPrintersByEmpresa } from '../features/settings/api/printers.api';
import { listPaymentMethodsByEmpresa } from '../features/settings/api/paymentMethods.api';
import { listDocumentTypesByEmpresa } from '../features/settings/api/documentTypes.api';
import { listUsersByEmpresa } from '../features/settings/api/users.api';
import { listRolesByEmpresa } from '../features/settings/api/roles.api';
import { listCategoriesByEmpresa } from '../features/settings/api/categories.api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const idEmpresa = user?.id_empresa;

  // Queries para obtener contadores
  const { data: branches = [] } = useQuery({
    queryKey: ['branches', idEmpresa],
    queryFn: () => listBranchesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: printers = [] } = useQuery({
    queryKey: ['printers', idEmpresa],
    queryFn: () => listPrintersByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['payment-methods', idEmpresa],
    queryFn: () => listPaymentMethodsByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: documentTypes = [] } = useQuery({
    queryKey: ['document-types', idEmpresa],
    queryFn: () => listDocumentTypesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users', idEmpresa],
    queryFn: () => listUsersByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles', idEmpresa],
    queryFn: () => listRolesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', idEmpresa],
    queryFn: () => listCategoriesByEmpresa(idEmpresa),
    enabled: !!idEmpresa,
  });

  const tiles = [
    {
      title: 'Empresa',
      subtitle: 'Configura la información de tu empresa',
      icon: FiBriefcase,
      path: '/settings/company',
      bgClass: 'bg-primary text-primary-content',
      count: 1,
      status: 'configured',
    },
    {
      title: 'Sucursales',
      subtitle: 'Gestiona tus sucursales',
      icon: FiMapPin,
      path: '/settings/branches',
      bgClass: 'bg-success text-success-content',
      count: branches.length,
      status: branches.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Almacenes',
      subtitle: 'Gestiona almacenes por sucursal',
      icon: FiArchive,
      path: '/settings/warehouses',
      bgClass: 'bg-info text-info-content',
      count: null,
      status: branches.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Cajas Registradoras',
      subtitle: 'Gestiona tus cajas registradoras',
      icon: FiHome,
      path: '/settings/cash-registers',
      bgClass: 'bg-warning text-warning-content',
      count: null,
      status: branches.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Impresoras',
      subtitle: 'Configura tus impresoras',
      icon: FiPrinter,
      path: '/settings/printers',
      bgClass: 'bg-info text-info-content',
      count: printers.length,
      status: printers.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Métodos de Pago',
      subtitle: 'Define métodos de pago',
      icon: FiCreditCard,
      path: '/settings/payment-methods',
      bgClass: 'bg-accent text-accent-content',
      count: paymentMethods.length,
      status: paymentMethods.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Tipos de Comprobantes',
      subtitle: 'Gestiona tipos de documentos',
      icon: FiFileText,
      path: '/settings/document-types',
      bgClass: 'bg-info text-info-content',
      count: documentTypes.length,
      status: documentTypes.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Serialización',
      subtitle: 'Configura series de comprobantes',
      icon: FiHash,
      path: '/settings/serialization',
      bgClass: 'bg-secondary text-secondary-content',
      count: null,
      status: documentTypes.length > 0 && branches.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Usuarios',
      subtitle: 'Administra usuarios del sistema',
      icon: FiUsers,
      path: '/settings/users',
      bgClass: 'bg-error text-error-content',
      count: users.length,
      status: users.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Roles y Permisos',
      subtitle: 'Define roles y permisos',
      icon: FiShield,
      path: '/settings/roles',
      bgClass: 'bg-warning text-warning-content',
      count: roles.length,
      status: roles.length > 0 ? 'configured' : 'pending',
    },
    {
      title: 'Categorías',
      subtitle: 'Organiza tus productos',
      icon: FiTag,
      path: '/settings/categories',
      bgClass: 'bg-success text-success-content',
      count: categories.length,
      status: categories.length > 0 ? 'configured' : 'pending',
    },
  ];

  const getStatusBadge = (status) => {
    if (status === 'configured') {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
          Configurado
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-warning/20 text-warning">
        Pendiente
        </span>
    );
  };

  const configuredCount = tiles.filter((t) => t.status === 'configured').length;
  const totalCount = tiles.length;
  const progressPercentage = Math.round((configuredCount / totalCount) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Configuración</h1>
        <p className="text-base-content/70 mt-2">
          Centraliza y gestiona la configuración de tu negocio
        </p>
      </div>

      {/* Progreso de Configuración */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-base-content">Progreso de Configuración</h2>
              <p className="text-sm text-base-content/60 mt-1">
                {configuredCount} de {totalCount} módulos configurados
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progressPercentage}%</div>
              <p className="text-xs text-base-content/60">Completado</p>
            </div>
          </div>
          <div className="w-full bg-base-300 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Grid de Módulos */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.title}
                onClick={() => navigate(tile.path)}
                className="w-full text-left rounded-xl border-2 border-base-300 bg-base-100 hover:bg-base-200 hover:border-primary/50 transition-all p-4 focus:outline-none focus:ring-2 focus:ring-primary group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg ${tile.bgClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  {getStatusBadge(tile.status)}
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-1">{tile.title}</h3>
                <p className="text-sm text-base-content/60 mb-2">{tile.subtitle}</p>
                {tile.count !== null && (
                  <div className="flex items-center gap-2 text-xs text-base-content/50">
                    <span className="font-medium">{tile.count}</span>
                    <span>registros</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Alertas de Configuración Pendiente */}
      {progressPercentage < 100 && (
        <Card className="mt-6">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-warning flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-medium text-base-content">Configuración Incompleta</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  Algunos módulos aún no están configurados. Completa la configuración para aprovechar todas las funcionalidades del sistema.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tiles
                    .filter((t) => t.status === 'pending')
                    .map((tile) => (
                      <button
                        key={tile.title}
                        onClick={() => navigate(tile.path)}
                        className="px-3 py-1 text-xs rounded-full bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                      >
                        {tile.title}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
