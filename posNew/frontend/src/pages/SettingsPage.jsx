import { useNavigate } from 'react-router-dom';
import { Card } from '../shared/components/ui';
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
} from 'react-icons/fi';

const tiles = [
  {
    title: 'Impresoras',
    subtitle: 'gestiona tus comprobantes de pago',
    icon: FiPrinter,
    path: '/settings/printers',
  },
  {
    title: 'Empresa',
    subtitle: 'configura tu empresa',
    icon: FiBriefcase,
    path: '/settings/company',
  },
  {
    title: 'Categorías de productos',
    subtitle: 'asigna categorías a tus productos',
    icon: FiTag,
    path: '/settings/categories',
  },
  {
    title: 'Productos',
    subtitle: 'registra tus productos',
    icon: FiPackage,
    path: '/products',
  },
  {
    title: 'Clientes',
    subtitle: 'gestiona tus clientes',
    icon: FiUser,
    path: '/settings/customers',
  },
  {
    title: 'Proveedores',
    subtitle: 'gestiona tus proveedores',
    icon: FiTruck,
    path: '/settings/providers',
  },
  {
    title: 'Métodos de pago',
    subtitle: 'gestiona tus métodos de pago',
    icon: FiCreditCard,
    path: '/settings/payment-methods',
  },
  {
    title: 'Sucursales y cajas',
    subtitle: 'gestiona tus sucursales y cajas',
    icon: FiHome,
    path: '/settings/branches-cajas',
  },
  {
    title: 'Usuarios',
    subtitle: 'gestiona tus usuarios',
    icon: FiUsers,
    path: '/settings/users',
  },
  {
    title: 'Almacenes',
    subtitle: 'gestiona tus almacenes por sucursales',
    icon: FiArchive,
    path: '/settings/warehouses',
  },
  {
    title: 'Configuración de ticket',
    subtitle: 'configura tu ticket personalizado',
    icon: FiFileText,
    path: '/settings/ticket',
  },
  {
    title: 'Serialización de comprobantes',
    subtitle: 'serializa tus comprobantes',
    icon: FiHash,
    path: '/settings/serialization',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Configuración</h1>
        <p className="text-base-content/70 mt-2">
          Centraliza y gestiona la configuración de tu negocio
        </p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.title}
                onClick={() => navigate(tile.path)}
                className="w-full text-left rounded-xl border border-base-300 bg-base-100 hover:bg-base-200 transition-colors p-4 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-content">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">{tile.title}</h3>
                    <p className="text-sm text-base-content/70">{tile.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
